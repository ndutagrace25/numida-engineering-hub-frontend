import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NewPostDialog } from "@/components/aob/new-post-dialog";

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

  it("submits the form and closes the dialog", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<NewPostDialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "New post" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Title"), "New process rollout");
    await user.type(
      screen.getByLabelText("Body"),
      "Details about the rollout.",
    );
    await user.click(screen.getByRole("button", { name: "Post" }));

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New process rollout",
        body: "Details about the rollout.",
        tag: "Process",
      }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
