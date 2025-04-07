import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEquipos, getMiembrosEquipo, getUltimoPartidoaJugar, getUltimosPartidosJugados } from "@/lib/database";
import { Calendar, Trophy, Users2 } from "lucide-react"
import { useEffect, useState } from "react";

export default function Home(){
  const persona = JSON.parse(localStorage.getItem("user")).persona;
  const savedInfo = JSON.parse(localStorage.getItem("personaGuardada"))
  const [equipo, setEquipo] = useState(null);
  const [miembros, setMiembros] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [partidojugar, setPartidojugar] = useState(null);

  useEffect(() => {
    async function fetchAll(){
      if (!savedInfo?.equipo_id) return; // si equipo_id indefinido sal

      try {
        const equipoData = await getEquipos(savedInfo.equipo_id);
        setEquipo(equipoData);
        const miembrosData = await getMiembrosEquipo(savedInfo.equipo_id);
        setMiembros(miembrosData);
        const partidosData = await getUltimosPartidosJugados(savedInfo.equipo_id, 3);
        setPartidos(partidosData);
        const partidojugarData = await getUltimoPartidoaJugar(savedInfo.equipo_id);
        setPartidojugar(partidojugarData);
      } catch (error) {
        console.error("Error al obtener info:", error);
      }
    }

    fetchAll();
  }, [savedInfo?.equipo_id]);
  
   return (
      <>

    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bienvenido a PadelTeam</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Partido</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            {partidojugar && ( // Check if partidojugar is not null
                <div>
                  <div className="text-2xl font-bold">
                    {new Intl.DateTimeFormat('es-ES', {
                      dateStyle: 'medium',
                    }).format(new Date(partidojugar[0].fecha))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat('es-ES', {
                      timeStyle: 'short',
                    }).format(new Date(partidojugar[0].fecha))}
                     <span> - {partidojugar[0].sedes.nombre}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros del Equipo</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{miembros}</div>
              <p className="text-xs text-muted-foreground">Jugadores activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Victorias</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">???</div>
              <p className="text-xs text-muted-foreground">Esta temporada</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Partidos Recientes</h2>
          <div className="space-y-4">
            {partidos.map((partido) => (
              <Card key={partido.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Partido #{partido.id}</p>
                      <p className="text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat('es-ES', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }).format(new Date(partido.fecha))}
                      </p>
                    </div>
                    <span className="text-green-600 font-medium">{partido.estado}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

    </div>
   </>
   )
}