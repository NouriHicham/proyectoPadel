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
import { addDisponibilidad, getDisponibilidad, getPartidos } from "@/lib/database";
import { Skeleton } from "@/components/ui/skeleton";
import { add } from "date-fns";

export default function PartidoDetalles() {
  const { id } = useParams();
  const savedInfo = JSON.parse(localStorage.getItem("personaGuardada"))
  const [partidos, setPartidos] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [haFinalizado, setHaFinalizado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAll() {
      try {
        const partidosData = await getPartidos(id);
        const disponibilidadData = await getDisponibilidad(id);
        setPartidos(partidosData);
        setDisponibilidad(disponibilidadData);
      } 
      catch (error) {
        console.error("Error al obtener info:", error);
      }
    }  
    fetchAll();
  }, [id]);
  
  // si la persona no pertenece a alguno de los equipos de la convocatoria se redirecciona
  useEffect(() => {
    if (partidos.length > 0) {
      if (savedInfo?.equipo_id !== partidos[0]?.equipo1_id.id && savedInfo?.equipo_id !== partidos[0]?.equipo2_id.id) {
        navigate("/");
      }
    }
    console.log(disponibilidad)
  }, [partidos]);

  useEffect(() => {
    if (partidos[0]?.estado === "finalizado") {
      setHaFinalizado(true);
    } else {
      setHaFinalizado(false);
    }
  }, [partidos]);

  const aceptarDisponibilidad = () => {
    try {
      addDisponibilidad(savedInfo.id, id);
    }catch(error){
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto max-w-[65rem]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Convocatoria #{id}</h1>
            <p className="text-muted-foreground">Partido Amistoso</p>
          </div>
          {disponibilidad.map((disponibilidad) =>
            disponibilidad.persona_id.id === savedInfo.id && disponibilidad.disponible ? (
              <p key={disponibilidad.id} className="text-muted-foreground">
                Disponible
              </p>
            ) : null
          )}
          <Button className="w-full md:w-auto " size="lg" onClick={aceptarDisponibilidad}>
            {/* Unirme a la convocatoria */}
            Confirmar disponibilidad
          </Button>
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
                      
                        {partidos.length === 0  ? (
                          <Skeleton className="h-4 w-32 mt-2 bg-gray-300" />
                        ):(
                          <p className="text-muted-foreground">
                            {new Date(partidos[0].fecha).toLocaleString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hora</p>
                      <p className="text-muted-foreground"></p>
                        {partidos.length === 0  ? (
                          <Skeleton className="h-4 w-14 mt-2 bg-gray-300" />
                        ):(
                          <p className="text-muted-foreground">
                            {partidos[0].fecha.split("T")[1].split("+")[0].split(":")[0] + ":" + partidos[0].fecha.split("T")[1].split("+")[0].split(":")[1]}
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Ubicación/Sede</p>
                      {partidos.length === 0  ? (
                        <Skeleton className="h-4 w-32 mt-2 bg-gray-300" />
                      ):(
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
                    {[1, 2, 3].map((court) => (
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
                              <div className="text-2xl font-bold">6-4, 6-3</div>
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
              <p className="text-center mb-5">
                El resumen del partido estará disponible cuando la jornada
                finalice.
              </p>
            )}
          </div>
          {/* Mostrar usuarios disponibles si el usuario es admin y el partido aun no ha comenzado*/}
          {savedInfo.id == partidos[0]?.equipo1_id.capitan_id || savedInfo.id == partidos[0]?.equipo2_id.capitan_id || savedInfo.id == partidos[0]?.equipo1_id.subcapitan_id || savedInfo.id == partidos[0]?.equipo2_id.subcapitan_id ? (
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
                            <AvatarFallback>{disp.persona_id.nombre.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{disp.persona_id.nombre} {disp.persona_id.apellido}</p>
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
          </Tabs>
          ) : null}
        </div>
      </main>

      {/* <MobileNav /> */}
    </div>
  );
  
}
