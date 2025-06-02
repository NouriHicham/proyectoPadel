import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Trophy } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"


export function Header() {
  const {signOut} = useAuth()
  const user = JSON.parse(localStorage.getItem('user')).persona[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <div className="flex items-center space-x-2 mr-4">
          <Trophy className="h-6 w-6 ml-2 sm:ml-0" />
          <span className="hidden font-bold sm:inline-block">PadelTeam</span>
        </div>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl p-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:cursor-pointer mr-2 sm:mr-0">
              <Avatar className="h-8 w-8">
                {user.foto ? 
                  <AvatarImage src={user.foto} alt="@usuario" />
                :
                  <AvatarFallback>{user.nombre.charAt(0)}</AvatarFallback>
                }
              </Avatar>
              <span className="hidden sm:block">{user.nombre} {user.apellido}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link to="/perfil">Mi Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/equipos">Cambiar equipo</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/configuracion">Configuración</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a onClick={signOut} className="text-base hover:bg-transparent hover:text-primary">Cerrar Sesión</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  )
}