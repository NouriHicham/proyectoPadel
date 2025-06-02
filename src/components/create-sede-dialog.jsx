"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { insertarSede, updateSedes } from "@/lib/database";
import toast from "react-hot-toast";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  ubicacion: z.string().min(1, "La ubicación es requerida."),
  numpistas: z.number().int().min(1, "Debe haber al menos 1 pista."),
  tipo: z.enum(["indoor", "outdoor"], "El tipo es requerido."),
});

export function CreateSedeDialog({
  isEditing = false,
  sedeEditing = null,
  fetchSedes = () => {},
}) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      ubicacion: "",
      numpistas: 2,
      tipo: "indoor",
    },
  });

  // Reset form values when editing or creating
  useEffect(() => {
    if (sedeEditing) {
      form.reset({
        nombre: sedeEditing.nombre,
        ubicacion: sedeEditing.ubicacion,
        numpistas: sedeEditing.numpistas,
        tipo: sedeEditing.tipo,
      });
    } else {
      form.reset({
        nombre: "",
        ubicacion: "",
        numpistas: "",
        tipo: "",
      });
    }
  }, [sedeEditing, form]);

  const onSubmit = async (values) => {
    try {
      if (sedeEditing) {
        const success = await updateSedes(sedeEditing?.id, values);
        if (success) {
          fetchSedes();
          toast.success("Sede actualizada correctamente");
        }
      } else {
        const success = await insertarSede(values);
        if (success) {
          fetchSedes();
          toast.success("Sede creada correctamente");
        }
      }
    } catch (error) {
      console.error(("Error al crear o actualizar la sede: ", error));
      toast.error("Error al crear o actualizar la sede");
    }
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            "rounded-full size-8 sm:rounded-md sm:h-auto sm:w-auto mr-2"
          }
        >
          <Plus />
          <span className="hidden sm:block">
            {isEditing ? "Editar" : "Nueva sede"}
          </span>
          
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar sede" : "Crear sede"}</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de la nueva sede.
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
                    <Input {...field} placeholder="Nombre de la sede" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ubicación de la sede" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numpistas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Pistas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Número de pistas"
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
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
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
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
              <Button type="submit">
                {sedeEditing ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
