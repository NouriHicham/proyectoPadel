import { Home, Calendar, Users2, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

export function MainNav({ className, ...props }) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <Home className="h-4 w-4 lg:hidden" />
        <span className="hidden lg:block">Inicio</span>
      </Link>
      <Link to="/partidos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <Calendar className="h-4 w-4 lg:hidden" />
        <span className="hidden lg:block">Partidos</span>
      </Link>
      <Link to="/equipo" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <Users2 className="h-4 w-4 lg:hidden" />
        <span className="hidden lg:block">Equipo</span>
      </Link>
      {/* <Link to="/perfil" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <User className="h-4 w-4 lg:hidden" />
        <span className="hidden lg:block">Perfil</span>
      </Link>
      <Link to="/configuracion" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <Settings className="h-4 w-4 lg:hidden" />
        <span className="hidden lg:block">Configuración</span>
      </Link> */}
    </nav>
  )
}