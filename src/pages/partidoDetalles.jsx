import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/header";
// import { MobileNav } from "@/components/mobile-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, MessageSquare, ThumbsUp } from "lucide-react";
// import Link from "next/link"

export default function PartidoDetalles() {
  const { id } = useParams();

  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto max-w-[65rem]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Convocatoria #{id}</h1>
            <p className="text-muted-foreground">Partido Amistoso</p>
          </div>
          <Button className="w-full md:w-auto" size="lg">
            Unirme a la convocatoria
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
                      <p className="font-medium">Ubicación</p>
                      <p className="text-muted-foreground">
                        Club Deportivo Central
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="courts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="courts">Pistas</TabsTrigger>
                {/* <TabsTrigger value="comments">Comentarios</TabsTrigger> */}
                <TabsTrigger value="results">Resultados</TabsTrigger>
              </TabsList>
              <TabsContent value="courts" className="space-y-4">
                {/* Solo mostrar información pistas si el partido ha acabado */}
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
                                  <Link to={`/team/${player}`}>
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
                                  <Link to={`/team/${player}`}>
                                    <Button variant="ghost" size="sm">
                                      Ver perfil
                                    </Button>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" className="w-full">
                            Unirme a esta pista
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              {/* <TabsContent value="comments">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {[1, 2, 3].map((comment) => (
                      <div
                        key={comment}
                        className="flex gap-3 pb-4 border-b last:border-0"
                      >
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?text=${comment}`}
                          />
                          <AvatarFallback>U{comment}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              Usuario {comment}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              hace 2h
                            </span>
                          </div>
                          <p>¡Me apunto a la pista 1! 🎾</p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                              <ThumbsUp className="h-4 w-4" />
                              <span>2</span>
                            </button>
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                              <MessageSquare className="h-4 w-4" />
                              <span>Responder</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?text=ME" />
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-muted-foreground"
                      >
                        Escribe un comentario...
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}
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
          </div>

          {/* <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Nivel recomendado</h3>
                  <p className="text-sm text-muted-foreground">
                    Intermedio - Avanzado
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Precio por persona</h3>
                  <p className="text-sm text-muted-foreground">8€</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Notas</h3>
                  <p className="text-sm text-muted-foreground">
                    Traer pelotas nuevas. Posibilidad de tercer set en caso de
                    empate.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </main>

      {/* <MobileNav /> */}
    </div>
  );
}
