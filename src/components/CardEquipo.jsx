import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Calendar,
  ArrowRight,
  Check,
  Info,
  X,
  Pen,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  aceptarInvitacion,
  getMiembrosEquipo,
  getUltimoPartidoaJugar,
  getUltimosPartidosJugados,
  solicitarUnirseEquipo,
} from "@/lib/database";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import AlertConfirmation from "./AlertConfirmation";

export default function CardEquipo({
  equipo,
  invitation = false,
  solicitar = false,
  gestionar = false,
  // getClubData = undefined
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const { setEquipoPersona, equipoPersona } = useAuth();
  const navigate = useNavigate();
  const personaId = JSON.parse(localStorage.getItem("user")).persona[0]?.id;
  const equipoId = equipo?.equipo_id || equipo?.id;
  const [numMiembros, setMiembros] = useState();
  const [partidojugar, setPartidojugar] = useState(null);

  const handleSeleccionEquipo = () => {
    if (!invitation) {
      setEquipoPersona(equipo);
      navigate("/");
    } else {
      // Si es una invitación, setear la invitacion como 'aceptada' y guardar en local storage este equipo y navegar a /
    }
  };

  const handleAceptar = async (aceptar) => {
    try {
      if (aceptar) {
        const data = await aceptarInvitacion(personaId, equipoId, "aceptado");
      } else {
        const data = await aceptarInvitacion(personaId, equipoId, "rechazado");
      }
    } catch (error) {
      console.error("Error al aceptar la invitacion:", error);
    }
  };

  const handleSolicitarUnirme = async () => {
    try {
      if (!solicitar || !personaId) return;
      console.log(personaId);
      const data = await solicitarUnirseEquipo(personaId, equipoId);

      console.log("solicitud: ", data);
      if (data) {
        return toast.success("Solicitud enviada al equipo.");
      }
    } catch (error) {
      console.error("Error al solicitar unirse:", error);
    }
  };

  useEffect(() => {
    const miembros = async () => {
      try {
        const data = await getMiembrosEquipo(equipoId);
        const partido = await getUltimoPartidoaJugar(equipoId);
        setPartidojugar(partido);
        setMiembros(data);
      } catch (e) {
        console.error("Error al obtener los miembros del equipo:", e);
      }
    };
    miembros();
  }, []);

  console.log(partidojugar);

  return (
    <Card className="overflow-hidden w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <Avatar className={`h-12 w-12 ${equipo?.avatarColor || "Equipo"}`}>
            {/* Iniciales del equipo */}
            <AvatarFallback>{equipo?.equipo_id || equipo?.id}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>
              {equipo?.equipos?.nombre || equipo?.nombre || "Equipo"}
            </CardTitle>
            <CardDescription className="line-clamp-1">
              {equipo?.equipos?.descripcion || equipo?.descripcion || ""}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {numMiembros || ""} miembros
              </span>
            </div>
            <Badge variant="outline">
              {user.persona[0].id ==
              (equipo?.equipos?.capitan_id || equipo?.capitan_id)
                ? "Capitan"
                : user.persona[0].id ==
                  (equipo?.equipos?.subcapitan_id || equipo?.subcapitan_id)
                ? "Subcapitan"
                : "Jugador"}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Próx. partido:{" "}
                {partidojugar?.length > 0
                  ? new Intl.DateTimeFormat("es-ES", {
                      dateStyle: "medium",
                    }).format(new Date(partidojugar[0].fecha))
                  : "Sin partidos"}
              </span>
            </div>
          </div>

          {/* Mostrar detalles */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="ml-auto h-8 w-full justify-between px-2"
              >
                <span>Detalles</span> <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{equipo?.name}</DialogTitle>
                <DialogDescription>
                  Anyone who has this link will be able to view this.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    defaultValue="https://ui.shadcn.com/docs/installation"
                    readOnly
                  />
                </div>
                <Button type="submit" size="sm" className="px-3">
                  <span className="sr-only">Copy</span>
                  <Copy />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            variant="ghost"
            className="ml-auto h-8 w-full justify-between px-2"
          >
            Detalles
            <Info className="h-4 w-4" />
          </Button> */}
          {/* <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              Miembros
              {memberAvatars}
              {team.members > 3 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                  +{team.members - 3}
                </div>
              )}
            </div>
          </div> */}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        {invitation ? (
          <>
            <Button
              variant=""
              className="ml-auto h-8 w-1/2 justify-between px-2 hover:bg-gray-200 hover:text-black transition-colors"
              onClick={() => handleAceptar(true)}
            >
              <span>Unirme al equipo</span>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="ml-auto h-8 w-1/2 justify-between px-2 hover:bg-gray-200 transition-colors"
              onClick={() => handleAceptar(false)}
            >
              <span>Rechazar invitación</span>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : solicitar ? (
          <Button
            variant=""
            className="ml-auto h-8 w-full justify-between px-2 hover:bg-gray-200 hover:text-black transition-colors"
            onClick={handleSolicitarUnirme}
          >
            <span>Solicitar unirme a este equipo</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : gestionar ? (
          // operaciones crud
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 w-full">
            <Button
              variant=""
              className="px-2 h-8 hover:bg-gray-200 hover:text-black transition-colors"
            >
              <Pen />
              <span className="hidden md:block">Editar</span>
            </Button>
            <AlertConfirmation id={equipo?.id} type={"team"} />
            {/* <Button
              variant=""
              className="px-2 h-8 hover:bg-gray-200 hover:text-black transition-colors"
            >
              <Settings />
              <span className="hidden md:block">Gestionar</span>
            </Button> */}
          </div>
        ) : (
          <Button
            variant=""
            className={cn(
              "ml-auto h-8 w-full justify-between px-2 hover:bg-gray-200 hover:text-black transition-colors",
              equipoPersona?.equipo_id == equipo?.equipo_id && "bg-green-700"
            )}
            onClick={handleSeleccionEquipo}
          >
            <span>
              {equipoPersona?.equipo_id == equipo?.equipo_id
                ? "Equipo Seleccionado"
                : "Seleccionar este equipo"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
