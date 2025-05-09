"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function PartidosList({ partidos }) {
  // Agrupar partidos por pareja/equipo
  const equiposMap = new Map();
  console.log(partidos);

  partidos.forEach((partido) => {
    const equipoKey = `${partido.equipo1.jugador1} / ${partido.equipo1.jugador2}`;
    if (!equiposMap.has(equipoKey)) {
      equiposMap.set(equipoKey, []);
    }
    equiposMap.get(equipoKey)?.push(partido);
  });

  // Convertir el mapa a un array para renderizar
  const equiposArray = Array.from(equiposMap.entries());
  console.log("equiposarray", equiposArray);

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
      <Card>
        <CardHeader className="py-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{equipoNombre}</CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="px-6 pb-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partidos.map((partido) => (
                <PartidoCard key={partido.id} partido={partido} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function PartidoCard({ partido }) {
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "programado":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
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
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">
            {format(new Date(partido.fecha), "d 'de' MMMM, yyyy", {
              locale: es,
            })}
          </div>
          {getEstadoBadge(partido.estado)}
        </div>
        <div className="text-sm text-muted-foreground">
          {format(new Date(partido.fecha), "HH:mm", { locale: es })} -{" "}
          {partido.sede.nombre} (Pista {partido.sede.pista})
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">{partido.liga.nombre}</div>
            <div className="text-sm text-muted-foreground">
              Categoría: {partido.liga.categoria}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-b py-3">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-medium">{partido.equipo1.jugador1}</span>
                <span className="font-medium">{partido.equipo1.jugador2}</span>
              </div>

              {partido.estado !== "programado" && (
                <div className="text-center font-bold">
                  {partido.resultado?.sets.map((set, index) => (
                    <span key={index} className="mx-1">
                      {set.equipo1}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-medium">{partido.equipo2.jugador1}</span>
                <span className="font-medium">{partido.equipo2.jugador2}</span>
              </div>

              {partido.estado !== "programado" && (
                <div className="text-center font-bold">
                  {partido.resultado?.sets.map((set, index) => (
                    <span key={index} className="mx-1">
                      {set.equipo2}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {partido.estado === "finalizado" && (
            <div className="text-sm text-center">
              Ganador:{" "}
              {partido.resultado?.ganador === 1
                ? `${partido.equipo1.jugador1} / ${partido.equipo1.jugador2}`
                : `${partido.equipo2.jugador1} / ${partido.equipo2.jugador2}`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
