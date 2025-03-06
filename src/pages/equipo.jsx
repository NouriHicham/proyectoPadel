import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function EquipoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Equipo</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Jugador
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((player) => (
            <Card key={player}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      J{player}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Jugador {player}</h3>
                    <p className="text-sm text-muted-foreground">
                      Nivel: Intermedio
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        +34 6xx xxx xxx
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        jugador{player}@email.com
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link to={`/team/${player}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Ver perfil
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
