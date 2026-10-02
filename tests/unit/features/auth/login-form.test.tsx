import { screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { LoginForm } from "@/features/auth/components/login-form";

import { DEMO_USER } from "../../../fixtures/users";
import { renderWithProviders } from "../../../utils/render";

const signInMock = vi.mocked(signIn);

function setup() {
  const utils = renderWithProviders(<LoginForm />);

  return {
    ...utils,
    email: screen.getByLabelText("E-mail"),
    password: screen.getByLabelText("Password"),
    submit: screen.getByRole("button", { name: "Sign in" }),
  };
}

describe("<LoginForm />", () => {
  it("shows validation errors and does not submit invalid data", async () => {
    const { user, submit, email } = setup();

    await user.click(submit);

    expect(await screen.findByText("Please enter a valid e-mail")).toBeInTheDocument();
    expect(screen.getByText("Please enter your password")).toBeInTheDocument();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("signs in and redirects to /home", async () => {
    signInMock.mockResolvedValue({ ok: true, error: null, status: 200, url: null });
    const { user, email, password, submit } = setup();

    await user.type(email, DEMO_USER.email);
    await user.type(password, DEMO_USER.password);
    await user.click(submit);

    await waitFor(() => expect(useRouter().replace).toHaveBeenCalledWith("/home"));
    expect(signInMock).toHaveBeenCalledWith("credentials", {
      redirect: false,
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    });
  });

  it("disables the submit button while signing in", async () => {
    signInMock.mockReturnValue(new Promise(() => {}));
    const { user, email, password, submit } = setup();

    await user.type(email, DEMO_USER.email);
    await user.type(password, DEMO_USER.password);
    await user.click(submit);

    expect(await screen.findByRole("button", { name: "Signing in..." })).toBeDisabled();
  });

  it("shows a toast when the credentials are invalid", async () => {
    signInMock.mockResolvedValue({ ok: false, error: "INVALID_CREDENTIALS", status: 401, url: null });
    const { user, email, password, submit } = setup();

    await user.type(email, "ghost@example.com");
    await user.type(password, "whatever");
    await user.click(submit);

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(useRouter().replace).not.toHaveBeenCalled();
  });

  it("links to the sign up page", () => {
    setup();
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/register");
  });
});
