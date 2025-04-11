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
import { useContext, useState } from "react";
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
import { Textarea } from "./ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { crearClub } from "@/lib/database";

const formSchema = z.object({
  nombre: z.string({
    required_error: "La fecha es requerida.",
  }),
  descripcion: z.string().min(1, "Introduce una descripción del club."),
  // foto: z.string().min(1, "Elige una foto."),
  ubicacion: z.string().min(1, "La ubicación es requerida."),
});

export default function CreateClubDialog() {
  const [open, setOpen] = useState(false);
  const {equipoPersona} = useAuth()
 
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "", 
      descripcion: "", 
      foto: "", 
      ubicacion: ""
    },
  });
  async function onSubmit(values) {
    // const { nombre, descripcion, foto, ubicacion} = values;
    let data = {
      ...values,
      admin_id: equipoPersona?.persona_id
    }
    
    console.log(data)
    try {
      await crearClub(data)
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error al crear el club: ', error)
    }
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
                    <Textarea
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
                  <FormControl>
                    <Input type="text" placeholder="Introduce la ubicación" {...field} />
                  </FormControl>
                  {/* <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una ubicación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>

                    </SelectContent>
                  </Select> */}
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
