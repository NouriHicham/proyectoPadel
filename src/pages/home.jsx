import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Trophy, Users2 } from "lucide-react"

export default function Home(){
  console.log("user: ", JSON.parse(localStorage.getItem("user")).persona);
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
              <div className="text-2xl font-bold">Sábado 24</div>
              <p className="text-xs text-muted-foreground">10:00 - Club Deportivo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros del Equipo</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Jugadores activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Victorias</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Esta temporada</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Partidos Recientes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((match) => (
              <Card key={match}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Partido #{match}</p>
                      <p className="text-sm text-muted-foreground">15 Feb 2024</p>
                    </div>
                    <span className="text-green-600 font-medium">Victoria</span>
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