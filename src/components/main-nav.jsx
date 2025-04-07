import { Home, Calendar, Users2, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"

export function MainNav({ className, ...props }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        to="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Home className="h-4 w-4 lg:hidden" />
        <span className="hidden lg:block">Inicio</span>
      </Link>

      <Link
        to="/partidos"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.startsWith("/partidos") ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Calendar className="h-4 w-4 lg:hidden" />
        <span className="hidden lg:block">Partidos</span>
      </Link>

      <Link
        to="/equipo"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.startsWith("/equipo") ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Users2 className="h-4 w-4 lg:hidden" />
        <span className="hidden lg:block">Equipo</span>
      </Link>

      {/* Puedes descomentar los otros links cuando los uses */}
    </nav>
  );
}
