import { Link, useParams } from "react-router-dom";
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

export default function PartidoDetalles() {
  const { id } = useParams();

  // const haFinalizado = true;
  const haFinalizado = false;
  const isAdmin = true;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto max-w-[65rem]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Convocatoria #{id}</h1>
            <p className="text-muted-foreground">Partido Amistoso</p>
          </div>
          <Button className="w-full md:w-auto " size="lg">
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
                      <p className="text-muted-foreground">
                        24 de Febrero, 2024
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hora</p>
                      <p className="text-muted-foreground">10:00 - 11:30</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Ubicación/Sede</p>
                      <p className="text-muted-foreground">
                        Club Deportivo Central
                      </p>
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
          {isAdmin && !haFinalizado && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Jugadores Disponibles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((player) => (
                    <div
                      key={player}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-5">
                        <Avatar className={""}>
                          <AvatarImage
                            src={`/placeholder.svg?text=${player}`}
                          />
                          <AvatarFallback>J{player}</AvatarFallback>
                        </Avatar>

                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">Jugador {player}</p>
                            <p className="text-sm text-muted-foreground">
                              Nivel: Intermedio
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Link to={`/equipo/jugador/${player}`}>
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
          )}
        </div>
      </main>

      {/* <MobileNav /> */}
    </div>
  );
}
