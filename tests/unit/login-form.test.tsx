import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/auth/login-form";

const pushMock = vi.fn();
const loginMock = vi.fn();
let searchParamsValue = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => searchParamsValue,
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ login: loginMock }),
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

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchParamsValue = new URLSearchParams();
  });

  it("submits valid credentials and redirects to /dashboard by default", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({});
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Work email"), "grace@numida.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith({
        email: "grace@numida.com",
        password: "secret123",
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects to the ?next= target after a successful login", async () => {
    searchParamsValue = new URLSearchParams("next=%2Fpto");
    const user = userEvent.setup();
    loginMock.mockResolvedValue({});
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Work email"), "grace@numida.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/pto"));
  });

  it("ignores an unsafe ?next= target and falls back to /dashboard", async () => {
    searchParamsValue = new URLSearchParams("next=%2F%2Fevil.example.com");
    const user = userEvent.setup();
    loginMock.mockResolvedValue({});
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Work email"), "grace@numida.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
  });

  it("shows a validation message for a missing email without calling login", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      await screen.findByText("Work email is required"),
    ).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("shows the backend's invalid-credentials message on a 400 response", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValue(
      axiosLikeError(400, {
        non_field_errors: ["Unable to log in with the provided credentials."],
      }),
    );
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Work email"), "grace@numida.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      await screen.findByText(
        "Unable to log in with the provided credentials.",
      ),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("maps a backend field-level validation error onto the matching input", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValue(
      axiosLikeError(400, { email: ["Enter a valid email address."] }),
    );
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Work email"), "grace@numida.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();
  });

  it("disables the submit button while the login request is pending", async () => {
    const user = userEvent.setup();
    let resolveLogin!: (value: unknown) => void;
    loginMock.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Work email"), "grace@numida.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      await screen.findByRole("button", { name: "Logging in…" }),
    ).toBeDisabled();
    resolveLogin({});
  });
});
