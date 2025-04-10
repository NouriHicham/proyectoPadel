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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { es, id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Input } from "./ui/input";

const formSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida.",
  }),
  time: z.string().min(1, "La hora es requerida."),
  sede: z.string().min(1, "La sede es requerida."),
  equipos: z.string().min(1, "¿Contra quien juegas?"),
});

export default function CreateClubDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: "10:00",
    },
  });
  function onSubmit(values) {
    // const { date, time, sede, equipos } = values;

    // const dateTime = format(date, "yyyy-MM-dd") + " " + time;

    // const datos = [];
    // datos.push({
    //   fecha: dateTime,
    //   estado: "programado",
    //   sede_id: sede,
    //   equipo1_id: savedInfo.equipo_id,
    //   equipo2_id: equipos,
    //   liga_id: savedInfo.equipos.liga_id,
    // });

    // console.log(values);
    // console.log(datos);
    // insertarPartido(datos[0]);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="underline cursor-pointer">O crea un club</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Club</DialogTitle>
          <DialogDescription>
            Programa una nueva convocatoria para los partidos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nombre del club"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campo para la Descripción */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Describe brevemente el proyecto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo para la Foto */}
            <FormField
              control={form.control}
              name="foto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo para la Ubicación */}
            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una ubicación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Aquí puedes mapear las ubicaciones disponibles */}
                      {/* {ubicaciones.map((ubicacion) => (
                <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                  {ubicacion.nombre}
                </SelectItem>
              ))} */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones de acción */}
            <DialogFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
