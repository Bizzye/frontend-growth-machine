import { render, screen, within } from "@testing-library/react";

import { UsersTable } from "@/features/users/components/users-table";

import { toPublicUser, usersFixture } from "../../../fixtures/users";

describe("<UsersTable />", () => {
  it("renders the column headers", () => {
    render(<UsersTable users={[]} />);

    const headers = screen.getAllByRole("columnheader").map((header) => header.textContent);
    expect(headers).toEqual(["Name", "E-mail", "Birth date", "Member since"]);
  });

  it("renders a single body with one row per user", () => {
    const { container } = render(<UsersTable users={usersFixture.map(toPublicUser)} />);

    expect(container.querySelectorAll("tbody")).toHaveLength(1);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(usersFixture.length);
  });

  it("shows a dash when the birth date is missing", () => {
    const userWithoutBirthDate = toPublicUser(usersFixture.find((user) => !user.birthDate)!);
    render(<UsersTable users={[userWithoutBirthDate]} />);

    const row = screen.getByText("Esther Howard").closest("tr")!;
    expect(within(row).getByText("—")).toBeInTheDocument();
    expect(screen.getByText("1 registered user")).toBeInTheDocument();
  });
});
