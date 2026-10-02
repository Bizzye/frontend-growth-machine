import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { User } from "@/types/user";

interface UsersTableRowProps {
  user: User;
}

export function UsersTableRow({ user }: UsersTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">
          {user.firstName} {user.lastName}
        </div>
        {/* On small screens the e-mail column is hidden, so it is shown under the name. */}
        <div className="text-xs break-all text-muted-foreground sm:hidden">{user.email}</div>
      </TableCell>
      <TableCell className="hidden text-muted-foreground sm:table-cell">{user.email}</TableCell>
      <TableCell className="hidden md:table-cell">{formatDate(user.birthDate)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(user.createdAt)}</TableCell>
    </TableRow>
  );
}
