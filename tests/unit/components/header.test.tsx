import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signOut, useSession } from "next-auth/react";

import { Header } from "@/components/layout/header";

const useSessionMock = vi.mocked(useSession);

describe("<Header />", () => {
  it("greets the signed-in user", () => {
    useSessionMock.mockReturnValue({
      data: { user: { id: "1", name: "Jane Cooper" }, expires: "" },
      status: "authenticated",
      update: vi.fn(),
    });

    render(<Header />);

    expect(screen.getByText("Jane Cooper")).toBeInTheDocument();
  });

  it("signs the user out", async () => {
    render(<Header />);

    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
