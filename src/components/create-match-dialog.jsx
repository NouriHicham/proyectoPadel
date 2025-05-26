"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("es", es);
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getEquipoPartidos,
  getSedes,
  insertarPartido,
  getLigas,
  getEquiposPorLiga,
} from "@/lib/database";
import toast from "react-hot-toast";

const formSchema = z.object({
  datetime: z.date({ required_error: "La fecha y hora son requeridas." }),
  // time: z.string().min(1, "La hora es requerida."),
  sede: z.string().min(1, "La sede es requerida."),
  liga: z.string().optional(),
  equipoLocal: z.string().optional(),
  equipoVisitante: z.string().min(1, "El equipo visitante es requerido."),
});

export function CreateMatchDialog({ admin = null, club_id = null, getPartidosClub }) {
  const [open, setOpen] = useState(false);
  // const savedInfo = JSON.parse(localStorage.getItem("personaGuardada"));
  const [savedInfo, setSavedInfo] = useState(() =>
    JSON.parse(localStorage.getItem("personaGuardada"))
  );

  const [equipos, setEquipos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [ligas, setLigas] = useState([]);
  const [ligaSeleccionada, setLigaSeleccionada] = useState(null);

  useEffect(() => {
    async function fetchInit() {
      try {
        const sedeData = await getSedes();
        setSedes(sedeData);
        if (admin) {
          const ligasData = await getLigas();
          setLigas(ligasData || []);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchInit();
  }, [admin]);

  // Cargar equipos al cambiar la liga seleccionada (admin) o al inicio (no admin)
  useEffect(() => {
    async function fetchEquipos() {
      try {
        if (admin && ligaSeleccionada) {
          const equiposData = await getEquiposPorLiga(ligaSeleccionada);
          setEquipos(equiposData || []);
        } else if (!admin) {
          const equipoData = await getEquipoPartidos(
            savedInfo?.equipo_id,
            savedInfo?.equipos.liga_id
          );
          setEquipos(equipoData || []);
        } else {
          setEquipos([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (admin ? ligaSeleccionada : true) fetchEquipos();
  }, [admin, ligaSeleccionada]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datetime: null,
      equipoLocal: "",
      equipoVisitante: "",
      liga: "",
    },
  });

  // Equipo local seleccionado (solo admin)
  const equipoLocalSeleccionado = form.watch("equipoLocal");

  // Excluye el equipo local seleccionado
  const equiposVisitante =
    admin && equipoLocalSeleccionado
      ? equipos.filter(
          (equipo) => equipo.id.toString() !== equipoLocalSeleccionado
        )
      : equipos;

  const onSubmit = async (values) => {
    const { datetime, sede, equipoLocal, equipoVisitante, liga } = values;

    const equipoLocalObj = equipos.find((e) => e.id.toString() === equipoLocal);
    const equipoVisitanteObj = equipos.find(
      (e) => e.id.toString() === equipoVisitante
    );

    if (club_id) {
      const cumpleCondicion =
        (equipoLocalObj &&
          equipoLocalObj.club_id?.toString() === club_id.toString()) ||
        (equipoVisitanteObj &&
          equipoVisitanteObj.club_id?.toString() === club_id.toString());

      if (!cumpleCondicion) {
        toast.error(
          "Debes seleccionar al menos un equipo que pertenezca a este club."
        );
        return;
      }
    }

    // console.log("datos recibidos: ", values);
    const equipo1_id = admin ? equipoLocal : savedInfo.equipo_id;
    const equipo2_id = equipoVisitante;
    const liga_id = admin ? liga : savedInfo.equipos.liga_id;

    // Convierte a ISO para guardar correctamente (TIMESTAMP WITH TIME ZONE)
    const dateTimeISO = datetime.toISOString();

    const datos = {
      fecha: dateTimeISO,
      estado: "programado",
      sede_id: sede,
      equipo1_id,
      equipo2_id,
      liga_id,
    };

    // console.log("datos enviados: ", datos);

    try {
      const res = await insertarPartido(datos);
      console.log("res", res);
      if (res) {
        await getPartidosClub()
        toast.success("¡Partido creado correctamente!");
        setOpen(false);
        form.reset();
        setLigaSeleccionada(null);
      } else {
        toast.error("No se pudo crear el partido. Intenta de nuevo.");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al crear el partido.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full h-8 w-8 sm:rounded-md sm:h-auto sm:w-auto">
          <Plus />
          <span className="hidden sm:block">Nueva Convocatoria</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Convocatoria</DialogTitle>
          <DialogDescription>
            Programa una nueva convocatoria para los partidos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* <div className="grid gap-4 sm:grid-cols-2"> */}
            {/* Fecha */}
            {/* <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

            {/* Hora */}
            {/* <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="datetime-local" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            {/* </div> */}
            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha y hora</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="Pp"
                      locale="es"
                      placeholderText="Selecciona fecha y hora"
                      className="w-full border rounded px-3 py-2"
                      minDate={new Date()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sede */}
            <FormField
              control={form.control}
              name="sede"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sede</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la sede" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sedes.map((sede) => (
                        <SelectItem key={sede.id} value={sede.id.toString()}>
                          {sede.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select de liga solo para admin */}
            {admin && (
              <FormField
                control={form.control}
                name="liga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liga</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        setLigaSeleccionada(val);
                        // Limpiar selects de equipos cuando cambia la liga
                        form.setValue("equipoLocal", "");
                        form.setValue("equipoVisitante", "");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la liga" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ligas.map((liga) => (
                          <SelectItem key={liga.id} value={liga.id.toString()}>
                            {liga.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Selects de equipos */}
            {(!admin || ligaSeleccionada) && (
              <>
                {admin && (
                  <FormField
                    control={form.control}
                    name="equipoLocal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipo Local</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            // Si el visitante es igual al nuevo local, resetea el visitante
                            if (form.getValues("equipoVisitante") === val) {
                              form.setValue("equipoVisitante", "");
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el equipo local" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {equipos.map((equipo) => (
                              <SelectItem
                                key={equipo.id}
                                value={equipo.id.toString()}
                              >
                                {equipo.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="equipoVisitante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipo Visitante</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el equipo visitante" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {equiposVisitante.map((equipo) => (
                            <SelectItem
                              key={equipo.id}
                              value={equipo.id.toString()}
                            >
                              {equipo.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Crear Convocatoria</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
