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
import {
  getJugadoresClub,
  getLigas,
  getPartidosPorClub,
  getSedes,
  updatePersona,
} from "@/lib/database";
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
import {
  Calendar,
  FilterX,
  PlusCircle,
  Search,
  UserMinus2,
} from "lucide-react";
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
// import { mockData } from "@/lib/dataPartidos";
// import { ComboboxEquipos } from "@/components/combobox/Equipos";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import SolicitudesClub from "@/components/SolicitudesClub";
import { CreateMatchDialog } from "@/components/create-match-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateLigaDialog from "@/components/CreateLigaDialog";
import { CreateSedeDialog } from "@/components/create-sede-dialog";
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
function TeamsManagement({ teams, clubData }) {
  const [search, setSearch] = useState("");

  const filteredTeams = teams.filter((equipo) => {
    const searchLower = search.toLowerCase().trim();
    return (
      equipo.nombre?.toLowerCase().includes(searchLower) ||
      String(equipo.id)?.toLowerCase().includes(searchLower) ||
      equipo.descripcion?.toLowerCase().includes(searchLower)
    );
  });
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-10">
        {/* Título y añadir */}
        <div className="flex items-center gap-4 justify-between">
          <h2 className="text-2xl font-semibold">Equipos</h2>
          <CreateTeamDialog />
        </div>
        {/* Búsqueda y solicitudes */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-5 md:mt-0">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Busca por id, nombre o descripción"}
              className="pl-9"
              aria-label="Buscar"
            />
          </div>
          <SolicitudesClub clubId={clubData?.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTeams.length === 0 ? (
          search.trim().length > 0 ? (
            <p className="text-muted-foreground ">
              No hay equipos que coincidan con los criterios de búsqueda.
            </p>
          ) : (
            <p>Todavia no hay equipos asociados a este club.</p>
          )
        ) : (
          filteredTeams.map((equipo) => (
            <CardEquipo key={equipo.id} equipo={equipo} gestionar={true} />
          ))
        )}
      </div>
    </div>
  );
}
function MatchesManagement({ clubData }) {
  // console.log("partidos", matches);

  const [matches, setMatches] = useState([]);

  const getPartidosClub = async () => {
    try {
      const id = clubData?.id;
      if (!id) return;
      const data = await getPartidosPorClub(id);
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches for club:", error);
    }
  };

  useEffect(() => {
    getPartidosClub();
  }, []);

  return (
    <div className="">
      <div className="flex items-center justify-between my-3">
        <h2 className="text-2xl mb-2 font-bold">Partidos</h2>
        {/* <Button>
          <span>Crear Partido</span>
          <PlusCircle className="" size={30} />
        </Button> */}
        <CreateMatchDialog
          admin={true}
          club_id={clubData?.id}
          getPartidosClub={getPartidosClub}
        />
      </div>

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
              <div className="text-2xl font-bold">
                {matches?.resumen?.total_partidos}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {matches?.resumen?.partidos_programados}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Juego</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {matches?.resumen?.partidos_enJuego}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {matches?.resumen?.partidos_finalizados}
              </div>
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
              {Array.isArray(matches?.partidos) && (
                <PartidosList partidos={matches.partidos} />
              )}
            </TabsContent>
            <TabsContent value="programados" className="space-y-4">
              {Array.isArray(matches?.partidos) && (
                <PartidosList
                  partidos={matches.partidos.filter(
                    (p) => p.estado === "programado"
                  )}
                />
              )}
            </TabsContent>
            <TabsContent value="en-juego" className="space-y-4">
              {Array.isArray(matches?.partidos) && (
                <PartidosList
                  partidos={matches.partidos.filter(
                    (p) => p.estado === "en juego"
                  )}
                />
              )}
            </TabsContent>
            <TabsContent value="finalizados" className="space-y-4">
              {Array.isArray(matches?.partidos) && (
                <PartidosList
                  partidos={matches.partidos.filter(
                    (p) => p.estado === "finalizado"
                  )}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function PlayersManagement({ clubData }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [posicion, setPosicion] = useState("all"); // "" para 'todas'
  const [disponibilidad, setDisponibilidad] = useState("all");
  const [equipoId, setEquipoId] = useState("all");
  const [search, setSearch] = useState("");

  // filtrado
  const filteredPlayers = players.filter((player) => {
    const searchLower = search.toLowerCase().trim();

    const matchEquipo =
      equipoId === "all" || String(player?.equipos?.id) === equipoId;

    const matchPosicion =
      posicion === "all" || player?.personas?.posicion === posicion;

    const matchDisponibilidad =
      disponibilidad === "all" ||
      player?.personas?.disponibilidad === disponibilidad;

    const matchSearch =
      player?.personas?.nombre?.toLowerCase().includes(searchLower) ||
      player?.personas?.apellido?.toLowerCase().includes(searchLower) ||
      player?.personas?.email?.toLowerCase().includes(searchLower) ||
      String(player?.personas?.telefono)?.toLowerCase().includes(searchLower) ||
      String(player?.personas?.id)?.toLowerCase().includes(searchLower);

    return (
      matchEquipo &&
      matchPosicion &&
      matchDisponibilidad &&
      (searchLower === "" || matchSearch)
    );
  });

  // console.log("clubdata:", clubData);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex); //

  const handleClearFilters = () => {
    setPosicion("all");
    setDisponibilidad("all");
    setEquipoId("all");
    setSearch("");
    setCurrentPage(1);
  };

  const getPlayers = async () => {
    try {
      setLoading(true);
      const data = await getJugadoresClub(clubData?.id);
      console.log("jogadoresclub: ", data);
      setPlayers(data || []);
      setCurrentPage(1); // Reiniciar a la primera página al cambiar de club
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesvincularJugadorClub = async (playerId) => {
    try {
      console.log("idjogador:", playerId);
      const result = await updatePersona(playerId, { club_id: null });

      console.log("result:", result);

      if (result) {
        getPlayers();
        toast.success("Jugador desvinculado del club correctamente.");
      } else {
        toast.error("Error al desvincular el jugador.");
      }
    } catch (error) {
      console.error("Error desvinculando jugador: ", error);
      toast.error("Error en el proceso de desvinculación");
    }
  };

  useEffect(() => {
    getPlayers();
  }, [clubData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [disponibilidad, posicion, search]);

  return (
    <div className="p-4 max-h-[60rem] ">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-5">
        <h2 className="text-xl font-bold mb-0 sm:mb-4">Jugadores del Club</h2>
        {/* filtros */}
        <div className="flex flex-col sm:flex-row gap-3 min-w-[18rem] w-full sm:w-auto">
          {/* <ComboboxClubs club={selectedClub} setClub={setSelectedClub} /> */}
          {/* Equipos */}
          <div className="flex flex-col w-full sm:w-auto">
            <label htmlFor="filtro-equipo" className="text-xs font-medium mb-1">
              Equipos
            </label>
            <Select
              id="filtro-equipo"
              value={equipoId}
              onValueChange={setEquipoId}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Todos los equipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los equipos</SelectItem>
                {clubData?.equipos.map((equipo) => (
                  <SelectItem key={equipo?.id} value={String(equipo?.id)}>
                    {equipo?.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={"Busca por id, nombre o email..."}
                className="pl-9"
                aria-label="Buscar"
              />
            </div>
          </div>
          <Button className={"mt-5"} onClick={handleClearFilters}>
            Limpiar Filtros
            <FilterX />
          </Button>
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
                <TableHead>Equipo ID</TableHead>
                <TableHead>Posición</TableHead>
                <TableHead>Disponibilidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player?.personas?.id}</TableCell>
                  <TableCell>{player?.personas?.nombre}</TableCell>
                  <TableCell>{player?.personas?.apellido}</TableCell>
                  <TableCell>
                    {player.avatar ? (
                      <img
                        src={player?.personas?.avatar}
                        alt={`${player?.personas?.nombre} ${player?.personas?.apellido}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span>Sin avatar</span>
                    )}
                  </TableCell>
                  <TableCell>{player?.personas?.user_id}</TableCell>
                  <TableCell>{player?.personas?.telefono}</TableCell>
                  <TableCell>{player?.personas?.email}</TableCell>
                  <TableCell>{player?.equipo_id}</TableCell>
                  <TableCell>
                    {player?.personas?.posicion || "No asignada"}
                  </TableCell>
                  <TableCell>
                    {player?.personas?.disponibilidad || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      title="Desvincular jugador del club"
                      className="cursor-pointer"
                      onClick={() => handleDesvincularJugadorClub(player?.id)}
                    >
                      <UserMinus2 size={20} color="red" />
                    </span>
                  </TableCell>
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

function LigasManagement() {
  const [ligas, setLigas] = useState([]);

  const fetchLigas = async () => {
    try {
      const ligasData = await getLigas();
      setLigas(ligasData || []);
    } catch (error) {
      console.error("Error fetching ligas: ", error);
    }
  };

  useEffect(() => {
    fetchLigas();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Gestión de Ligas</h2>
        {/* Modal para Crear/Editar */}
        <CreateLigaDialog fetchLigas={fetchLigas} />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {ligas.map((liga) => (
          <div
            key={liga.id}
            className="bg-white rounded-lg shadow p-5 flex flex-col justify-between min-h-[180px] border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              {liga.foto ? (
                <img
                  src={liga.foto}
                  alt={liga.nombre}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
                  {liga.nombre[0]}
                </div>
              )}
              <div>
                <div className="font-semibold text-lg">{liga.nombre}</div>
                <div className="text-sm text-gray-500 capitalize">
                  {liga.tipo}
                </div>
              </div>
            </div>
            <p className="text-gray-700 flex-1">{liga.descripcion}</p>
            <div className="flex gap-2 mt-4">
              {/* Editar */}
              <CreateLigaDialog
                isEditing={true}
                editingLiga={liga}
                fetchLigas={fetchLigas}
              />
              {/* eliminar */}
              <AlertConfirmation id={liga?.id} type={"liga"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function SedesManegement() {
  const [sedes, setSedes] = useState([]);

  const fetchSedes = async () => {
    try {
      const sedesData = await getSedes();
      setSedes(sedesData || []);
    } catch (error) {
      console.error("Error fetching sedes: ", error);
    }
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Gestión de Sedes</h2>
        <CreateSedeDialog fetchSedes={fetchSedes}/>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sedes.map((sede) => (
          <div
            key={sede.id}
            className="bg-white rounded-lg shadow p-5 flex flex-col justify-between min-h-[180px] border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-lg font-bold">
                {sede.nombre[0]}
              </div>
              <div>
                <div className="font-semibold text-lg">{sede.nombre}</div>
                <div className="text-sm text-gray-500 capitalize">
                  {sede.tipo}
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-1">{sede.ubicacion}</p>
            <p className="text-gray-500 text-sm">Pistas: {sede.numpistas}</p>
            <div className="flex gap-2 mt-4">
              {/* Editar */}
              <CreateSedeDialog
                isEditing={true}
                sedeEditing={sede}
                fetchSedes={fetchSedes}
              />
              {/* Eliminar */}
              <AlertConfirmation id={sede?.id} type={"sede"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { id } = useParams();
  const { clubData, getClubData } = useClubData();
  const [activeTab, setActiveTab] = useState("club");
  // const [partidosData, setPartidosData] = useState([]);

  useEffect(() => {
    if (id) getClubData(id);
  }, [id]);

  // useEffect(() => {
  //   const getPartidosClub = async () => {
  //     try {
  //       if (!id) return;
  //       const data = await getPartidosPorClub(id);
  //       setPartidosData(data);
  //     } catch (error) {
  //       console.error("Error fetching matches for club:", error);
  //     }
  //   };

  //   getPartidosClub();
  // }, [id]);
  // console.log(partidosData);

  return (
    <div className="container mx-auto p-2 my-4 flex flex-col lg:flex-row">
      <div className="w-full lg:w-64 mb-4 lg:mb-0">
        <AdminSidebar
          clubData={clubData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
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
            <MatchesManagement
              // matches={partidosData || []}
              clubData={clubData}
            />
          )}
          {activeTab === "ligas" && <LigasManagement />}
          {activeTab === "sedes" && <SedesManegement />}
        </div>
      </div>
    </div>
  );
}
