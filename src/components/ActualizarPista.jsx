import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { actualizarPista } from "@/lib/database";

// Esquema de validación
const formSchema = z.object({
  duracion: z
    .string()
    .regex(
      /^([0-1]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/,
      "Formato HH:MM:SS requerido"
    )
    .nullable()
    .or(z.literal("")),
  resultados: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          const arr = JSON.parse(val);
          return Array.isArray(arr) && arr.every((r) => typeof r === "string");
        } catch {
          return false;
        }
      },
      {
        message: 'Debe ser un array de strings, ejemplo: ["6-0","6-3"]',
      }
    )
    .nullable()
    .or(z.literal("")),
});

export default function ActualizarPista({ pista, onSave = null }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duracion: pista?.duracion || "",
      resultados: pista?.resultados ? JSON.stringify(pista.resultados) : "",
    },
  });

  useEffect(() => {
    if (pista) {
      form.reset({
        duracion: pista.duracion || "",
        resultados: pista.resultados ? JSON.stringify(pista.resultados) : "",
      });
    }
  }, [pista, form]);

  const normalizarDuracion = (valor) => {
    if (!valor) return null;
    if (/^\d{2}:\d{2}$/.test(valor)) return valor + ":00";
    return valor;
  };

  const onSubmit = async (values) => {
    const datos = {
      id: pista.id,
      //   duracion: values.duracion || null,
      duracion: normalizarDuracion(values.duracion),
      resultados: values.resultados ? JSON.parse(values.resultados) : null,
    };

    try {
      const success = await actualizarPista(datos);

      if (success) {
        toast.success("Pista actualizada.");
        setOpen(false);
      } else {
        toast.error("No se pudo actualizar la pista.");
      }
    } catch (error) {
      toast.error("Error al actualizar la pista.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end p-1">
        <Edit
          size={20}
          className="cursor-pointer text-blue-700"
          onClick={() => setOpen(true)}
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pista #{pista.pista_numero}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              autoComplete="off"
            >
              {/* Duración */}
              {/* <FormField
                control={form.control}
                name="duracion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (HH:MM:SS)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ej: 01:16:05"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="duracion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="time"
                        step="1" // permite segundos (HH:MM:SS)
                        placeholder="Ej: 01:16:05"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Resultados */}
              <FormField
                control={form.control}
                name="resultados"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultados</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Ej: ["6-0","6-3"]'
                        autoComplete="off"
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
                <Button type="submit">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
