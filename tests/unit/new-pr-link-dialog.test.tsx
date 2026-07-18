import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NewPRLinkDialog } from "@/components/pull-requests/new-pr-link-dialog";

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

describe("NewPRLinkDialog", () => {
  it("is closed by default", () => {
    render(<NewPRLinkDialog onCreate={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on trigger click and defaults status to Open", async () => {
    const user = userEvent.setup();
    render(<NewPRLinkDialog onCreate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "New PR link" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("URL")).toBeInTheDocument();
    expect(screen.getByLabelText("Group")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("rejects an empty title and does not call onCreate", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<NewPRLinkDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New PR link" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Title is required")).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("rejects a non-HTTPS URL", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<NewPRLinkDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New PR link" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Title"), "Fix login bug");
    await user.type(screen.getByLabelText("URL"), "http://example.com/pr/1");
    await user.type(screen.getByLabelText("Group"), "numida-core");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Must be an HTTPS URL")).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("submits the form and closes the dialog", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<NewPRLinkDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New PR link" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Title"), "Fix login bug");
    await user.type(
      screen.getByLabelText("URL"),
      "https://github.com/org/repo/pull/1",
    );
    await user.type(screen.getByLabelText("Group"), "numida-core");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onCreate).toHaveBeenCalledWith({
      title: "Fix login bug",
      url: "https://github.com/org/repo/pull/1",
      groupName: "numida-core",
      status: "OPEN",
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("maps a backend field validation error onto the matching input", async () => {
    const user = userEvent.setup();
    const onCreate = vi
      .fn()
      .mockRejectedValue(axiosLikeError(400, { url: ["Enter a valid URL."] }));
    render(<NewPRLinkDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New PR link" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Title"), "Fix login bug");
    await user.type(
      screen.getByLabelText("URL"),
      "https://github.com/org/repo/pull/1",
    );
    await user.type(screen.getByLabelText("Group"), "numida-core");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Enter a valid URL.")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes without calling onCreate when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<NewPRLinkDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New PR link" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCreate).not.toHaveBeenCalled();
  });
});
