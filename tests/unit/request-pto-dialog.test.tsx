import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RequestPTODialog } from "@/components/pto/request-pto-dialog";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { id: 1, displayName: "Grace Nduta", email: "grace@numida.com" },
  }),
}));

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

describe("RequestPTODialog", () => {
  beforeEach(() => vi.clearAllMocks());

  it("is closed by default", () => {
    render(<RequestPTODialog onCreate={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on trigger click and addresses the request to the signed-in user", async () => {
    const user = userEvent.setup();
    render(<RequestPTODialog onCreate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Request PTO" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Grace Nduta/)).toBeInTheDocument();
  });

  it("rejects an end date before the start date", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<RequestPTODialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Request PTO" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Start date"), "2026-08-10");
    await user.type(screen.getByLabelText("End date"), "2026-08-01");
    await user.click(screen.getByRole("button", { name: "Submit request" }));

    expect(
      await screen.findByText("End date can't be before the start date"),
    ).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("submits with reason and handoverUrl, then closes the dialog", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<RequestPTODialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Request PTO" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Start date"), "2026-08-10");
    await user.type(screen.getByLabelText("End date"), "2026-08-12");
    await user.type(screen.getByLabelText("Reason (optional)"), "Trip");
    await user.type(
      screen.getByLabelText("Handover notes URL (optional)"),
      "https://example.com/notes",
    );
    await user.click(screen.getByRole("button", { name: "Submit request" }));

    expect(onCreate).toHaveBeenCalledWith({
      startDate: "2026-08-10",
      endDate: "2026-08-12",
      reason: "Trip",
      handoverUrl: "https://example.com/notes",
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("rejects a handover URL that isn't HTTPS", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<RequestPTODialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Request PTO" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Start date"), "2026-08-10");
    await user.type(screen.getByLabelText("End date"), "2026-08-12");
    await user.type(
      screen.getByLabelText("Handover notes URL (optional)"),
      "http://example.com/notes",
    );
    await user.click(screen.getByRole("button", { name: "Submit request" }));

    expect(await screen.findByText("Must be an HTTPS URL")).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("maps a backend field validation error onto the matching input", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockRejectedValue(
      axiosLikeError(400, {
        end_date: ["End date cannot be earlier than start date."],
      }),
    );
    render(<RequestPTODialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Request PTO" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByLabelText("Start date"), "2026-08-10");
    await user.type(screen.getByLabelText("End date"), "2026-08-12");
    await user.click(screen.getByRole("button", { name: "Submit request" }));

    expect(
      await screen.findByText("End date cannot be earlier than start date."),
    ).toBeInTheDocument();
    // The dialog stays open so the user can fix the field.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes without calling onCreate when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<RequestPTODialog onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Request PTO" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCreate).not.toHaveBeenCalled();
  });
});
