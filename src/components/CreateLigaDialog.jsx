import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
// import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import toast from "react-hot-toast";
import { insertarLiga, updateLigas } from "@/lib/database";

const ligaFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  tipo: z.string().min(1, "El tipo es requerido."),
  foto: z.string().url("Debe ser una URL válida.").optional().or(z.literal("")),
  descripcion: z.string().min(1, "La descripción es requerida."),
});
const tiposLiga = ["masculina", "femenina", "mixta"];
export default function CreateLigaDialog({
  isEditing = false,
  editingLiga = null,
  fetchLigas = () => {},
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(ligaFormSchema),
    defaultValues: {
      nombre: "",
      tipo: "",
      foto: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    if (editingLiga) {
      form.reset({
        nombre: editingLiga.nombre,
        tipo: editingLiga.tipo,
        foto: editingLiga.foto,
        descripcion: editingLiga.descripcion,
      });
    } else {
      form.reset({
        nombre: "",
        tipo: "",
        foto: "",
        descripcion: "",
      });
    }
  }, [editingLiga, form]);

  const onSubmit = async (data) => {
    try {
      if (editingLiga) {
        const success = await updateLigas(editingLiga?.id, data);
        if (success) {
          fetchLigas();
          toast.success("Liga actualizada correctamente");
        }
      } else {
        const success = await insertarLiga(data);
        if (success) {
          fetchLigas();
          toast.success("Liga creada correctamente");
        }
      }
    } catch (error) {
      console.error(("Error al crear o actualizar la liga: ", error));
      toast.error("Error al crear o actualizar la liga.");
    }

    setModalOpen(false);
    // setEditingLiga(null);
    form.reset();
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button>{isEditing ? "Editar" : "Crear Liga"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingLiga ? "Editar Liga" : "Crear Liga"}
          </DialogTitle>
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
                    <Input placeholder="Nombre de la liga" {...field} />
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
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de liga" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposLiga.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Foto (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de la foto" {...field} />
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
                    <Textarea placeholder="Describe la liga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">
                {editingLiga ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
