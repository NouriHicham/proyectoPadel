import AdminSidebar from "@/components/AdminSidebarx";
import AlertConfirmation from "@/components/AlertConfirmation";
import CardEquipo from "@/components/CardEquipo";
import CreateClubDialog from "@/components/CreateClubDialog";
import CreateTeamDialog from "@/components/CreateTeamDialog";
import { useClubData } from "@/hooks/useEquipos";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { getJugadresClub } from "@/lib/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { ComboboxClubs } from "@/components/combobox/Clubs";
import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartidosList } from "@/components/PartidosList";
import { mockData } from "@/lib/dataPartidos";
import { ComboboxEquipos } from "@/components/combobox/Equipos";
// componentes de prueba
function ClubInfo({ clubData }) {
  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-3 justify-between w-full">
          <div className="flex-shrink-0">
            {clubData.foto ? (
              <img
                src={clubData.foto}
                alt={`Logo de ${clubData.nombre}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 border-2 border-primary shadow">
                {clubData.nombre?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-primary mb-1">
              {clubData.nombre}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {clubData.descripcion}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CreateClubDialog edit={true} club={clubData} />
          <AlertConfirmation id={clubData?.id} type={"club"} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2">
        <div className="flex items-center">
          <span className="font-semibold w-32">Ubicación:</span>
          <span className="text-gray-700 dark:text-gray-200">
            {clubData.ubicacion}
          </span>
        </div>
      </div>
    </div>
  );
}
function TeamsManagement({ teams }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl mb-2 font-semibold">Equipos</h2>
        {/* search */}
        <div className="flex items-center gap-2 min-w-[25rem]">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              type="search"
              // value={value}
              // onChange={onChange}
              placeholder={"Busca por cualquier campo"}
              className="pl-9"
              aria-label="Buscar"
            />
          </div>
          <CreateTeamDialog />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {teams.length === 0 ? (
          <p>Todavia no hay equipos asociados a este club.</p>
        ) : (
          teams.map((equipo) => (
            <CardEquipo key={equipo.id} equipo={equipo} gestionar={true} />
          ))
        )}
      </div>
    </div>
  );
}
function MatchesManagement({ matches }) {
  console.log("partidos", matches);
  return (
    <div>
      <h2 className="text-2xl mb-2">Partidos</h2>
      <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Partidos
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">{mockData.length}</div> */}
              <p className="text-xs text-muted-foreground">
                +2 desde la semana pasada
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* {mockData.filter((p) => p.estado === "programado").length} */}
              </div>
              <p className="text-xs text-muted-foreground">
                +1 desde la semana pasada
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Juego</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* {mockData.filter((p) => p.estado === "en juego").length} */}
              </div>
              <p className="text-xs text-muted-foreground">Ahora mismo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* {mockData.filter((p) => p.estado === "finalizado").length} */}
              </div>
              <p className="text-xs text-muted-foreground">
                +3 desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-5">
          <Tabs defaultValue="todos" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="programados">Programados</TabsTrigger>
                <TabsTrigger value="en-juego">En Juego</TabsTrigger>
                <TabsTrigger value="finalizados">Finalizados</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="todos" className="space-y-4">
              <PartidosList partidos={mockData} />
            </TabsContent>
            <TabsContent value="programados" className="space-y-4">
              <PartidosList
                partidos={mockData.filter((p) => p.estado === "programado")}
              />
            </TabsContent>
            <TabsContent value="en-juego" className="space-y-4">
              <PartidosList
                partidos={mockData.filter((p) => p.estado === "en juego")}
              />
            </TabsContent>
            <TabsContent value="finalizados" className="space-y-4">
              <PartidosList
                partidos={mockData.filter((p) => p.estado === "finalizado")}
              />
            </TabsContent>
          </Tabs>
          {/* Filtro por equipo, y mostrar partidos agrupados en parejas/equipo */}
          <ComboboxEquipos />
        </div>
      </div>
    </div>
  );
}

function PlayersManagement({ clubData }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(players.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlayers = players.slice(startIndex, endIndex); //

  // Filtros
  // const [selectedClub, setSelectedClub] = useState(null);
  const [posicion, setPosicion] = useState("all"); // "" para 'todas'
  const [disponibilidad, setDisponibilidad] = useState("all");

  useEffect(() => {
    const getPlayers = async () => {
      try {
        setLoading(true);
        const data = await getJugadresClub(clubData?.id);
        console.log(data);
        setPlayers(data || []);
        setCurrentPage(1); // Reiniciar a la primera página al cambiar de club
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    getPlayers();
  }, [clubData]);

  return (
    <div className="p-4 max-h-[60rem] ">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-5">
        <h2 className="text-xl font-bold mb-0 sm:mb-4">Jugadores del Club</h2>
        {/* filtros */}
        <div className="flex flex-col sm:flex-row gap-3 min-w-[18rem] w-full sm:w-auto">
          {/* <ComboboxClubs club={selectedClub} setClub={setSelectedClub} /> */}
          {/* Equipos */}

          {/* Posición */}
          <div className="flex flex-col w-full sm:w-auto">
            <label
              htmlFor="filtro-posicion"
              className="text-xs font-medium mb-1"
            >
              Posición
            </label>
            <Select
              id="filtro-posicion"
              value={posicion}
              onValueChange={setPosicion}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Todas las posiciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Drive">Drive</SelectItem>
                <SelectItem value="Revés">Revés</SelectItem>
                <SelectItem value="Ambas">Ambas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Disponibilidad */}
          <div className="flex flex-col w-full sm:w-auto">
            <label
              htmlFor="filtro-disponibilidad"
              className="text-xs font-medium mb-1"
            >
              Disponibilidad
            </label>
            <Select
              id="filtro-disponibilidad"
              value={disponibilidad}
              onValueChange={setDisponibilidad}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Toda disponibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Fines de semana">Fines de semana</SelectItem>
                <SelectItem value="Mañanas">Mañanas</SelectItem>
                <SelectItem value="Tardes">Tardes</SelectItem>
                <SelectItem value="Flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="flex flex-col w-full sm:w-auto">
            <label htmlFor="filtro-search" className="text-xs font-medium mb-1">
              Buscar
            </label>
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                id="filtro-search"
                type="search"
                // value={value}
                // onChange={onChange}
                placeholder={"Busca por cualquier campo"}
                className="pl-9"
                aria-label="Buscar"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Club ID</TableHead>
                <TableHead>Posición</TableHead>
                <TableHead>Disponibilidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.id}</TableCell>
                  <TableCell>{player.nombre}</TableCell>
                  <TableCell>{player.apellido}</TableCell>
                  <TableCell>
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={`${player.nombre} ${player.apellido}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span>Sin avatar</span>
                    )}
                  </TableCell>
                  <TableCell>{player.user_id}</TableCell>
                  <TableCell>{player.telefono}</TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell>{player.club_id}</TableCell>
                  <TableCell>{player.posicion}</TableCell>
                  <TableCell>{player.disponibilidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <PaginationItem key={idx + 1}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === idx + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(idx + 1);
                      }}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={currentPage === totalPages}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { id } = useParams();
  const { clubData, getClubData } = useClubData();
  const [activeTab, setActiveTab] = useState("club");

  useEffect(() => {
    if (id) getClubData(id);
  }, [id]);

  console.log(clubData);

  return (
    <div className="container mx-auto p-2 my-4 flex">
      <AdminSidebar
        clubData={clubData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 ml-4">
        <h1 className="text-4xl">Club #{id}</h1>
        <div className="mt-5">
          {activeTab === "club" && <ClubInfo clubData={clubData} />}
          {activeTab === "teams" && (
            <TeamsManagement
              teams={clubData?.equipos || []}
              clubData={clubData}
              getClubData={getClubData}
            />
          )}
          {activeTab == "players" && <PlayersManagement clubData={clubData} />}
          {activeTab === "matches" && (
            <MatchesManagement matches={clubData?.partidos || []} />
          )}
        </div>
      </div>
    </div>
  );
}
