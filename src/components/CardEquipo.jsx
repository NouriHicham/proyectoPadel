import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function CardEquipo({ equipo }) {
  const {setEquipoPersona} = useAuth()
  const navigate = useNavigate()
  const handleSeleccionEquipo = () => {
    setEquipoPersona(equipo)
    navigate("/")
  }

  return (
    <Card className="overflow-hidden w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <Avatar className={`h-12 w-12 ${equipo?.avatarColor || "Equipo"}`}>
            {/* Iniciales del equipo */}
            <AvatarFallback>{"ED"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{equipo?.name || "Equipo"}</CardTitle>
            <CardDescription className="line-clamp-1">
              {equipo?.description || ""}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {equipo?.members || ""} miembros
              </span>
            </div>
            <Badge variant="outline">{equipo?.role || "Miembro"}</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Próximo partido: {equipo?.nextMeeting || ""}
              </span>
            </div>
            {/* <div className="text-sm text-muted-foreground">
              Actividad reciente: {equipo?.recentActivity || ""}
            </div> */}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {/* Miembros */}
              {/* {memberAvatars}
              {team.members > 3 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                  +{team.members - 3}
                </div>
              )} */}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <Button
          variant="ghost"
          className="ml-auto h-8 w-full justify-between px-2"
          onClick={handleSeleccionEquipo}
        >
          Seleccionar este equipo
          <ArrowRight className="h-4 w-4" />
        </Button>
        {/* <Button
          variant="ghost"
          className="ml-auto h-8 w-full justify-between px-2"
        >
          Ver detalles del equipo
          <ArrowRight className="h-4 w-4" />
        </Button> */}
      </CardFooter>
    </Card>
  );
}
