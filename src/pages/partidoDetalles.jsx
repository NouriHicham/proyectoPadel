import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/header";
// import { MobileNav } from "@/components/mobile-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle2Icon,
  Clock,
  MapPin,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  addDisponibilidad,
  getDisponibilidad,
  getPartidos,
  getResultados,
} from "@/lib/database";
import { Skeleton } from "@/components/ui/skeleton";
import { add } from "date-fns";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Componente para jugador draggable
function DraggableJugador({ jugador, id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "#f1f5f9" : undefined,
    borderRadius: 6,
    cursor: "grab",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 p-2 border mb-2 bg-white"
    >
      <Avatar>
        <AvatarImage
          src={`/placeholder.svg?text=${jugador.nombre?.[0] || "J"}`}
        />
        <AvatarFallback>{jugador.nombre?.[0] || "J"}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {jugador.nombre} {jugador.apellido}
        </p>
        <p className="text-xs text-muted-foreground">
          {jugador.posicion || ""}
        </p>
      </div>
    </div>
  );
}

export default function PartidoDetalles() {
  const { id } = useParams();
  const savedInfo = JSON.parse(localStorage.getItem("personaGuardada"));
  const [partidos, setPartidos] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [haFinalizado, setHaFinalizado] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [pistas, setPistas] = useState([
    { id: 1, jugadores: [] },
    { id: 2, jugadores: [] },
    { id: 3, jugadores: [] },
  ]);
  const [jugadoresDisponibles, setJugadoresDisponibles] = useState([]);
  const [draggingJugadorId, setDraggingJugadorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAll() {
      try {
        const partidosData = await getPartidos(id);
        const disponibilidadData = await getDisponibilidad(id);
        setPartidos(partidosData);
        setDisponibilidad(disponibilidadData);
      } catch (error) {
        console.error("Error al obtener info:", error);
      }
    }
    fetchAll();
  }, [id]);
  // si la persona no pertenece a alguno de los equipos de la convocatoria se redirecciona
  useEffect(() => {
    if (partidos.length > 0) {
      if (
        savedInfo?.equipo_id !== partidos[0]?.equipo1_id.id &&
        savedInfo?.equipo_id !== partidos[0]?.equipo2_id.id
      ) {
        navigate("/");
      }
    }
  }, [partidos]);

  useEffect(() => {
    async function fetchResultados() {
      if (partidos[0]?.estado === "finalizado") {
        setHaFinalizado(true);
        try {
          const resultadosData = await getResultados(id);
          setResultados(resultadosData[0].partidos_pistas);
        } catch (error) {
          console.error(error);
        }
      } else {
        setHaFinalizado(false);
      }
    }
    fetchResultados();
  }, [partidos, id]);
  console.log("resultados", resultados);

  const aceptarDisponibilidad = () => {
    try {
      // console.log("partidoid: ", id);
      // console.log("idjugador: ", savedInfo);
      addDisponibilidad(Number(savedInfo?.persona_id), id);
    } catch (error) {
      console.error(error);
    }
  };

  // Obtener jugadores disponibles de mi equipo
  useEffect(() => {
    if (!partidos[0]) return;
    // Filtrar solo los jugadores de mi equipo que han dicho disponible
    const equipoId = savedInfo.equipo_id;
    const jugadores = disponibilidad
      .filter(
        (d) =>
          d.disponible &&
          d.persona_id &&
          (partidos[0].equipo1_id.id === equipoId ||
            partidos[0].equipo2_id.id === equipoId) &&
          (d.persona_id.equipo_id === equipoId || equipoId)
      )
      .map((d) => d.persona_id);

    setJugadoresDisponibles(jugadores);
  }, [disponibilidad, partidos, savedInfo.equipo_id]);

  // Drag and drop handlers
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    // Si se arrastra desde la lista de disponibles a una pista
    if (overId.startsWith("pista-")) {
      const pistaIdx = pistas.findIndex((p) => `pista-${p.id}` === overId);
      if (pistaIdx === -1) return;
      // Si ya está en alguna pista, no hacer nada
      if (pistas.some((p) => p.jugadores.some((j) => j.id === activeId)))
        return;
      // Buscar jugador en la lista de disponibles
      const jugador = jugadoresDisponibles.find((j) => j.id === activeId);
      if (jugador) {
        setPistas((prev) => {
          const copy = prev.map((p) => ({ ...p, jugadores: [...p.jugadores] }));
          copy[pistaIdx].jugadores.push(jugador);
          return copy;
        });
      }
      return;
    }

    // Si se arrastra entre pistas
    const [fromPista, fromIdx] = findJugadorInPistas(activeId);
    const [toPista, _] = findPistaByDroppableId(overId);

    if (fromPista !== null && toPista !== null && fromPista !== toPista) {
      setPistas((prev) => {
        const copy = prev.map((p) => ({ ...p, jugadores: [...p.jugadores] }));
        const jugador = copy[fromPista].jugadores.splice(fromIdx, 1)[0];
        copy[toPista].jugadores.push(jugador);
        return copy;
      });
    }
  }

  function findJugadorInPistas(jugadorId) {
    for (let i = 0; i < pistas.length; i++) {
      const idx = pistas[i].jugadores.findIndex((j) => j.id === jugadorId);
      if (idx !== -1) return [i, idx];
    }
    return [null, null];
  }

  function findPistaByDroppableId(droppableId) {
    const idx = pistas.findIndex((p) => `pista-${p.id}` === droppableId);
    return [idx, pistas[idx]];
  }

  function handleRemoveJugadorFromPista(jugadorId, pistaIdx) {
    setPistas((prev) => {
      const copy = prev.map((p) => ({ ...p, jugadores: [...p.jugadores] }));
      copy[pistaIdx].jugadores = copy[pistaIdx].jugadores.filter(
        (j) => j.id !== jugadorId
      );
      return copy;
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto max-w-[65rem] px-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Convocatoria #{id}</h1>
            <p className="text-muted-foreground">Partido Amistoso</p>
          </div>
          {partidos[0]?.estado !== "finalizado" || jugadoresDisponibles.map((j) => j.id).includes(id) && (
            <>
              {disponibilidad.map((d) =>
                d.persona_id.id === savedInfo.id && d.disponible ? (
                  <p key={d.id} className="text-muted-foreground">
                    Disponible
                  </p>
                ) : null
              )}
              <Button
                className="w-full md:w-auto"
                size="lg"
                onClick={aceptarDisponibilidad}
              >
                Confirmar disponibilidad
              </Button>
            </>
          )}
        </div>

        <div className="">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Convocatoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Fecha</p>

                      {partidos.length === 0 ? (
                        <Skeleton className="h-4 w-32 mt-2 bg-gray-300" />
                      ) : (
                        <p className="text-muted-foreground">
                          {new Date(partidos[0].fecha).toLocaleString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hora</p>
                      <p className="text-muted-foreground"></p>
                      {partidos.length === 0 ? (
                        <Skeleton className="h-4 w-14 mt-2 bg-gray-300" />
                      ) : (
                        <p className="text-muted-foreground">
                          {partidos[0].fecha
                            .split("T")[1]
                            .split("+")[0]
                            .split(":")[0] +
                            ":" +
                            partidos[0].fecha
                              .split("T")[1]
                              .split("+")[0]
                              .split(":")[1]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Ubicación/Sede</p>
                      {partidos.length === 0 ? (
                        <Skeleton className="h-4 w-32 mt-2 bg-gray-300" />
                      ) : (
                        <p className="text-muted-foreground">
                          {partidos[0].sedes.ubicacion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {haFinalizado ? (
              <Tabs defaultValue="courts">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="courts" className={"cursor-pointer"}>
                    Pistas
                  </TabsTrigger>
                  <TabsTrigger value="results" className={"cursor-pointer"}>
                    Resultados
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="courts" className="space-y-4">
                  {/* Mostrar información real de pistas si el partido ha acabado */}
                  {Array.isArray(resultados) && resultados.length > 0
                    ? resultados.map((pista, idx) => (
                        <Card key={pista.id || idx}>
                          <CardHeader>
                            <CardTitle>
                              Pista {pista.pista_numero ?? idx + 1}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Duración: {pista.duracion || "-"}</span>
                                <span>4 jugadores necesarios</span>
                              </div>
                              <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-4">
                                    <h4 className="text-sm font-medium">
                                      Pareja 1
                                    </h4>
                                    {[
                                      pista.pareja_1_jugador_1_id,
                                      pista.pareja_1_jugador_2_id,
                                    ].map((playerId, i) => (
                                      <div
                                        key={`court-${
                                          pista.pista_numero
                                        }-team1-${playerId || i}`}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Avatar>
                                            <AvatarImage
                                              src={`/placeholder.svg?text=${
                                                playerId || "?"
                                              }`}
                                            />
                                            <AvatarFallback>
                                              J{playerId || "?"}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium">
                                              Jugador {playerId || "?"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              {/* Aquí podrías poner el nivel si lo tienes */}
                                            </p>
                                          </div>
                                        </div>
                                        <Link
                                          to={`/equipo/jugador/${playerId}`}
                                        >
                                          <Button variant="ghost" size="sm">
                                            Ver perfil
                                          </Button>
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-4">
                                    <h4 className="text-sm font-medium">
                                      Pareja 2
                                    </h4>
                                    {[
                                      pista.pareja_2_jugador_1_id,
                                      pista.pareja_2_jugador_2_id,
                                    ].map((playerId, i) => (
                                      <div
                                        key={`court-${
                                          pista.pista_numero
                                        }-team2-${playerId || i}`}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Avatar>
                                            <AvatarImage
                                              src={`/placeholder.svg?text=${
                                                playerId || "?"
                                              }`}
                                            />
                                            <AvatarFallback>
                                              J{playerId || "?"}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium">
                                              Jugador {playerId || "?"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              {/* Aquí podrías poner el nivel si lo tienes */}
                                            </p>
                                          </div>
                                        </div>
                                        <Link
                                          to={`/equipo/jugador/${playerId}`}
                                        >
                                          <Button variant="ghost" size="sm">
                                            Ver perfil
                                          </Button>
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    : // Si no hay resultados, mostrar 3 pistas vacías como antes
                      [1, 2, 3].map((court) => (
                        <Card key={court}>
                          <CardHeader>
                            <CardTitle>Pista {court}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>4 jugadores necesarios</span>
                              </div>
                              <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-4">
                                    <h4 className="text-sm font-medium">
                                      Pareja 1
                                    </h4>
                                    {[1, 2].map((player) => (
                                      <div
                                        key={`court-${court}-team1-${player}`}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Avatar>
                                            <AvatarImage
                                              src={`/placeholder.svg?text=${player}`}
                                            />
                                            <AvatarFallback>
                                              J{player}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium">
                                              Jugador {player}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              Nivel: Intermedio
                                            </p>
                                          </div>
                                        </div>
                                        <Link to={`/equipo/jugador/${player}`}>
                                          <Button variant="ghost" size="sm">
                                            Ver perfil
                                          </Button>
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-4">
                                    <h4 className="text-sm font-medium">
                                      Pareja 2
                                    </h4>
                                    {[3, 4].map((player) => (
                                      <div
                                        key={`court-${court}-team2-${player}`}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Avatar>
                                            <AvatarImage
                                              src={`/placeholder.svg?text=${player}`}
                                            />
                                            <AvatarFallback>
                                              J{player}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium">
                                              Jugador {player}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              Nivel: Intermedio
                                            </p>
                                          </div>
                                        </div>
                                        <Link to={`/equipo/jugador/${player}`}>
                                          <Button variant="ghost" size="sm">
                                            Ver perfil
                                          </Button>
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                </TabsContent>
                <TabsContent value="results">
                  <div className="space-y-4">
                    {Array.isArray(resultados) && resultados.length > 0
                      ? resultados.map((pista, idx) => (
                          <Card key={`results-${pista.id || idx}`}>
                            <CardHeader>
                              <CardTitle>
                                Resultados Pista {pista.pista_numero ?? idx + 1}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                                <div className="text-center flex-1">
                                  <p className="font-medium">Pareja 1</p>
                                  <div className="flex items-center justify-center gap-2 mt-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>
                                        {pista.pareja_1_jugador_1_id
                                          ? `J${pista.pareja_1_jugador_1_id}`
                                          : "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>
                                        {pista.pareja_1_jugador_2_id
                                          ? `J${pista.pareja_1_jugador_2_id}`
                                          : "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                                <div className="text-center px-4">
                                  <div className="text-2xl font-bold">
                                    {Array.isArray(pista.resultados)
                                      ? pista.resultados.join(", ")
                                      : "-"}
                                  </div>
                                  {/* Puedes poner lógica para victoria/derrota si tienes info */}
                                </div>
                                <div className="text-center flex-1">
                                  <p className="font-medium">Pareja 2</p>
                                  <div className="flex items-center justify-center gap-2 mt-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>
                                        {pista.pareja_2_jugador_1_id
                                          ? `J${pista.pareja_2_jugador_1_id}`
                                          : "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>
                                        {pista.pareja_2_jugador_2_id
                                          ? `J${pista.pareja_2_jugador_2_id}`
                                          : "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      : // Si no hay resultados, mostrar 3 pistas vacías como antes
                        [1, 2, 3].map((court) => (
                          <Card key={`results-${court}`}>
                            <CardHeader>
                              <CardTitle>Resultados Pista {court}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                                <div className="text-center flex-1">
                                  <p className="font-medium">Pareja 1</p>
                                  <div className="flex items-center justify-center gap-2 mt-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>P1</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>P2</AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                                <div className="text-center px-4">
                                  <div className="text-2xl font-bold">
                                    6-4, 6-3
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Victoria
                                  </p>
                                </div>
                                <div className="text-center flex-1">
                                  <p className="font-medium">Pareja 2</p>
                                  <div className="flex items-center justify-center gap-2 mt-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>P3</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>P4</AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              // Drag & Drop de jugadores disponibles a pistas
              <div className="mb-5">
                <h3 className="text-lg font-semibold mb-2">
                  Asignar jugadores a pistas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Lista de jugadores disponibles */}
                  <div className="col-span-1">
                    <h4 className="font-medium mb-2">Jugadores disponibles</h4>
                    <div className="space-y-2">
                      {jugadoresDisponibles.length === 0 ? (
                        <div className="text-muted-foreground text-sm">
                          No hay jugadores disponibles.
                        </div>
                      ) : (
                        jugadoresDisponibles
                          .filter(
                            (j) =>
                              !pistas.some((p) =>
                                p.jugadores.some((jp) => jp.id === j.id)
                              )
                          )
                          .map((jugador) => (
                            <div
                              key={jugador.id}
                              draggable
                              onDragStart={(e) => {
                                setDraggingJugadorId(jugador.id);
                                e.dataTransfer.effectAllowed = "move";
                              }}
                              onDragEnd={() => setDraggingJugadorId(null)}
                              className={`p-2 border rounded bg-white flex items-center gap-2 cursor-grab ${
                                draggingJugadorId === jugador.id ? "opacity-50" : ""
                              }`}
                            >
                              <span className="font-semibold">
                                {jugador.nombre} {jugador.apellido}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {jugador.posicion}
                              </span>
                            </div>
                          )))
                      }
                    </div>
                  </div>
                  {/* Pistas */}
                  {pistas.map((pista, pistaIdx) => (
                    <div
                      key={pista.id}
                      className="bg-muted/40 rounded-lg p-4 flex flex-col gap-2 min-h-[180px]"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        if (draggingJugadorId) {
                          // Solo añade si no está ya en alguna pista
                          if (!pista.jugadores.some((j) => j.id === draggingJugadorId)) {
                            const jugador = jugadoresDisponibles.find((j) => j.id === draggingJugadorId);
                            if (jugador) {
                              setPistas((prev) => {
                                const copy = prev.map((p, idx) =>
                                  idx === pistaIdx
                                    ? { ...p, jugadores: [...p.jugadores, jugador] }
                                    : { ...p }
                                );
                                return copy;
                              });
                            }
                          }
                          setDraggingJugadorId(null);
                        }
                      }}
                    >
                      <div className="font-bold mb-2">Pista {pista.id}</div>
                      <div className="space-y-2">
                        {[0, 1, 2, 3].map((pos) => (
                          <div
                            key={pos}
                            className="flex items-center gap-2 border rounded px-2 py-1 bg-white"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              if (draggingJugadorId) {
                                // Si la posición está vacía y el jugador no está ya en la pista
                                if (!pista.jugadores[pos]) {
                                  const jugador = jugadoresDisponibles.find((j) => j.id === draggingJugadorId);
                                  if (jugador) {
                                    setPistas((prev) => {
                                      const copy = prev.map((p, idx) =>
                                        idx === pistaIdx
                                          ? {
                                              ...p,
                                              jugadores: [
                                                ...p.jugadores.slice(0, pos),
                                                jugador,
                                                ...p.jugadores.slice(pos + 1),
                                              ].slice(0, 4),
                                            }
                                          : { ...p }
                                      );
                                      return copy;
                                    });
                                  }
                                }
                                setDraggingJugadorId(null);
                              }
                            }}
                          >
                            {pista.jugadores[pos] ? (
                              <>
                                <span className="font-medium">
                                  {pista.jugadores[pos].nombre}{" "}
                                  {pista.jugadores[pos].apellido}
                                </span>
                                <button
                                  className="ml-2 text-xs text-red-600"
                                  onClick={() =>
                                    handleRemoveJugadorFromPista(
                                      pista.jugadores[pos].id,
                                      pistaIdx
                                    )
                                  }
                                >
                                  Quitar
                                </button>
                              </>
                            ) : (
                              <span className="text-muted-foreground italic">
                                Arrastra aquí
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Arrastra jugadores desde la lista a una posición vacía en la pista.
                </div>
              </div>
            )}
          {/* Mostrar usuarios disponibles si el usuario es admin y el partido aun no ha comenzado*/}
          {savedInfo.id == partidos[0]?.equipo1_id.capitan_id ||
          savedInfo.id == partidos[0]?.equipo2_id.capitan_id ||
          savedInfo.id == partidos[0]?.equipo1_id.subcapitan_id ||
          savedInfo.id == partidos[0]?.equipo2_id.subcapitan_id ? (
            <Tabs defaultValue="disponibles">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="disponibles" className={"cursor-pointer"}>
                  Jugadores
                </TabsTrigger>
                <TabsTrigger value="pistas" className={"cursor-pointer"}>
                  Pistas
                </TabsTrigger>
              </TabsList>
              <TabsContent value="disponibles">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Jugadores Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {disponibilidad.map((disp) => (
                        <div
                          key={disp.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-5">
                            <Avatar className={""}>
                              <AvatarImage
                                src={`/placeholder.svg?text=${disp.persona_id.id}`}
                              />
                              <AvatarFallback>
                                {disp.persona_id.nombre.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium">
                                  {disp.persona_id.nombre}{" "}
                                  {disp.persona_id.apellido}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Nivel: Intermedio
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Link to={`/equipo/jugador/${disp.persona_id.id}`}>
                              <Button variant="secondary" size="sm">
                                Ver perfil
                              </Button>
                            </Link>
                            <button className="cursor-pointer">
                              <CheckCircle2Icon size={28} color="#166534" />
                            </button>
                            <button className="cursor-pointer">
                              <XCircleIcon size={28} color="#991b1b" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="pistas">
                {/* Solo mostrar información pistas si el partido ha acabado*/}
                {[1, 2, 3].map((court) => (
                  <Card key={court}>
                    <CardHeader>
                      <CardTitle>Pista {court}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          {/* <span>Tipo: Cristal</span> */}
                          <span>4 jugadores necesarios</span>
                        </div>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">Pareja 1</h4>
                              {[1, 2].map((player) => (
                                <div
                                  key={`court-${court}-team1-${player}`}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage
                                        src={`/placeholder.svg?text=${player}`}
                                      />
                                      <AvatarFallback>J{player}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        Jugador {player}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Nivel: Intermedio
                                      </p>
                                    </div>
                                  </div>
                                  <Link to={`/equipo/jugador/${player}`}>
                                    <Button variant="ghost" size="sm">
                                      Ver perfil
                                    </Button>
                                  </Link>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">Pareja 2</h4>
                              {[3, 4].map((player) => (
                                <div
                                  key={`court-${court}-team2-${player}`}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage
                                        src={`/placeholder.svg?text=${player}`}
                                      />
                                      <AvatarFallback>J{player}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        Jugador {player}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Nivel: Intermedio
                                      </p>
                                    </div>
                                  </div>
                                  <Link to={`/equipo/jugador/${player}`}>
                                    <Button variant="ghost" size="sm">
                                      Ver perfil
                                    </Button>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          ) : null}
        </div>
        </div>
      </main>

      {/* <MobileNav /> */}
    </div>
  );
}