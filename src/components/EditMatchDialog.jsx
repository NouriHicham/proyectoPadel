import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getLigas,
  getSedes,
  getEquiposPorLiga,
  actualizarPartido,
  //   actualizarPartido,
} from "@/lib/database"; // adapta esta importación a tu proyecto

const formSchema = z.object({
  datetime: z.date({ required_error: "La fecha y hora son requeridas." }),
  sede: z.string().min(1, "La sede es requerida."),
  liga: z.string().min(1, "La liga es requerida."),
  equipoLocal: z.string().min(1, "El equipo local es requerido."),
  equipoVisitante: z.string().min(1, "El equipo visitante es requerido."),
  estado: z.string().min(1, "El estado es requerido."),
});

const ESTADOS = [
  { value: "programado", label: "Programado" },
  { value: "en juego", label: "En juego" },
  { value: "finalizado", label: "Finalizado" },
];

export function EditMatchDialog({ partido, onSave = null }) {
  const [open, setOpen] = useState(false);

  //   const handleUpdateMatch = async () => {

  //   }
  console.log("partido:", partido);

  // Estado para selects
  const [sedes, setSedes] = useState([]);
  const [ligas, setLigas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [ligaSeleccionada, setLigaSeleccionada] = useState(
    partido?.liga?.id?.toString() || ""
  );

  // Cargar ligas y sedes al montar
  useEffect(() => {
    async function fetchInit() {
      try {
        const sedeData = await getSedes();
        setSedes(sedeData || []);
        const ligasData = await getLigas();
        setLigas(ligasData || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchInit();
  }, []);

  // Cargar equipos al cambiar la liga seleccionada
  useEffect(() => {
    async function fetchEquipos() {
      if (ligaSeleccionada) {
        const equiposData = await getEquiposPorLiga(ligaSeleccionada);
        setEquipos(equiposData || []);
      } else {
        setEquipos([]);
      }
    }
    fetchEquipos();
  }, [ligaSeleccionada]);

  // Formulario
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datetime: partido ? new Date(partido.fecha) : null,
      sede: partido?.sede?.id?.toString() || "",
      liga: partido?.liga?.id?.toString() || "",
      equipoLocal: partido?.equipo1?.id?.toString() || "",
      equipoVisitante: partido?.equipo2?.id?.toString() || "",
      estado: partido?.estado || "programado",
    },
  });

  // Actualiza el formulario cuando cambia el partido recibido
  useEffect(() => {
    if (partido) {
      form.reset({
        datetime: partido.fecha ? new Date(partido.fecha) : null,
        sede: partido.sede?.id?.toString() || "",
        liga: partido.liga?.id?.toString() || "",
        equipoLocal: partido.equipo1?.id?.toString() || "",
        equipoVisitante: partido.equipo2?.id?.toString() || "",
        estado: partido.estado || "programado",
      });
      setLigaSeleccionada(partido.liga?.id?.toString() || "");
    }
  }, [partido, form]);

  // Excluye el equipo local seleccionado del select visitante
  const equipoLocalSeleccionado = form.watch("equipoLocal");
  const equiposVisitante = equipoLocalSeleccionado
    ? equipos.filter(
        (equipo) => equipo.id.toString() !== equipoLocalSeleccionado
      )
    : equipos;

  // Submit
  const onSubmit = async (values) => {
    const datos = {
      id: partido.id,
      fecha: values.datetime.toISOString(),
      sede_id: values.sede,
      liga_id: values.liga,
      equipo1_id: values.equipoLocal,
      equipo2_id: values.equipoVisitante,
      estado: values.estado,
    };
    console.log("datos:", datos);
    try {
      const res = await actualizarPartido(datos);
      if (res) {
        toast.success("¡Partido actualizado!");
        setOpen(false);
        // Si necesitas refrescar la lista de partidos, llama aquí a tu función
        // await getPartidosClub();
      } else {
        toast.error("No se pudo actualizar el partido. Intenta de nuevo.");
      }
    } catch (error) {
      toast.error("Error al actualizar el partido.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Edit />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Partido</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Fecha y hora */}
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
                      className="w-full border rounded px-3 py-2"
                      minDate={new Date()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Estado */}
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ESTADOS.map((estado) => (
                        <SelectItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            {/* Liga */}
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
            {/* Equipo Local */}
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
            {/* Equipo Visitante */}
            <FormField
              control={form.control}
              name="equipoVisitante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo Visitante</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
  );
}
