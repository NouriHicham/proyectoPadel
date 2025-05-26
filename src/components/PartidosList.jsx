"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
