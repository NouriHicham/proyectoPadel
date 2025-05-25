import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePersona } from "@/lib/database";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Trophy } from "lucide-react";
import { useState } from "react";
// subir imágenes
import { uploadImageToBucket } from "@/supabase/supabase";

export default function Perfil() {
  const user = JSON.parse(localStorage.getItem("user")).persona[0];

  const [formData, setFormData] = useState({
    nombre: user.nombre || "",
    apellido: user.apellido || "",
    email: user.email || "",
    telefono: user.telefono || "",
    posicion: user.posicion || "",
    disponibilidad: user.disponibilidad || "",
    foto: user.foto || "",
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Manejar cambio de archivo de foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFotoFile(file);
    if (file) {
      // Mostrar preview local
      setFormData((prev) => ({
        ...prev,
        foto: URL.createObjectURL(file),
      }));
    }
  };

  const handleUpdate = async () => {
    let fotoUrl = formData.foto;
    if (fotoFile) {
      setUploading(true);
      // Subir la imagen al bucket "images"
      const ext = fotoFile.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const url = await uploadImageToBucket(fotoFile, path);
      if (url) {
        fotoUrl = url;
      }
      setUploading(false);
    }
    const datos = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      posicion: formData.posicion,
      disponibilidad: formData.disponibilidad,
      foto: fotoUrl,
    };

    await updatePersona(user.id, datos);
    // Opcional: recargar la página o actualizar localStorage
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 items-center mx-auto">
        <h1 className="text-3xl font-bold mb-6 px-6">Mi Perfil</h1>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Foto de perfil */}
                <div className="space-y-2 flex flex-col items-center">
                  <Label>Foto de perfil</Label>
                  <img
                    src={formData.foto || "/placeholder.svg?text=Foto"}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full object-cover border mb-2"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Apellido"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Teléfono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posicion">Posición preferida</Label>
                  <Select
                    value={formData.posicion}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, posicion: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu posición preferida" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Drive">Drive</SelectItem>
                      <SelectItem value="Revés">Revés</SelectItem>
                      <SelectItem value="Ambas">Ambas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disponibilidad">Disponibilidad</Label>
                  <Select
                    value={formData.disponibilidad}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        disponibilidad: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fines de semana">
                        Fines de semana
                      </SelectItem>
                      <SelectItem value="Tardes">Tardes</SelectItem>
                      <SelectItem value="Mañanas">Mañanas</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full"
                  onClick={handleUpdate}
                  disabled={uploading}
                >
                  {uploading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Trophy className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Victorias</p>
                      <p className="text-2xl font-bold">15</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Partidos Jugados</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Ratio Victoria</p>
                    <p className="text-2xl font-bold">65%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
