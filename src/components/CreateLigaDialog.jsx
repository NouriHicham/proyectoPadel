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
  DialogDescription,
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
import { uploadImageToBucket } from "@/lib/images";

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
  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState("");
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
        foto: editingLiga.foto || "",
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
      let fotoUrl = editingLiga?.foto || "";
      if (fotoFile && fotoFile instanceof File && fotoFile.size > 0) {
        const ext = fotoFile.name.split(".").pop();
        const path = `ligas/${
          editingLiga ? editingLiga.id : Date.now()
        }.${ext}`;
        const url = await uploadImageToBucket(fotoFile, path);
        if (url) fotoUrl = url;
      }
      const ligaData = { ...data, foto: fotoUrl || "" };

      if (isEditing && editingLiga) {
        await updateLigas(editingLiga.id, ligaData);
        toast.success("Liga actualizada correctamente");
      } else {
        await insertarLiga(ligaData);
        toast.success("Liga creada correctamente");
      }
      fetchLigas();
      setModalOpen(false);
      form.reset();
      setFotoFile(null);
      setPreview("");
    } catch (error) {
      toast.error("Error al crear o actualizar la liga.");
      console.error(error);
    }
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
          <DialogDescription>
            {editingLiga
              ? "Modifica los datos de la liga. Puedes cambiar el logo si lo deseas."
              : "Crea una nueva liga completando los datos y subiendo un logo."}
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
                  <FormLabel>Foto (Logo)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFotoFile(file);
                        if (file) setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </FormControl>
                  {/* Preview de la imagen */}
                  {(preview || field.value) && (
                    <img
                      src={preview || field.value}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded mt-2"
                    />
                  )}
                  {isEditing && editingLiga?.foto && !preview && (
                    <img
                      src={editingLiga.foto}
                      alt="Logo actual"
                      className="w-16 h-16 object-cover rounded mt-2"
                    />
                  )}
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
