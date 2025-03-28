import React, { useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableColumn, SortDescriptor } from "@heroui/table";
import { UserData } from "../types/user";
import { Button, ButtonGroup } from "@heroui/button";
import { EditIcon, DeleteIcon } from "./icons";
import { Card } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import { deleteUser } from "../services/user";
import { addToast } from "@heroui/toast";

interface UserListProps {
    users: (UserData & { id: string })[];
    onEdit: (user: UserData & { id: string }) => void;
    onDelete?: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userToDelete, setUserToDelete] = React.useState<{ id: string, name: string } | null>(null);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "lastName",
        direction: "ascending"
    });

    const sortedItems = useMemo(() => {
        return [...users].sort((a, b) => {
            let first = a[sortDescriptor.column as keyof typeof a] as string;
            let second = b[sortDescriptor.column as keyof typeof b] as string;

            first = String(first).toLowerCase();
            second = String(second).toLowerCase();

            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, users]);

    const handleDeleteClick = (user: UserData & { id: string }) => {
        setUserToDelete({
            id: user.id,
            name: `${user.lastName} ${user.motherLastName} ${user.firstName}`
        });
        onOpen();
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete.id);
            onDelete?.(userToDelete.id);
            addToast({
                title: "Usuario eliminado",
                description: "El usuario ha sido eliminado correctamente",
                color: "success"
            });
            onClose();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <>
            <Card className="w-full p-6 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20">
                <Table
                    aria-label="Lista de usuarios registrados"
                    sortDescriptor={sortDescriptor}
                    onSortChange={(descriptor) => setSortDescriptor(descriptor)}
                    className="overflow-x-auto"
                    removeWrapper
                    isHeaderSticky
                    isCompact
                >
                    <TableHeader>
                        <TableColumn key="lastName" allowsSorting>Apellido Paterno</TableColumn>
                        <TableColumn key="motherLastName" allowsSorting>Apellido Materno</TableColumn>
                        <TableColumn key="firstName" allowsSorting>Nombre</TableColumn>
                        <TableColumn key="curp">CURP</TableColumn>
                        <TableColumn key="birthDate" allowsSorting>Fecha Nacimiento</TableColumn>
                        <TableColumn key="phone">Teléfono</TableColumn>
                        <TableColumn key="email">Correo</TableColumn>
                        <TableColumn key="education">Estudios</TableColumn>
                        <TableColumn key="actions">Acciones</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No hay usuarios registrados">
                        {sortedItems.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.motherLastName}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.curp}</TableCell>
                                <TableCell>{user.birthDate}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.education}</TableCell>
                                <TableCell>
                                    <ButtonGroup size="sm" variant="flat">
                                        <Button
                                            isIconOnly
                                            onPress={() => onEdit(user)}
                                            aria-label="Editar usuario"
                                        >
                                            <EditIcon className="size-4" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            color="danger"
                                            onPress={() => handleDeleteClick(user)}
                                            aria-label="Eliminar usuario"
                                        >
                                            <DeleteIcon className="size-4" />
                                        </Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Confirmar eliminación
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    ¿Está seguro que desea eliminar al usuario <span className="font-semibold">{userToDelete?.name}</span>?
                                </p>
                                <p className="text-danger text-sm">
                                    Esta acción no se puede deshacer.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button color="danger" onPress={confirmDelete}>
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};