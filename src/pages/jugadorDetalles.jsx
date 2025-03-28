import { Header } from "@/components/header";

// import { Header } from "@/components/header"
// import { MobileNav } from "@/components/mobile-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPerfilUsuario } from "@/lib/database";
import { Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function JugadorDetalles() {
  // Al cargar pagina, hacer fetch de los datos del usuario, con el id pasado por url
  const { id } = useParams();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [data] = await getPerfilUsuario(id);
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [id]);

  // Por si queremos mostrar un cargando
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* <p>Cargando...</p> */}
        <div className="lex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?text=JP" />
                    <AvatarFallback>JP</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {userData?.nombre + " " + userData?.apellido}
                    </h1>
                    <p className="text-muted-foreground">Miembro desde 2025</p>
                  </div>
                  <Button variant="outline">Editar perfil</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>+34 {userData?.telefono}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{userData?.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas del Jugador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Partidos Jugados
                    </p>
                    <p className="text-2xl font-bold">45</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Victorias</p>
                    <p className="text-2xl font-bold">32</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Ratio Victoria
                    </p>
                    <p className="text-2xl font-bold">71%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Derecha</p>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Revés</p>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Volea</p>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <Progress value={90} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Saque</p>
                    <span className="text-sm text-muted-foreground">80%</span>
                  </div>
                  <Progress value={80} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Tabs defaultValue="history" className={"mt-5"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" className={"cursor-pointer"}>
              Historial
            </TabsTrigger>
            <TabsTrigger value="partners" className={"cursor-pointer"}>
              Compañeros
            </TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Card>
              <CardContent className="p-4 space-y-4">
                {[1, 2, 3, 4].map((match) => (
                  <div
                    key={match}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Partido #{match}</p>
                      <p className="text-sm text-muted-foreground">
                        15 Feb 2024
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">Victoria</p>
                      <p className="text-sm text-muted-foreground">6-4, 6-3</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="partners">
            <Card>
              <CardContent className="p-4 space-y-4">
                {[1, 2, 3].map((partner) => (
                  <div
                    key={partner}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?text=P${partner}`}
                        />
                        <AvatarFallback>P{partner}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Compañero {partner}</p>
                        <p className="text-sm text-muted-foreground">
                          8 partidos juntos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">75%</p>
                      <p className="text-sm text-muted-foreground">Victorias</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
