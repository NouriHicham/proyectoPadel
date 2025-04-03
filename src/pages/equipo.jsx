import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Plus, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  invitarPersona,
  jugadoresDiferenteEquipo,
  leerPersonas,
} from "@/lib/database";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce un email válido.",
  }),
  phone: z.string().min(9, {
    message: "Por favor, introduce un número de teléfono válido.",
  }),
  avatar: z.string().optional(),
});

export default function EquipoPage() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [personas, setPersonas] = useState([]); // array de personas pre-cargadas
  const { equipoPersona } = useAuth();
  const [personaId, setPersonaId] = useState(null);
  const [defaultTab, setDefaultTab] = useState("jugadores");

  const equipoId = JSON.parse(
    localStorage.getItem("personaGuardada")
  ).equipo_id;

  const [listaJugadores, setListaJugadores] = useState([]); // array de jugadores pre-cargados

  useEffect(() => {
    const fetchPersonas = async () => {
      const data = await leerPersonas(equipoPersona?.equipo_id);
      setPersonas(data);
    };

    const diferentesJugadores = async () => {
      const data = await jugadoresDiferenteEquipo(equipoPersona?.equipo_id);
      const personasArray = data.map((item) => item.personas);
      setListaJugadores(personasArray);
      // console.log("Diferentes jugadores", personasArray);
    };

    fetchPersonas();
    diferentesJugadores();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values) {
    console.log(values);
    setOpen(false);
    form.reset();
  }

  const handleInvitar = async () => {
    try {
      if (personaId == null) {
        alert("Debes seleccionar una persona");
        return;
      }

      await invitarPersona(personaId, equipoId);
      setOpen2(false);
    } catch (error) {
      console.error("Error al invitar a la persona:", error);
    }
  };

  // console.log(personas);
  // console.log(equipoPersona)
  console.log('jugadores diferentes: ', listaJugadores)
  // console.log(defaultTab)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Equipo</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Tabs
              defaultValue="jugadores"
              className="mr-2"
              onValueChange={(value) => setDefaultTab(value)}
            >
              <TabsList>
                <TabsTrigger value="jugadores" className={"cursor-pointer"}>
                  Jugadores
                </TabsTrigger>
                {/* <TabsTrigger value="invitaciones" className={"cursor-pointer"}>
                  Invitaciones
                </TabsTrigger> */}
                {/* Si el usuario actual es capitán es subcapitán, puede ver las invitaciones */}
                {Object.values(equipoPersona?.equipos).includes(equipoPersona?.persona_id) &&
                  <TabsTrigger value="invitaciones" className={"cursor-pointer"}>
                  Invitaciones
                </TabsTrigger>}
              </TabsList>
            </Tabs>
            {/* Modal para invitar a jugador */}
            <Dialog open={open2} onOpenChange={setOpen2}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invitar a Jugador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invitar a Jugador</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>

                <Select
                  onValueChange={(value) => setPersonaId(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un jugador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {listaJugadores.map((jugador) => (
                        <SelectItem
                          key={jugador.id}
                          value={jugador.id.toString()}
                        >
                          {`${jugador.nombre} ${jugador.apellido}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button onClick={handleInvitar}>Invitar</Button>
              </DialogContent>
            </Dialog>
            {/* Modal para añadir jugador de forma manual */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Jugador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir jugador</DialogTitle>
                  <DialogDescription>
                    Introduce los datos del jugador
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellido</FormLabel>
                            <FormControl>
                              <Input placeholder="Apellido" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Teléfono"
                              type="tel"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avatar URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="URL del Avatar"
                              type="url"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Añadir Jugador</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Interesa que solo el admin pueda ver el siguiente contenido.  */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {defaultTab === "jugadores" ? (
            personas
              .filter((persona) => persona.estado === "aceptado")
              .map((player) => (
                <Card
                  key={player.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={
                            player.personas.foto ||
                            "https://github.com/shadcn.png"
                          }
                        />
                        <AvatarFallback>
                          {player.personas.nombre.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {player.personas.nombre}
                        </h3>

                        <div className="mt-2 space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2 opacity-70" />
                            {player.personas.telefono
                              ? `+34 ${player.personas.telefono}`
                              : "No registrado"}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2 opacity-70" />
                            {player.personas.email}
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <Link to={`/equipo/jugador/${player.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Ver perfil
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : personas.filter((persona) => persona.estado === "invitado")
              .length > 0 ? (
            personas
              .filter((persona) => persona.estado === "invitado")
              .map((player) => (
                <Card
                  key={player.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={
                            player.personas.foto ||
                            "https://github.com/shadcn.png"
                          }
                        />
                        <AvatarFallback>
                          {player.personas.nombre.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {player.personas.nombre}
                        </h3>

                        <div className="mt-2 space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2 opacity-70" />
                            {player.personas.telefono
                              ? `+34 ${player.personas.telefono}`
                              : "No registrado"}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2 opacity-70" />
                            {player.personas.email}
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <Link to={`/equipo/jugador/${player.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Ver perfil
                            </Button>
                          </Link>
                          <Button size="sm" className="w-full mt-2 ">
                            Aceptar solicitud
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <div className="mx-auto flex flex-col items-center justify-center text-muted-foreground">
                <UserX className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium">
                  No hay invitaciones pendientes
                </h3>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
