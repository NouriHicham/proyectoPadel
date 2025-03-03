import { Button } from "@/components/ui/button"
// import Link from "next/link"

import { Header } from "@/components/header"
// import { MobileNav } from "@/components/mobile-nav"
import { CreateMatchDialog } from "@/components/create-match-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Users2 } from "lucide-react"
import { Link } from "react-router-dom"

export default function PartidosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Partidos</h1>
          <CreateMatchDialog />
        </div>

        <div className="space-y-4">
          {/* Próximos partidos */}
          <h2 className="text-xl font-semibold mb-4">Próximos Partidos</h2>
          <div className="grid gap-4">
            {[1, 2].map((match) => (
              <Card key={`upcoming-${match}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-3">
                        <span className="text-lg font-bold">24</span>
                        <span className="text-sm">Feb</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Partido Amistoso #{match}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          10:00 - 11:30
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          Club Deportivo Central
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Users2 className="h-4 w-4 mr-2" />4 jugadores confirmados
                        </div>
                      </div>
                    </div>
                    <Link to={`/partidos/${match}`} className="block w-full md:w-auto">
                      <Button variant="outline" className="w-full">
                        Ver detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Partidos pasados */}
          <h2 className="text-xl font-semibold mb-4 mt-8">Partidos Anteriores</h2>
          <div className="grid gap-4">
            {[1, 2, 3].map((match) => (
              <Card key={`past-${match}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3">
                        <span className="text-lg font-bold">15</span>
                        <span className="text-sm">Feb</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Partido Liga #{match}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          Club Deportivo Central
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                          Victoria 6-4, 6-3
                        </span>
                      </div>
                    </div>
                    <Link to={`/partidos/${match + 10}`} className="block w-full md:w-auto">
                      <Button variant="outline" className="w-full">
                        Ver resumen
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* <MobileNav /> */}
    </div>
  )
}

