"use client";

import { useEffect, useState } from "react"
import { CalendarIcon, ChevronRight, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getEquipoPartidos, getSedes, insertarPartido } from "@/lib/database"

const formSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida.",
  }),
  time: z.string().min(1, "La hora es requerida."),
  sede: z.string().min(1, "La sede es requerida."),
  equipos: z.string().min(1, "¿Contra quien juegas?"),
});

export function CreateMatchDialog() {
  const [open, setOpen] = useState(false);
  const savedInfo = JSON.parse(localStorage.getItem("personaGuardada"));
  const [equipos, setEquipos] = useState([]);
  const [sedes, setSedes] = useState([]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const equipoData = await getEquipoPartidos(
          savedInfo.equipo_id,
          savedInfo.equipos.liga_id
        );
        setEquipos(equipoData);
        const sedeData = await getSedes();
        setSedes(sedeData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAll();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: "10:00",
    },
  });

  function onSubmit(values) {
    const { date, time, sede, equipos } = values;

    const dateTime = format(date, "yyyy-MM-dd") + " " + time;

    const datos = [];
    datos.push({
      fecha: dateTime,
      estado: "programado",
      sede_id: sede,
      equipo1_id: savedInfo.equipo_id,
      equipo2_id: equipos,
      liga_id: savedInfo.equipos.liga_id,
    });

    insertarPartido(datos[0]);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={"rounded-full h-8 w-8 sm:rounded-md sm:h-auto sm:w-auto"}>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
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
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="time" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sede"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sede</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <FormField
              control={form.control}
              name="equipos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo contrario</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el equipo" />
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

            <FormField
              control={form.control}
              name="matchType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Convocatoria (pronto...)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="friendly">Amistoso</SelectItem>
                      <SelectItem value="league">Liga</SelectItem>
                      <SelectItem value="tournament">Torneo</SelectItem>
                      <SelectItem value="training">Entrenamiento</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="submit">Crear Convocatoria</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
