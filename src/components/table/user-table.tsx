import { UserTableRowProps } from "@/interfaces/table.interface";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { UserTableRow } from "./user-table-row";

interface IProps {
    dados: UserTableRowProps[];
}

export function UserTable({ dados }: IProps) {
    const keys = [ 
        { id: 'id', label: 'Id' },
        { id: 'email', label: 'Email' },
        { id: 'firstName', label: 'Nome' },
        { id: 'lastName', label: 'Sobrenome' },
        { id: 'birthDate', label: 'Data de nascimento' },
        { id: 'createdAt', label: 'Data de criação' },
    ]

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {
                        keys.map(key => {
                            return (
                                    <TableHead key={key.id}>
                                        {key.label}
                                    </TableHead>
                            )
                        })
                    }
                </TableRow>
            </TableHeader>
            {
                dados.map(item => {
                    return (
                        <TableBody key={item.id}>
                            <UserTableRow {...item}  />
                        </TableBody>
                    )
                })
            }
        </Table>
    )
}