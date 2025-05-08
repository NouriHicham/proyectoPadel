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
import { eliminarClub, eliminarEquipo } from "@/lib/database";
import toast from "react-hot-toast";
import { useClubData } from "@/hooks/useEquipos";
import { useNavigate } from "react-router-dom";

export default function AlertConfirmation({ id, type }) {
  const { getClubData, clubData } = useClubData();

  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      if (!id) return;

      if (type === "team") {
        const success = await eliminarEquipo(id);

        if (success) {
          toast.success("Equipo eliminado correctamente.");
          getClubData(clubData?.id);
        }
      } else if (type == "club") {
        const success = await eliminarClub(id);

        if (success) {
          toast.success("Club eliminado correctamente.");
          navigate("/");
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
          className="h-8 px-2 hover:bg-gray-200 hover:text-black transition-colors"
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

            {type === "club" &&
              "¿Estás seguro de que deseas eliminar este club? Esta acción eliminará el club y todos los datos relacionados con este."}
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
