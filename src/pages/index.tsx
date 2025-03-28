import { PreviewModal } from "@/components/preview-modal";
import { title, subtitle } from "@/components/primitives";
import { RegistrationForm } from "@/components/registration-form";
import { UserList } from "@/components/user-list";
import DefaultLayout from "@/layouts/default";
import { addUser, getUsers, updateUser } from "@/services/user";
import { UserData } from "@/types/user";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<(UserData & { id: string })[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const loadedUsers = await getUsers();
      setUsers(loadedUsers as (UserData & { id: string })[]);
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        color: "danger",
      });
    }
  };

  const handleFormSubmit = (data: UserData) => {
    setCurrentUser(data);
    setIsPreviewOpen(true);
  };

  const handleConfirm = async () => {
    if (!currentUser) return;

    try {
      if (editingUserId) {
        await updateUser(editingUserId, currentUser);
        addToast({
          title: "Actualización exitosa",
          description: "Los datos han sido actualizados correctamente",
          color: "success",
        });
      } else {
        const result = await addUser(currentUser);
        if (!result) throw new Error("Failed to add user");
        addToast({
          title: "Registro exitoso",
          description: "Los datos han sido guardados correctamente",
          color: "success",
        });
      }
      setIsPreviewOpen(false);

      setTimeout(() => {
        setEditingUserId(null);
        setCurrentUser(null);
      }, 0);

      loadUsers();
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudo guardar la información",
        color: "danger",
      });
    }
  };

  const handleEdit = (user: UserData & { id: string }) => {
    setCurrentUser(user);
    setEditingUserId(user.id);
  };

  const handleDelete = (userId: string) => {
    // Update the local state to remove the deleted user
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const resetForm = () => {
    setCurrentUser(null);
    setEditingUserId(null);
  };

  return (
    <DefaultLayout>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-full md:w-[600px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]">
        </div>
      </div>
      <section className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Formulario&nbsp;</span>
          <span className={title({ color: "pink" })}>HTML&nbsp;</span>
          <div className={subtitle({ class: "mt-4" })}>
            Actividad 2, 3 y 4
          </div>
        </div>
        <Card className="w-full max-w-lg p-3 md:p-6 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20">
          <h1 className={`${title({ color: "violet", size: 'xs' })} mb-2 flex items-center justify-between`}>
            {editingUserId ? "Editar Usuario" : "Registro de Usuarios"}
            {editingUserId && (
              <Button
                className="ml-4"
                color="danger"
                variant="ghost"
                size="sm"
                onPress={resetForm}
              >
                Cancelar Edición
              </Button>
            )}
          </h1>
          <RegistrationForm
            onSubmit={handleFormSubmit}
            initialData={currentUser}
            key={editingUserId || 'new'}
          />
        </Card>
        <div className="absolute left-0 -bottom-32 md:bottom-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-blue-400 opacity-20 blur-[100px]">
        </div>
        <Card className="mt-10 w-full max-w-lg md:max-w-full p-3 md:p-6 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20">
          <h2 className={`${title({ color: "blue", size: 'xs' })} mb-2 flex items-center justify-between`}>
            Usuarios Registrados
          </h2>
          <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
        </Card>

        {currentUser && (
          <PreviewModal
            isOpen={isPreviewOpen}
            onClose={() => {
              setIsPreviewOpen(false);
            }}
            onConfirm={handleConfirm}
            userData={currentUser}
            isEditing={!!editingUserId}
          />
        )}
      </section>
    </DefaultLayout>
  );
}
