import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Calendar, ArrowRight, Check, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { aceptarInvitacion } from "@/lib/database";

export default function CardEquipo({ equipo, invitation = false }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const {setEquipoPersona} = useAuth()
  const navigate = useNavigate()
  const personaId = JSON.parse(localStorage.getItem('personaGuardada')).persona_id;
  const equipoId = equipo?.equipo_id;

  const handleSeleccionEquipo = () => {
    if (!invitation) {
      setEquipoPersona(equipo)
      navigate("/")
    }else{
      // Si es una invitación, setear la invitacion como 'aceptada' y guardar en local storage este equipo y navegar a /
      
      
    }
  }

  const handleAceptar = async () => {
    try {
      const data = await aceptarInvitacion(personaId, equipoId);
      navigate("/equipos")
    } catch (error) {
      console.error("Error al aceptar la invitacion:", error);
    }
  };

  return (
    <Card className="overflow-hidden w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <Avatar className={`h-12 w-12 ${equipo?.avatarColor || "Equipo"}`}>
            {/* Iniciales del equipo */}
            <AvatarFallback>{equipo?.equipo_id}</AvatarFallback>
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
            <Badge variant="outline">
              {user.persona[0].id == equipo?.equipos.capitan_id ? 'Capitan' : user.persona[0].id == equipo?.equipos.subcapitan_id ? 'Subcapitan' : 'Jugador'} 
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Próximo partido: {equipo?.nextMeeting || ""}
              </span>
            </div>
          </div>
          <Button
          variant="ghost"
          className="ml-auto h-8 w-full justify-between px-2">
          Detalles
          <Info className="h-4 w-4"/>
        </Button>
          {/* <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              Miembros
              {memberAvatars}
              {team.members > 3 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                  +{team.members - 3}
                </div>
              )}
            </div>
          </div> */}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
      {invitation ? (
        <>
        <Button
          variant=""
          className="ml-auto h-8 w-full justify-between px-2"
          onClick={handleAceptar}
        >
          Unirme al equipo
          <Check className="h-4 w-4"></Check>
        </Button>
      </>
      ) : (
        <Button
          variant=""
          className="ml-auto h-8 w-full justify-between px-2"
          onClick={handleSeleccionEquipo}
        >
          Seleccionar este equipo
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
        
        
      </CardFooter>
    </Card>
  );
}
