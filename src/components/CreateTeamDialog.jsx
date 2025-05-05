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
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { crearEquipo } from "@/lib/database";
import { Plus } from "lucide-react";
import { useClubData } from "@/hooks/useEquipos";
import { ComboboxLigas } from "./selects/ligas";

// Esquema de validación
const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  descripcion: z.string().min(1, "La descripción es requerida."),
  foto: z.string().min(1, "La foto es requerida."),
  club_id: z.string().min(1, "El club es requerido."),
  liga_id: z.string().min(1, "La liga es requerida."),
  capitan_id: z.string().min(1, "El capitán es requerido."),
  subcapitan_id: z.string().min(1, "El subcapitán es requerido."),
});

export default function CreateTeamDialog({ clubData }) {
  const [open, setOpen] = useState(false);
  const { getClubData } = useClubData();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      foto: "",
      club_id: clubData?.id ? String(clubData.id) : "",
      liga_id: "",
      capitan_id: "",
      subcapitan_id: "",
    },
  });

  async function onSubmit(values) {
    try {
      await crearEquipo({
        ...values,
        club_id: parseInt(values.club_id),
        liga_id: parseInt(values.liga_id),
        capitan_id: parseInt(values.capitan_id),
        subcapitan_id: parseInt(values.subcapitan_id),
      });

      getClubData(clubData?.id);
      setOpen(false);
      form.reset();
      // Vuelve a poner el club_id después del reset
      form.setValue("club_id", String(clubData.id));
    } catch (error) {
      console.error("Error al crear el equipo: ", error);
    }
  }

  console.log(clubData);

  return (
    <Dialog open={open} onOpenChange={setOpen} className="z-0">
      <DialogTrigger asChild>
        <Button
          className={"rounded-full h-8 w-8 sm:rounded-md sm:h-auto sm:w-auto"}
        >
          <Plus />
          <span className="hidden sm:block">Nuevo Equipo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Equipo</DialogTitle>
          <DialogDescription>
            Registra un nuevo equipo para el club.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nombre del equipo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe brevemente el equipo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="URL de la foto o nombre de archivo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="club_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      readOnly
                      value={clubData?.id || ""}
                      placeholder="ID del club"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liga_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liga</FormLabel>
                  <FormControl>
                    <ComboboxLigas
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capitan_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capitán</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ID del capitán"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcapitan_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcapitán</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ID del subcapitán"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
