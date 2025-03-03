import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import { Link } from "react-router-dom"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <div className="flex items-center space-x-2 mr-4">
          <Trophy className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">PadelTeam</span>
        </div>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" className="text-base hover:bg-transparent hover:text-primary">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}