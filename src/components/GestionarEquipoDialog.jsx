import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, UserMinus, Settings } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  eliminarJugadorEquipo,
  getJugadoresEquipo,
  invitarPersona,
  jugadoresDiferenteEquipo,
} from "@/lib/database";
import toast from "react-hot-toast";
import { useClubData } from "@/hooks/useEquipos";

export default function GestionarEquipoDialog({ teamData }) {
  const { getAvailablePlayers, availablePlayers } = useClubData();
  // Estados
  const [open, setOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  //   const [team, setTeam] = useState(mockTeam);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  // const [availablePlayers, setAvailablePlayers] = useState([]);
  const [jugadoresAInvitar, setJugadoresAInvitar] = useState([]);

  useEffect(() => {
    // const getAvailablePlayers = async () => {
    //   try {
    //     const data = await getJugadoresEquipo(teamData?.id);
    //     setAvailablePlayers(data || []);
    //   } catch (error) {
    //     console.error(("Error fetching available players:", error));
    //   }
    // };

    const jugadoresAInvitar = async () => {
      try {
        const data = await jugadoresDiferenteEquipo(teamData?.id);
        setJugadoresAInvitar(data || []);
      } catch (error) {
        console.error(("Error fetching available players:", error));
      }
    };
    jugadoresAInvitar();
  }, []);

  useEffect(() => {
    if (teamData?.id) {
      getAvailablePlayers(teamData);
    }
  }, [teamData]);

  console.log("available", availablePlayers);

  // Filtrado de jugadores
  const filteredPlayers = availablePlayers?.filter((ep) => {
    const nombre = ep?.nombre?.toLowerCase() + " " + ep?.apellido.toLowerCase();
    const posicion = ep?.posicion?.toLowerCase();
    const disponibilidad = ep?.disponibilidad?.toLowerCase();
    const tel = String(ep?.telefono).toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    return (
      nombre.includes(query) ||
      posicion.includes(query) ||
      disponibilidad.includes(query) ||
      tel.includes(query) ||
      String(ep.id).includes(query)
    );
  });

  const handleRemovePlayer = async (jugadorId, equipoId) => {
    try {
      if (!jugadorId || !equipoId) return;

      const success = await eliminarJugadorEquipo(jugadorId, equipoId);

      if (success) {
        getAvailablePlayers(teamData);
        toast.success("Jugador eliminado correctamente.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInvitar = async (personaId, equipoId) => {
    try {
      if (!personaId || !equipoId) return;

      const result = await invitarPersona(personaId, equipoId);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(teamData);
  console.log(filteredPlayers);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant=""
          className="px-2 h-8 hover:bg-gray-200 hover:text-black transition-colors"
        >
          <Settings />
          <span className="hidden md:block">Gestionar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {teamData?.nombre}
          </DialogTitle>
          <DialogDescription>
            Gestiona tu equipo y sus jugadores. Puedes invitar nuevos jugadores
            y eliminar jugadores existentes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* gestion de jugadores */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Jugadores del Equipo
                  </CardTitle>
                  <CardDescription>
                    {availablePlayers?.length} jugadores en el equipo
                  </CardDescription>
                </div>
                <Button onClick={() => setInviteDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Invitar a Jugador
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Busca jugadores por id, nombre, posición..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredPlayers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Jugador</TableHead>
                      <TableHead>Posición</TableHead>
                      <TableHead>Disponibilidad</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlayers.map((ep) => (
                      <TableRow key={ep.id}>
                        <TableCell>{ep?.id}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={ep.avatar || "/placeholder.svg"}
                              alt={ep.nombre}
                            />
                            <AvatarFallback>
                              {ep.nombre.substring(0, 1).toUpperCase()}
                              {ep.apellido
                                ? ep.apellido.substring(0, 1).toUpperCase()
                                : ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {ep.nombre} {ep.apellido}
                            </p>
                            {ep.persona_id === teamData.capitan_id && (
                              <Badge variant="outline" className="text-xs">
                                Capitán
                              </Badge>
                            )}
                            {ep.persona_id === teamData.subcapitan_id && (
                              <Badge variant="outline" className="text-xs">
                                Subcapitán
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{ep?.posicion || "-"}</TableCell>
                        <TableCell>{ep?.disponibilidad}</TableCell>
                        <TableCell>{ep?.telefono}</TableCell>
                        <TableCell>
                          <Badge variant={"outline"}>
                            {ep?.id === teamData?.capitan_id
                              ? "Capitán"
                              : ep?.id === teamData?.subcapitan_id
                              ? "Subcapitán"
                              : "Jugador"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {/* eliminar jugador de equipos_personas */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemovePlayer(ep?.id, teamData?.id)
                            }
                            disabled={
                              ep.persona_id === teamData?.capitan_id ||
                              ep.persona_id === teamData?.subcapitan_id
                            }
                            title={
                              ep.persona_id === teamData?.capitan_id ||
                              ep.persona_id === teamData?.subcapitan_id
                                ? "No se puede eliminar al capitán o subcapitán"
                                : "Eliminar jugador"
                            }
                          >
                            <UserMinus className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  {searchQuery
                    ? "No se encontraron jugadores con ese criterio de búsqueda"
                    : "No hay jugadores en este equipo"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Invite Player Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar a Jugador</DialogTitle>
            <DialogDescription>
              Selecciona un jugador para invitar al equipo
            </DialogDescription>
          </DialogHeader>

          <Select
            onValueChange={(value) =>
              setSelectedPlayerId(Number.parseInt(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un jugador" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {jugadoresAInvitar.map((jugador) => (
                  <SelectItem key={jugador.id} value={jugador.id.toString()}>
                    <div className="flex items-center w-full justify-between">
                      <span>{`${jugador.nombre} ${
                        jugador.apellido || ""
                      }`}</span>
                      <span className="ml-5 text-slate-600">
                        {jugador?.posicion}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <DialogFooter className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setInviteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              disabled={!selectedPlayerId}
              onClick={() => handleInvitar(selectedPlayerId, teamData?.id)}
            >
              Invitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
