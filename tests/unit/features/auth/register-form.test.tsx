import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { RegisterForm } from "@/features/auth/components/register-form";

import { DEMO_USER } from "../../../fixtures/users";
import { apiUrl } from "../../../mocks/handlers";
import { server } from "../../../mocks/server";
import { renderWithProviders } from "../../../utils/render";

const signInMock = vi.mocked(signIn);

async function fillForm(user: ReturnType<typeof renderWithProviders>["user"], email: string) {
  await user.type(screen.getByLabelText("First name"), "John");
  await user.type(screen.getByLabelText("Last name"), "Doe");
  await user.type(screen.getByLabelText("Birth date"), "1990-05-20");
  await user.type(screen.getByLabelText("E-mail"), email);
  await user.type(screen.getByLabelText("Password"), DEMO_USER.password);
  await user.click(screen.getByRole("button", { name: "Create account" }));
}

describe("<RegisterForm />", () => {
  it("validates every field", async () => {
    const { user } = renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText("Password"), "weak");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("First name must be at least 3 characters long")).toBeInTheDocument();
    expect(screen.getByText("Last name must be at least 3 characters long")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid e-mail")).toBeInTheDocument();
    expect(screen.getByText(/Password must be at least 8 characters/)).toBeInTheDocument();
  });

  it("creates the account, signs in and redirects", async () => {
    signInMock.mockResolvedValue({ ok: true, error: null, status: 200, url: null });
    let requestBody: unknown;
    server.use(
      http.post(apiUrl("/users"), async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({}, { status: 201 });
      }),
    );
    const { user } = renderWithProviders(<RegisterForm />);

    await fillForm(user, "john.doe@example.com");

    await waitFor(() => expect(useRouter().replace).toHaveBeenCalledWith("/home"));
    expect(requestBody).toEqual({
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-05-20T00:00:00.000Z",
      email: "john.doe@example.com",
      password: DEMO_USER.password,
    });
    expect(signInMock).toHaveBeenCalledOnce();
  });

  it("disables the submit button while creating the account", async () => {
    server.use(http.post(apiUrl("/users"), () => new Promise<Response>(() => {})));
    const { user } = renderWithProviders(<RegisterForm />);

    await fillForm(user, "pending@example.com");

    expect(await screen.findByRole("button", { name: "Creating account..." })).toBeDisabled();
  });

  it("shows a toast when the e-mail is already registered", async () => {
    const { user } = renderWithProviders(<RegisterForm />);

    await fillForm(user, DEMO_USER.email);

    expect(await screen.findByText("User already registered")).toBeInTheDocument();
    expect(signInMock).not.toHaveBeenCalled();
  });
});
