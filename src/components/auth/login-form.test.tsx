import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LoginForm } from "@/components/auth/login-form";
import { login } from "@/lib/client/api";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/lib/client/api", () => ({
  login: jest.fn(),
  ApiError: class ApiError extends Error {},
}));

import { useRouter } from "next/navigation";

const mockedLogin = login as jest.Mock;
const replace = jest.fn();
const refresh = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ replace, refresh });
});

describe("LoginForm", () => {
  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm next="/invoices" />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it("submits credentials and redirects on success", async () => {
    mockedLogin.mockResolvedValue({ profile: { fullName: "Jane Doe" } });
    const user = userEvent.setup();
    render(<LoginForm next="/invoices" />);

    await user.type(screen.getByLabelText("Username"), "94756921275");
    await user.type(screen.getByLabelText("Password"), "Password@12345");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(mockedLogin).toHaveBeenCalledWith({
        username: "94756921275",
        password: "Password@12345",
      }),
    );
    expect(replace).toHaveBeenCalledWith("/invoices");
  });
});
