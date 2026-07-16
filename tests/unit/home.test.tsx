import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home", () => {
  it("renders the foundation confirmation heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /numida engineering hub — frontend foundation/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the ShadCN UI smoke-test button", () => {
    render(<Home />);

    expect(
      screen.getByRole("button", { name: /shadcn ui is wired up/i }),
    ).toBeInTheDocument();
  });
});
