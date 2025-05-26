"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Ajusta la ruta según tu estructura
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { aceptarInvitacion, getSolicitudesClub } from "@/lib/database";
import { CheckCircle, X } from "lucide-react";
import toast from "react-hot-toast";

export default function SolicitudesClub({ clubId }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await getSolicitudesClub(clubId);
      setSolicitudes(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, [clubId]);

  console.log("clubid hola", clubId);
  console.log("solis", solicitudes);

  const handleAceptar = async (persona_id, equipoId, aceptar) => {
    try {
      if (!persona_id || !equipoId) return;
      const result = await aceptarInvitacion(
        persona_id,
        equipoId,
        aceptar ? "aceptado" : "rechazado"
      );

      if (!result) {
        toast.error("Ha ocurrido un error inesperado.");
        return;
      }

      if (result.success) {
        toast.success("Solicitud aceptada correctamente.");
      } else {
        toast.error("Solicitiud rechazada correctamente.");
      }

      fetchSolicitudes();
    } catch (error) {
      console.error("Error al aceptar la invitación:", error);
      toast.error("Ha ocurrido un error al procesar la invitación.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="relative">
          <span>Solicitudes</span>
          <span className="absolute -top-1 -right-1 flex items-center justify-center size-5 rounded-full bg-red-600 text-xs text-white">
            {solicitudes.length}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Solicitudes de tu club</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : solicitudes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay solicitudes pendientes.
          </div>
        ) : (
          <ul className="divide-y divide-muted-foreground/10 max-h-80 overflow-y-auto">
            {solicitudes.map((solicitud) => (
              <li
                key={solicitud.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center gap-2"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {solicitud.personas?.nombre} {solicitud.personas?.apellido}
                    <span className="ml-2 text-xs text-gray-400">
                      {solicitud.personas?.posicion}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Quiere unirse al Equipo:{" "}
                    <span className="font-semibold">
                      {solicitud.equipos?.nombre || "-"}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Email: {solicitud.personas?.email}
                  </p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 rounded px-2 py-1">
                  {solicitud.estado}
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle
                    size={20}
                    className="text-green-600 cursor-pointer"
                    onClick={() =>
                      handleAceptar(
                        solicitud?.persona_id,
                        solicitud?.equipos?.id,
                        true
                      )
                    }
                  />
                  <X
                    size={20}
                    className="text-red-600 cursor-pointer"
                    onClick={() =>
                      handleAceptar(
                        solicitud?.persona_id,
                        solicitud?.equipos?.id,
                        false
                      )
                    }
                  />
                </span>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
