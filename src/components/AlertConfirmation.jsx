import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { eliminarEquipo } from "@/lib/database";
import toast from "react-hot-toast";
import { useClubData } from "@/hooks/useEquipos";

export default function AlertConfirmation({ id, type }) {
  const { getClubData, clubData} = useClubData();

  const handleDelete = async () => {
    try {
      if (!id) return;

      if (type === "team") {
        const success = await eliminarEquipo(id);

        if (success) {
          toast.success("Equipo eliminado correctamente.");
          getClubData(clubData?.id);
        }
      }
    } catch (error) {
      toast.error("Ocurrió un error al eliminar.");
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full h-8 px-2 hover:bg-gray-200 hover:text-black transition-colors"
        >
          <Trash2 />
          <span className="hidden md:block">Eliminar</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {type === "team" &&
              "¿Estás seguro de que deseas eliminar este equipo? Esta acción eliminará todos los datos relacionados con el equipo."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className={"bg-red-600"} onClick={handleDelete}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
