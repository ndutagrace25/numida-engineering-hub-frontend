import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NewPostDialog } from "@/components/aob/new-post-dialog";

function axiosLikeError(status: number, fields: Record<string, string[]>) {
  return Object.assign(new Error("Request failed"), {
    isAxiosError: true,
    response: {
      status,
      data: {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed.",
          fields,
        },
      },
    },
  });
}

describe("NewPostDialog", () => {
  it("is closed by default", () => {
    render(<NewPostDialog onCreate={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on trigger click and shows the form", async () => {
    const user = userEvent.setup();
    render(<NewPostDialog onCreate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "New post" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Body")).toBeInTheDocument();
    expect(screen.getByLabelText("Link (optional)")).toBeInTheDocument();
  });

  it("rejects an empty title and does not call onCreate", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<NewPostDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New post" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Post" }));

    expect(await screen.findByText("Title is required")).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("rejects a link that isn't HTTPS", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<NewPostDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New post" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Title"), "New process rollout");
    await user.type(
      screen.getByLabelText("Link (optional)"),
      "http://example.com",
    );
    await user.click(screen.getByRole("button", { name: "Post" }));

    expect(await screen.findByText("Must be an HTTPS URL")).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("submits the form and closes the dialog", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<NewPostDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New post" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Title"), "New process rollout");
    await user.type(
      screen.getByLabelText("Body"),
      "Details about the rollout.",
    );
    await user.type(
      screen.getByLabelText("Link (optional)"),
      "https://example.com/rollout",
    );
    await user.click(screen.getByRole("button", { name: "Post" }));

    expect(onCreate).toHaveBeenCalledWith({
      title: "New process rollout",
      description: "Details about the rollout.",
      externalUrl: "https://example.com/rollout",
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("maps a backend field validation error onto the matching input", async () => {
    const user = userEvent.setup();
    const onCreate = vi
      .fn()
      .mockRejectedValue(
        axiosLikeError(400, { title: ["This field may not be blank."] }),
      );
    render(<NewPostDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New post" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Title"), "New process rollout");
    await user.click(screen.getByRole("button", { name: "Post" }));

    expect(
      await screen.findByText("This field may not be blank."),
    ).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes without calling onCreate when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<NewPostDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New post" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCreate).not.toHaveBeenCalled();
  });
});
