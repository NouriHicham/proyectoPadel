import { useState, useEffect } from "react";
import CardEquipo from "@/components/CardEquipo";
import {
  getClubs,
  getEquiposUsuario,
  obtenerEquiposDiferentes,
} from "@/lib/database";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterX, Home, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/supabase";
import { Header } from "@/components/header";
import CreateClubDialog from "@/components/CreateClubDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useClubData } from "@/hooks/useEquipos";
import { Input } from "@/components/ui/input";
import { ComboboxClubs } from "@/components/combobox/Clubs";

export default function EquiposSelect() {
  const [equipos, setEquipos] = useState([]);
  const [equiposDiferentes, setEquiposDiferentes] = useState([]);
  const { signOut, equipoPersona, user, userClubs } = useAuth();
  const navigate = useNavigate();
  const { getUserClubs } = useClubData();
  // const [userClubs, setUserClubs] = useState([]);

  // filter
  const [search, setSearch] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);

  async function fetchEquipos() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user !== null) {
      try {
        const equiposData = await getEquiposUsuario(user.persona[0].id);
        setEquipos(equiposData);

        // Guardar los equipos diferentes en el state también (prueba)
        const difEquiposData = await obtenerEquiposDiferentes(
          user.persona[0]?.id
        );
        setEquiposDiferentes(difEquiposData);

        // clubes user
        // const clubsData = await getClubs(user.persona[0].id);
        // setUserClubs(clubsData);
        getUserClubs();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleClearFilters = () => {
    setSearch("");
    setSelectedClub(null);
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  // Bloque para escuchar cambios en la tabla equipos_personas
  useEffect(() => {
    const changes = supabase
      .channel(`schema-db-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "equipos_personas" },
        (payload) => {
          fetchEquipos();
        }
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, []);

  console.log("equipos: ", equipos);
  console.log("clubs: ", userClubs);
  console.log("user: ", user);
  console.log("eqdiferentes: ", equiposDiferentes);

  return (
    <>
      {equipoPersona && <Header />}
      <div className="container relative mx-auto mt-7 flex flex-col justify-center items-center py-4">
        {/* <Button className="absolute right-4 top-10" onClick={signOut}>
          Cerrar Sesión
        </Button> */}
        {equipoPersona && (
          <Button
            className="fixed right-3 bottom-5 rounded-full"
            onClick={() => navigate("/")}
          >
            <Home className="" />
          </Button>
        )}
        <Button
          className="fixed right-3 bottom-5 rounded-full"
          onClick={() => signOut()}
        >
          Logout
        </Button>
        <div className="text-center">
          <h1 className="text-4xl font-semibold">Mis equipos</h1>
          <p>Visualiza los equipos a los que perteneces o tus invitaciones.</p>
          <CreateClubDialog />
        </div>
        <Tabs
          defaultValue="teams"
          className="my-5 flex flex-col items-center justify-center"
        >
          <TabsList className={"mb-5"}>
            <TabsTrigger value="teams" className={"cursor-pointer"}>
              Equipos
            </TabsTrigger>
            <TabsTrigger value="invitations" className={"cursor-pointer"}>
              Invitaciones
            </TabsTrigger>
            <TabsTrigger value="requests" className={"cursor-pointer"}>
              Solicitar
            </TabsTrigger>
            <TabsTrigger value="clubs" className={"cursor-pointer"}>
              Clubes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="teams">
            {/* Aceptado, Invitado, Pendiente */}

            {/* Equipos a los que perteneces */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {equipos
                .filter((equipo) => equipo.estado == "aceptado")
                .map((equipo) => (
                  <CardEquipo key={equipo.id} equipo={equipo} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="invitations">
            {/*Equipos que te han invitado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {equipos
                .filter((equipo) => equipo.estado == "invitado")
                .map((equipo) => (
                  <CardEquipo
                    key={equipo.id}
                    equipo={equipo}
                    invitation={true}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="requests">
            {/* Pestaña para solicitar unión a equipo */}
            <div className="flex items-center gap-2 mb-5">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={"Busca por id, nombre o descripción..."}
                  className="pl-9"
                  aria-label="Buscar"
                />
              </div>
              <div className="">
                <ComboboxClubs club={selectedClub} setClub={setSelectedClub} />
              </div>
              <Button onClick={() => handleClearFilters()}>
                <span>Borrar filtros</span>
                <FilterX />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {/* Filtrar por persona id */}
              {equiposDiferentes
                .filter((equipo) => {
                  // Filtro por club si hay uno seleccionado
                  const clubMatch = selectedClub
                    ? String(equipo.club_id) === String(selectedClub)
                    : true;

                  // Filtro por búsqueda (nombre, descripción, id)
                  const searchLower = search.toLowerCase();
                  const nombreMatch = equipo.nombre
                    .toLowerCase()
                    .includes(searchLower);
                  const descripcionMatch = equipo.descripcion
                    .toLowerCase()
                    .includes(searchLower);
                  const idMatch = String(equipo.id).includes(searchLower);

                  // si hay club, y almenos uno de los filtros coincide, se muestra el equipo
                  return (
                    clubMatch && (nombreMatch || descripcionMatch || idMatch)
                  );
                })
                .map((equipo) => (
                  <CardEquipo
                    key={equipo.id}
                    equipo={equipo}
                    solicitar={true}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="clubs">
            {/* Pestaña que muestre los clubs del usuario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {userClubs.map((club) => (
                <Card className="overflow-hidden w-full" key={club.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 bg-gray-200">
                        <AvatarFallback>
                          {club.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle>{club.nombre}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {club.descripcion}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Ubicación: {club.ubicacion}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-3 flex items-center justify-center">
                    {/* {user?.persona[0]?.id === club.admin_id ? ( */}
                    <Link
                      variant="outline"
                      className="border rounded-md p-2"
                      to={`/clubs/${club?.id}`}
                    >
                      Gestionar club
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
