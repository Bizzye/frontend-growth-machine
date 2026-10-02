import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { UsersList } from "@/features/users/components/users-list";

import { usersFixture } from "../../../fixtures/users";
import { bffUrl } from "../../../mocks/handlers";
import { server } from "../../../mocks/server";
import { renderWithProviders } from "../../../utils/render";

describe("<UsersList />", () => {
  it("shows a loading state and then the users table", async () => {
    renderWithProviders(<UsersList />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading users...");

    const table = await screen.findByRole("table");
    // header row + one row per user
    expect(within(table).getAllByRole("row")).toHaveLength(usersFixture.length + 1);
    expect(screen.getByText(`${usersFixture.length} registered users`)).toBeInTheDocument();
    expect(screen.getByText("Jane Cooper")).toBeInTheDocument();
    expect(screen.getByText("Mar 12, 1994")).toBeInTheDocument();
  });

  it("shows an empty state", async () => {
    server.use(http.get(bffUrl("/users"), () => HttpResponse.json([])));
    renderWithProviders(<UsersList />);

    expect(await screen.findByText("No users registered yet.")).toBeInTheDocument();
  });

  it("shows an error state and retries", async () => {
    server.use(http.get(bffUrl("/users"), () => HttpResponse.json({}, { status: 500 }), { once: true }));
    const { user } = renderWithProviders(<UsersList />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Could not load users");

    await user.click(within(alert).getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("table")).toBeInTheDocument();
  });
});
