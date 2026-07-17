import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StandupSectionEditor } from "@/components/standups/standup-section-editor";

describe("StandupSectionEditor", () => {
  it("renders existing items", () => {
    render(
      <StandupSectionEditor
        title="What did I do?"
        items={[{ id: "1", text: "Shipped the thing" }]}
        placeholder="Add an item, press Enter"
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("Shipped the thing")).toBeInTheDocument();
  });

  it("adds a new item when Enter is pressed in the input", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(
      <StandupSectionEditor
        title="What did I do?"
        items={[]}
        placeholder="Add an item, press Enter"
        onAdd={onAdd}
        onRemove={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText("Add an item, press Enter");
    await user.type(input, "Reviewed a PR{Enter}");

    expect(onAdd).toHaveBeenCalledWith("Reviewed a PR");
    expect(input).toHaveValue("");
  });

  it("does not call onAdd for a blank entry", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(
      <StandupSectionEditor
        title="What did I do?"
        items={[]}
        placeholder="Add an item, press Enter"
        onAdd={onAdd}
        onRemove={vi.fn()}
      />,
    );

    await user.type(
      screen.getByPlaceholderText("Add an item, press Enter"),
      "   {Enter}",
    );

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("removes an item when its remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <StandupSectionEditor
        title="What did I do?"
        items={[{ id: "item-1", text: "Shipped the thing" }]}
        placeholder="Add an item, press Enter"
        onAdd={vi.fn()}
        onRemove={onRemove}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /remove "shipped the thing"/i }),
    );

    expect(onRemove).toHaveBeenCalledWith("item-1");
  });
});
