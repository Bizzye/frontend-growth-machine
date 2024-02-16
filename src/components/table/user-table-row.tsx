import { UserTableRowProps } from "@/interfaces/table.interface";
import { TableCell, TableRow } from "../ui/table";

export function UserTableRow({ id, email, firstName, lastName, birthDate, createdAt }: UserTableRowProps) {
    return (
        <TableRow>
            <TableCell>
                {id}
            </TableCell>
            <TableCell>
                {email}
            </TableCell>
            <TableCell>
                {firstName}
            </TableCell>
            <TableCell>
                {lastName}
            </TableCell>
            <TableCell>
                { birthDate && new Intl.DateTimeFormat('pt-br').format(new Date(birthDate))}
            </TableCell>
            <TableCell>
                {new Intl.DateTimeFormat('pt-br').format(new Date(createdAt))}
            </TableCell>
        </TableRow>
    )
}