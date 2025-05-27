"use client";

import { useState } from "react";
import { format } from "date-fns";
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
              <Button variant="ghost" size="icon">
                <Edit />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2Icon className="text-red-500" />
              </Button>
              <JugadoresDisponiblesDialog />
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
              <PartidoCard key={partido.id} partido={partido} />
            ))}
          </div>
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

// Simulación de datos
const jugadores = [
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Luis" },
  { id: 3, nombre: "Pablo" },
  { id: 4, nombre: "Sara" },
];

const pistas = [
  { id: 1, nombre: "Pista 1" },
  { id: 2, nombre: "Pista 2" },
  { id: 3, nombre: "Pista 3" },
];

function JugadoresDisponiblesDialog() {
  const [asignaciones, setAsignaciones] = useState({
    1: { pareja1: [null, null], pareja2: [null, null] },
    2: { pareja1: [null, null], pareja2: [null, null] },
    3: { pareja1: [null, null], pareja2: [null, null] },
  });

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

  const jugadorYaAsignado = (jugadorId) => {
    return Object.values(asignaciones).some((pista) =>
      Object.values(pista).some((pareja) => pareja.includes(jugadorId))
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Users className="text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Asignar jugadores a pistas</DialogTitle>
          <DialogDescription>
            Equipo Mixto prueba vs Equipo C <br />
            <span className="text-xs text-muted-foreground">
              29 de mayo, 2025 · 20:15 - Sede B
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Jugadores disponibles en grid */}
        <div>
          <h4 className="font-semibold mb-2">Jugadores disponibles</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {jugadores.map((j) => (
              <div
                key={j.id}
                className={`flex flex-col items-center justify-center border rounded p-2 text-sm
                  ${
                    jugadorYaAsignado(j.id)
                      ? "bg-muted text-muted-foreground"
                      : "bg-background"
                  }
                `}
              >
                <div className="rounded-full bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center mb-1 font-bold">
                  {j.nombre[0]}
                </div>
                <span>{j.nombre}</span>
                {jugadorYaAsignado(j.id) && (
                  <span className="text-xs mt-1">Asignado</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pistas apiladas verticalmente */}
        <div className="flex flex-col gap-4">
          {pistas.map((pista) => (
            <div
              key={pista.id}
              className="border rounded-lg p-4 bg-muted/40 flex flex-col"
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
                              value={j.id}
                              disabled={
                                jugadorYaAsignado(j.id) && jugadorId !== j.id
                              }
                            >
                              {j.nombre}
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

        <DialogFooter>
          <Button>Guardar asignaciones</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
