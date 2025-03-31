import { useState, useEffect } from "react";
import CardEquipo from "@/components/CardEquipo";
import { getEquiposUsuario } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EquiposSelect() {
  const [equipos, setEquipos] = useState([]);
  const { signOut, equipoPersona} = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchEquipos() {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user !== null) {
        const equiposData = await getEquiposUsuario(user.persona[0].id);
        setEquipos(equiposData);
      }
    }

    fetchEquipos();
  }, []);

  console.log("equipos: ", equipos);

  return (
    <div className="container relative mx-auto min-h-screen flex flex-col justify-center items-center">
      <Button className="absolute right-4 top-10" onClick={signOut}>
        Cerrar Sesión
      </Button>
      {equipoPersona && (
        <Button className="fixed right-3 bottom-5 rounded-full" onClick={() => navigate("/")}>
          <Home className=""/>
        </Button>
      )}
      <div className="text-center">
        <h1 className="text-4xl font-semibold">Mis equipos</h1>
        <p>Visualiza los equipos a los que perteneces o tus invitaciones</p>
      </div>
      <Tabs defaultValue="teams" className="my-5 flex flex-col items-center justify-center">
        <TabsList>
          <TabsTrigger value="teams" className={"cursor-pointer"}>
            Equipos
          </TabsTrigger>
          <TabsTrigger value="invitations" className={"cursor-pointer"}>
            Invitaciones
          </TabsTrigger>
          <TabsTrigger value="requests" className={"cursor-pointer"}>
            Solicitar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="teams">
          {/* Aceptado, Invitado, Pendiente */}

          {/* Equipos a los que perteneces */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(equipos.filter((equipo) => equipo.estado == "aceptado")).map((equipo) => (
              <CardEquipo key={equipo.id} equipo={equipo} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="invitations">
          {/*Equipos que te han invitado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(equipos.filter((equipo) => equipo.estado == "invitado")).map((equipo) => (
              <CardEquipo key={equipo.id} equipo={equipo} invitation={true} />
            ))}

          </div>
        </TabsContent>
        {/* <TabsContent value="requests">
          Pestaña para solicitar unión a equipo
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(equipos.filter((equipo) => equipo.estado !== "")).map((equipo) => (
              <CardEquipo key={equipo.id} equipo={equipo} invitation={true} />
            ))}

          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
