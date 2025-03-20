import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Trophy } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"


export function Header() {
  const {signOut} = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <div className="flex items-center space-x-2 mr-4">
          <Trophy className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">PadelTeam</span>
        </div>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl p-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@usuario" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <span>Usuario123</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <a href="/perfil">Mi Perfil</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/equipos">Cambiar equipo</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/configuracion">Configuración</a>
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