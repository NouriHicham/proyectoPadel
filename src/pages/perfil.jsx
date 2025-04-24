import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updatePersona } from "@/lib/database"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Trophy } from "lucide-react"

export default function Perfil() {
  const user = JSON.parse(localStorage.getItem('user')).persona[0];

  const handleUpdate = async () => {
    if(!document.querySelector('#name').value){
      document.querySelector('#name').value = user.nombre
    }

    if(!document.querySelector('#apellido').value){
      document.querySelector('#apellido').value = user.apellido
    }

    if(!document.querySelector('#email').value){
      document.querySelector('#email').value = user.email
    }

    if(!document.querySelector('#telefono').value){
      document.querySelector('#telefono').value = user.telefono
    }

    if(!document.querySelector('#disponibilidad').value){
      document.querySelector('#disponibilidad').value = user.disponibilidad
    }

    if(!document.querySelector('#posicion').value){
      document.querySelector('#posicion').value = user.posicion
    }
    const datos = {
      nombre: document.getElementById("name").value,
      apellido: document.getElementById("apellido").value,
      email: document.getElementById("email").value,
      telefono: document.getElementById("telefono").value,
      posicion: document.getElementById("posicion").value,
      disponibilidad: document.getElementById("disponibilidad").value
    };

    await updatePersona(user.id, datos);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0">
        <h1 className="text-3xl font-bold mb-6 px-6">Mi Perfil</h1>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder={user.nombre} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Apellido</Label>
                  <Input id="surname" placeholder={user.apellido} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder={user.telefono} />
                </div>
                <Separator />
                <CardHeader className="px-0 mt-4 mb-[24px]">
                  <CardTitle>Preferencias de Juego</CardTitle>
                </CardHeader>
                <div className="space-y-2">
                  <Label>Posición preferida</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={user.posicion ? user.posicion : "Selecciona tu posición preferida" } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Drive">Drive</SelectItem>
                      <SelectItem value="Revés">Revés</SelectItem>
                      <SelectItem value="Ambas">Ambas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Disponibilidad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={user.disponibilidad ? user.disponibilidad : "Selecciona tu disponibilidad" } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fines de semana">Fines de semana</SelectItem>
                      <SelectItem value="Tardes">Tardes</SelectItem>
                      <SelectItem value="Mañanas">Mañanas</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleUpdate}>Guardar Cambios</Button>
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
  )
}
