import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { UserData } from "../types/user";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userData: UserData;
    isEditing?: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    userData,
    isEditing = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 border-b-[1px] border-[#292f46] text-xl" >
                    {isEditing ? "Confirmar Actualización" : "Confirmar Registro"}
                </ModalHeader>
                <ModalBody className="space-y-2 " >
                    <p><strong className="mr-1">Nombre completo:</strong> {userData.firstName} {userData.lastName} {userData.motherLastName}</p>
                    <p><strong className="mr-1">Fecha de nacimiento:</strong> {userData.birthDate}</p>
                    <p><strong className="mr-1">CURP:</strong> {userData.curp}</p>
                    <p><strong className="mr-1">Teléfono:</strong> {userData.phone}</p>
                    <p><strong className="mr-1">Correo:</strong> {userData.email}</p>
                    <p><strong className="mr-1">Nivel de estudios:</strong> {userData.education}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onPress={onConfirm}>
                        {isEditing ? "Actualizar" : "Confirmar"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
};