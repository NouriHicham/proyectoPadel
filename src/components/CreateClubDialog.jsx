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
import { useEffect, useState } from "react";

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { actualizarClub, crearClub } from "@/lib/database";
import { Pen } from "lucide-react";
import toast from "react-hot-toast";
import { useClubData } from "@/hooks/useEquipos";
import { uploadImageToBucket } from "@/lib/images";

const formSchema = z.object({
  nombre: z.string({
    required_error: "La fecha es requerida.",
  }),
  descripcion: z.string().min(1, "Introduce una descripción del club."),
  foto: z.any().optional(),
  ubicacion: z.string().min(1, "La ubicación es requerida."),
});

export default function CreateClubDialog({ edit = false, club = null }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { getClubData, getUserClubs } = useClubData();
  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      foto: "",
      ubicacion: "",
    },
  });

  // Cargar datos del club si es edición y el modal se abre
  useEffect(() => {
    if (edit && club && open) {
      form.reset({
        nombre: club.nombre || "",
        descripcion: club.descripcion || "",
        foto: "",
        ubicacion: club.ubicacion || "",
      });
      setPreview("");
      setFotoFile(null);
    }
    if (!open && !edit) {
      form.reset();
      setPreview("");
      setFotoFile(null);
    }
  }, [edit, club, open, form]);

  useEffect(() => {
    if (fotoFile) {
      const objectUrl = URL.createObjectURL(fotoFile);
      setPreview(objectUrl);

      // Limpiar el objeto URL al desmontar el componente
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [fotoFile]);

  async function onSubmit(values) {
    let fotoUrl = club?.foto || "";
    try {
      if (fotoFile && fotoFile instanceof File && fotoFile.size > 0) {
        const ext = fotoFile.name.split(".").pop();
        const path = `clubs/${edit && club ? club.id : Date.now()}.${ext}`;
        const url = await uploadImageToBucket(fotoFile, path);
        if (url) fotoUrl = url;
      }

      let data = {
        ...values,
        foto: fotoUrl || "",
        admin_id: user?.persona[0]?.id,
      };

      if (edit && club) {
        await actualizarClub(club?.id, data);
        toast.success("Club actualizado correctamente.");
      } else {
        await crearClub(data);
        toast.success("Club creado correctamente.");
      }

      getClubData(club?.id);
      getUserClubs();

      setOpen(false);
      form.reset();
      setFotoFile(null);
      setPreview("");
    } catch (error) {
      console.error("Error al crear el club: ", error);
      toast.error("Hubo un error al guardar el club.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {edit ? (
          <Button
            className={
              "rounded-full h-8 px-2 sm:rounded-md sm:h-auto sm:w-auto"
            }
          >
            <Pen />
            <span className="hidden sm:block">Editar</span>
          </Button>
        ) : (
          <span className="underline cursor-pointer">O crea un club</span>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{edit ? "Editar Club" : "Crear Nuevo Club"}</DialogTitle>
          <DialogDescription>
            {edit
              ? "Modifica los datos del club."
              : "Programa una nueva convocatoria para los partidos."}
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
                      placeholder="Nombre del club"
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
                      placeholder="Describe brevemente el proyecto"
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
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFotoFile(file);
                        if (file) setPreview(URL.createObjectURL(file));
                        // Opcional: field.onChange(""); // Para evitar conflicto con RHF
                      }}
                    />
                  </FormControl>
                  {(preview || (edit && club?.foto)) && (
                    <img
                      src={preview || club?.foto}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded mt-2"
                    />
                  )}
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
                    <Input
                      type="text"
                      placeholder="Introduce la ubicación"
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
              <Button type="submit">{edit ? "Actualizar" : "Guardar"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
