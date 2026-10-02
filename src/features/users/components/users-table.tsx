import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/types/user";

import { UsersTableRow } from "./users-table-row";

/** `className` hides secondary columns on small screens (kept in sync with UsersTableRow). */
const COLUMNS = [
  { key: "name", label: "Name", className: "" },
  { key: "email", label: "E-mail", className: "hidden sm:table-cell" },
  { key: "birthDate", label: "Birth date", className: "hidden md:table-cell" },
  { key: "createdAt", label: "Member since", className: "" },
] as const;

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <Table>
      <TableCaption>
        {users.length} registered {users.length === 1 ? "user" : "users"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          {COLUMNS.map((column) => (
            <TableHead key={column.key} className={column.className}>
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UsersTableRow key={user.id} user={user} />
        ))}
      </TableBody>
    </Table>
  );
}
