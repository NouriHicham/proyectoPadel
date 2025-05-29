"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  MoreHorizontal,
  Trash2Icon,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { getDisponibilidad, updatePistasPartido } from "@/lib/database";
import toast from "react-hot-toast";

export function PartidosList({ partidos }) {
  // Agrupar por equipos enfrentados (nombre equipo1 vs nombre equipo2)
  const equiposMap = new Map();

  partidos?.forEach((partido) => {
    const equipoKey = `${partido.equipo1?.nombre ?? "Equipo 1"} vs ${
      partido.equipo2?.nombre ?? "Equipo 2"
    }`;
    if (!equiposMap.has(equipoKey)) {
      equiposMap.set(equipoKey, []);
    }
    equiposMap.get(equipoKey).push(partido);
  });

  const equiposArray = Array.from(equiposMap.entries());
  console.log("equipos agrupados", equiposArray);

  return (
    <div className="grid gap-6">
      {equiposArray.map(([equipoNombre, partidosEquipo]) => (
        <EquipoPartidos
          key={equipoNombre}
          equipoNombre={equipoNombre}
          partidos={partidosEquipo}
        />
      ))}
    </div>
  );
}

function EquipoPartidos({ equipoNombre, partidos }) {
  const [isOpen, setIsOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartido, setSelectedPartido] = useState(null);

  const handleOpenDialog = (partido) => {
    setSelectedPartido(partido);
    setDialogOpen(true);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="rounded-lg border shadow-sm bg-white">
        <div className="flex items-center justify-between py-4 px-6 border-b">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 " />
            <span className="text-xl font-semibold">{equipoNombre}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {/* <Button variant="ghost" size="icon">
                <Edit />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2Icon className="text-red-500" />
              </Button> */}
              {/* <JugadoresDisponiblesDialog /> */}
            </div>
            {/* Popover en movil   */}
            <div className="flex sm:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2 w-32">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2"
                  >
                    <Edit /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2 text-red-500"
                  >
                    <Trash2Icon /> Eliminar
                  </Button>
                  <JugadoresDisponiblesDialog />
                </PopoverContent>
              </Popover>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div>
            {partidos.map((partido) => (
              <div key={partido.id}>
                <PartidoCard partido={partido} />
                <div className="flex items-center w-full justify-center border gap-3">
                  <Button
                    className={""}
                    onClick={() => handleOpenDialog(partido)}
                  >
                    <Users />
                    Gestionar
                  </Button>
                  {/* <Button
                    variant={"ghost"}
                    className={""}
                    onClick={() => handleOpenDialog(partido)}
                  >
                    <Edit />
                    Editar
                  </Button> */}
                  <Button
                    variant={"ghost"}
                    className={"text-red-500"}
                    onClick={() => handleOpenDialog(partido)}
                  >
                    <Trash2Icon />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <JugadoresDisponiblesDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            partido={selectedPartido}
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function PartidoCard({ partido }) {
  console.log("Partido:", partido);
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "programado":
        return (
          <Badge variant="outline" className="bg-blue-50  border-blue-200">
            Programado
          </Badge>
        );
      case "en juego":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            En Juego
          </Badge>
        );
      case "finalizado":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Finalizado
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700 border-slate-200"
          >
            {estado || "Sin estado"}
          </Badge>
        );
    }
  };

  return (
    <div className="border-b last:border-b-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-slate-50 px-4 py-2">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            {partido.fecha
              ? format(new Date(partido.fecha), "d 'de' MMMM, yyyy", {
                  locale: es,
                })
              : "Sin fecha"}
          </span>
          <span className="text-xs text-muted-foreground">
            {partido.fecha
              ? format(new Date(partido.fecha), "HH:mm", { locale: es })
              : "--:--"}{" "}
            - {partido.sede?.nombre || "Sin sede"}
          </span>
        </div>
        <div>{getEstadoBadge(partido.estado)}</div>
        <div className="hidden md:block text-sm font-medium text-right">
          {partido.liga?.nombre || "Sin liga"}
        </div>
      </div>

      <div className="px-2 pb-4 pt-2">
        <div className="flex flex-col md:flex-row gap-4">
          {partido.partidos_pistas?.length > 0 ? (
            partido.partidos_pistas.map((pista) => (
              <PistaCard key={pista.id} pista={pista} />
            ))
          ) : (
            <div className="text-center text-muted-foreground w-full py-4">
              Sin pistas asignadas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PistaCard({ pista }) {
  return (
    <div className="flex-1 min-w-[260px] max-w-md bg-white border rounded-lg shadow-sm p-3 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Pista {pista.pista_numero ?? "-"}</span>
        <span className="text-xs text-muted-foreground">
          {pista.duracion
            ? `Duración: ${pista.duracion}`
            : "Duración desconocida"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <JugadorInfo
          jugador={pista.pareja_1_jugador_1}
          label="Pareja 1 - Jugador 1"
        />
        <JugadorInfo
          jugador={pista.pareja_1_jugador_2}
          label="Pareja 1 - Jugador 2"
        />
        <JugadorInfo
          jugador={pista.pareja_2_jugador_1}
          label="Pareja 2 - Jugador 1"
        />
        <JugadorInfo
          jugador={pista.pareja_2_jugador_2}
          label="Pareja 2 - Jugador 2"
        />
      </div>
      {Array.isArray(pista.resultados) && pista.resultados.length > 0 ? (
        <div className="mt-2 text-center text-sm">
          <span className="font-bold ">Resultados:</span>{" "}
          {pista.resultados.join(" | ")}
        </div>
      ) : (
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Sin resultados
        </div>
      )}
    </div>
  );
}

function JugadorInfo({ jugador, label }) {
  if (!jugador)
    return (
      <div className="text-xs text-muted-foreground border rounded p-2 bg-slate-50">
        {label}: <span className="italic">Sin asignar</span>
      </div>
    );
  return (
    <div className="text-xs border rounded p-3 bg-slate-50">
      <span className="font-semibold">{label}:</span>
      <div>
        <span className="text-base">
          {jugador.nombre || <span className="italic">Sin nombre</span>}{" "}
          {jugador.apellido || ""}
        </span>
        {jugador.posicion && (
          <span className="ml-1 text-muted-foreground">
            ({jugador.posicion})
          </span>
        )}
      </div>
      <div>
        {/* <span className="text-muted-foreground">
          {jugador.disponibilidad
            ? `Disponibilidad: ${jugador.disponibilidad}`
            : "Sin información de disponibilidad"}
        </span> */}
      </div>
      {jugador.email && (
        <div className="text-muted-foreground">Email: {jugador.email}</div>
      )}
      {jugador.telefono && (
        <div className="text-muted-foreground">Tel: {jugador.telefono}</div>
      )}
    </div>
  );
}

const pistas = [
  { id: 1, nombre: "Pista 1" },
  { id: 2, nombre: "Pista 2" },
  { id: 3, nombre: "Pista 3" },
];

function JugadoresDisponiblesDialog({ partido, open, onOpenChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [asignaciones, setAsignaciones] = useState({
    1: { pareja1: [null, null], pareja2: [null, null] },
    2: { pareja1: [null, null], pareja2: [null, null] },
    3: { pareja1: [null, null], pareja2: [null, null] },
  });
  const [isMobile, setIsMobile] = useState(false);

  console.log("partidodialog", partido);

  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    const fetchJugadoresDisponibles = async () => {
      try {
        const partidoId = partido?.id;
        if (!partidoId) return;

        const data = await getDisponibilidad(partidoId);
        setJugadores(data || []);
      } catch (error) {
        console.error("Error al obtener jugadores disponibles: ", error);
      }
    };

    if (open) fetchJugadoresDisponibles();
  }, [partido, open]);

  console.log("jugadores disponibles", jugadores);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // funcion para asignar jugador a pista, de forma local, para que se vea en la UI que el usuario está ya asignado, el update se hace al final
  const handleAsignar = (pistaId, parejaIdx, jugadorIdx, jugadorId) => {
    setAsignaciones((prev) => ({
      ...prev,
      [pistaId]: {
        ...prev[pistaId],
        [`pareja${parejaIdx + 1}`]: prev[pistaId][`pareja${parejaIdx + 1}`].map(
          (j, idx) => (idx === jugadorIdx ? jugadorId : j)
        ),
      },
    }));
  };

  // función para mostrar si un jugador ya está asignado a alguna pista
  const jugadorYaAsignado = (jugadorId) => {
    return Object.values(asignaciones).some((pista) =>
      Object.values(pista).some((pareja) => pareja.includes(jugadorId))
    );
  };

  const handleGuardarAsignaciones = async (partidoId, asignacionesPistas) => {
    try {
      setIsLoading(true);

      const success = await updatePistasPartido(partidoId, asignacionesPistas);

      if (success) {
        toast.success("Asignaciones guardadas correctamente.");
        onOpenChange(false); // cerrar el dialog
      } else {
        toast.error("Error al guardar las asignaciones");
      }
    } catch (error) {
      toast.error("Error al guardar las asignaciones");
      console.error("Error al actualizar las pistas del partido", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Content = (
    <div className="max-h-[80vh] overflow-y-auto p-2 sm:px-0">
      {/* Header */}
      <div className="mb-4">
        {/* <h2 className="text-xl font-bold">Asignar jugadores a pistas</h2> */}
        <div className="text-sm text-muted-foreground">
          {partido?.equipo1?.nombre + " vs " + partido?.equipo2?.nombre}
          <br />
          {/* <span className="text-xs">29 de mayo, 2025 · 20:15 - Sede B</span> */}
          <span className="text-xs">
            {partido?.fecha
              ? `${format(
                  parseISO(partido.fecha),
                  "dd 'de' MMMM, yyyy · HH:mm",
                  { locale: es }
                )} - ${partido.sede?.nombre}`
              : ""}
          </span>
        </div>
      </div>

      {/* Jugadores disponibles */}
      <div>
        <h4 className="font-semibold mb-2">Jugadores disponibles</h4>
        {jugadores.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {jugadores.map((j) => (
              <div
                key={j?.id}
                className={`w-full flex flex-col items-center justify-center border rounded p-2 text-sm
            ${
              jugadorYaAsignado(j?.persona_id?.id)
                ? "bg-muted text-muted-foreground"
                : "bg-background"
            }
          `}
              >
                <div className="rounded-full bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center mb-1 font-bold">
                  {j?.persona_id?.nombre?.[0]}
                </div>
                <span>{j?.persona_id?.nombre}</span>
                {jugadorYaAsignado(j?.persona_id?.id) && (
                  <span className="text-xs mt-1">Asignado</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mb-4">
            No hay jugadores disponibles.
          </div>
        )}
      </div>

      {/* Pistas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:flex-wrap">
        {pistas.map((pista) => (
          <div
            key={pista.id}
            className="border rounded-lg p-4 bg-muted/40 flex flex-col min-w-[220px] flex-1"
          >
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold">{pista.nombre}</h5>
              <span className="text-xs text-muted-foreground">
                Duración desconocida
              </span>
            </div>
            {[0, 1].map((parejaIdx) => (
              <div
                key={parejaIdx}
                className="flex flex-col sm:flex-row gap-2 mb-2"
              >
                {[0, 1].map((jugadorIdx) => {
                  const jugadorId =
                    asignaciones[pista.id][`pareja${parejaIdx + 1}`][
                      jugadorIdx
                    ];
                  return (
                    <div key={jugadorIdx} className="flex-1">
                      <label className="block text-xs text-muted-foreground mb-1">
                        Pareja {parejaIdx + 1} - Jugador {jugadorIdx + 1}:
                      </label>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={jugadorId || ""}
                        onChange={(e) =>
                          handleAsignar(
                            pista.id,
                            parejaIdx,
                            jugadorIdx,
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      >
                        <option value="">Sin asignar</option>
                        {jugadores.map((j) => (
                          <option
                            key={j.id}
                            value={j?.persona_id?.id}
                            disabled={
                              jugadorYaAsignado(j?.persona_id?.id) &&
                              jugadorId !== j?.persona_id?.id
                            }
                          >
                            {j.persona_id?.nombre +
                              " " +
                              j.persona_id?.apellido || "Sin nombre"}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="text-xs text-muted-foreground mt-2">
              Sin resultados
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {/* hacer update con las asignaciones */}
      <div className="flex justify-end mt-6">
        <Button
          className={"disabled:opacity-50"}
          onClick={() => handleGuardarAsignaciones(partido?.id, asignaciones)}
          disabled={isLoading}
        >
          Guardar asignaciones
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    if (open) {
      console.log("jugadores disponibles array: ", asignaciones);
    }
  }, [asignaciones]);

  // Renderiza Drawer en móvil, Dialog en desktop
  return (
    <>
      {/* <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Users className="text-blue-500" />
      </Button> */}
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Asignar jugadores a pistas</DrawerTitle>
            </DrawerHeader>
            {Content}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-h-[50rem] lg:min-w-[59rem]">
            <DialogHeader>
              <DialogTitle>Asignar jugadores a pistas</DialogTitle>
            </DialogHeader>
            {Content}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
