import { Button } from "@/components/ui/button"
// import Link from "next/link"

import { Header } from "@/components/header"
// import { MobileNav } from "@/components/mobile-nav"
import { CreateMatchDialog } from "@/components/create-match-dialog"
import { CreateSedeDialog } from "@/components/create-sede-dialog";
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Plus, Users2 } from "lucide-react"
import { Link } from "react-router-dom"
import { getUltimoPartidoaJugar, getUltimosPartidosJugados } from "@/lib/database"
import { useEffect, useState } from "react"

export default function PartidosPage() {
  const savedInfo = JSON.parse(localStorage.getItem("personaGuardada"))
  const [nextMatch, setNext] = useState([]);
  const [partidos, setPartidos] = useState([]);

    useEffect(() => {
        async function fetchAll(){
          try {
            const partidosData = await getUltimosPartidosJugados(savedInfo.equipo_id, 3);
            const nextMatchData = await getUltimoPartidoaJugar(savedInfo.equipo_id, 2)
            setPartidos(partidosData);
            setNext(nextMatchData);
          }catch(error){
            console.error(error)
          }
        }
    
        fetchAll();
    },[]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto p-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Partidos</h1>
          <div>
            {/* <Button className="mr-1">
              <Plus className="h-4 w-4" />
              <span className="hidden lg:block">
                Nueva sede
              </span>
              
            </Button> */}
            <CreateSedeDialog />
            <CreateMatchDialog />
          </div>
          
        </div>

        <div className="space-y-4">
          {/* Próximos partidos */}
          <h2 className="text-xl font-semibold mb-4">Próximos Partidos</h2>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            
            {nextMatch.length === 0 ? (
              Array.from({ length: 2 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="w-18 h-18 bg-gray-300"/>
                        <div>
                          <div className="flex">
                            <Skeleton className="w-40 h-4 mt-1 bg-gray-300"/>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-2">
                            <Calendar className="h-4 w-4 mr-2" />
                            <Skeleton className="w-18 h-4 bg-gray-300"/>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-2">
                            <MapPin className="h-4 w-4 mr-2" />
                            <Skeleton className="w-18 h-4 bg-gray-300"/>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-2">
                            <Users2 className="h-4 w-4 mr-2" />
                            <Skeleton className="w-18 h-4 bg-gray-300"/>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" className="w-full">
                            Ver detalles
                          </Button>
                      </div>
                    </div> 
                  </CardContent>
                </Card>
              ))
            ):(
              nextMatch.map((match) => (
                <Card key={match.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-3">
                          <span className="text-lg font-bold">{new Date(match.fecha).getDate()}</span>
                          <span className="text-sm">
                            {new Date(match.fecha).toLocaleString('es-ES', { month: 'long' })}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Partido Amistoso #{match.id}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(match.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-2" />
                            {match.sedes.nombre}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Users2 className="h-4 w-4 mr-2" />4 jugadores confirmados
                          </div>
                        </div>
                      </div>
                      <Link to={`/partidos/${match.id}`} className="block w-full md:w-auto">
                        <Button variant="outline" className="w-full">
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Partidos pasados */}
          <h2 className="text-xl font-semibold mb-4 mt-8">Partidos Anteriores</h2>
          <div className="grid gap-4">
            {partidos.length === 0 ? (
              Array.from({ length: 2 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3">
                          <Skeleton className="w-8 h-8 bg-gray-300"/>
                          <Skeleton className="w-16 h-3 mt-2 bg-gray-300"/>
                        </div>
                        <div>
                          <Skeleton className="w-30 h-4 mt-1 bg-gray-300"/>
                          <div className="flex items-center text-sm text-muted-foreground mt-2.5">
                            <MapPin className="h-4 w-4 mr-2" />
                            <Skeleton className="w-18 h-4 mt-1 bg-gray-300"/>
                          </div>
                          <Skeleton className="w-24 h-4 mt-2 ml-2 bg-gray-300"/>
                        </div>
                      </div>
                        <Button variant="outline" className="block w-full md:w-auto">
                          Ver resumen
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ):(
              partidos.map((partido) => (
                <Card key={`past-${partido.id}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3">
                          <span className="text-lg font-bold">{new Date(partido.fecha).getDate()}</span>
                          <span className="text-sm">
                            {new Date(partido.fecha).toLocaleString('es-ES', { month: 'long' })}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Partido Liga #{partido.id}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-2" />
                            {partido.sedes.nombre}
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                            Victoria 6-4, 6-3
                          </span>
                        </div>                      
                      </div>
                      <Link to={`/partidos/${partido.id}`} className="block w-full md:w-auto">
                        <Button variant="outline" className="w-full">
                          Ver resumen
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
          </div>
        </div>
      </main>

      {/* <MobileNav /> */}
    </div>
  )
}

