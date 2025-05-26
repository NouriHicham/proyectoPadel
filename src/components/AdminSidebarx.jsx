import {
  Trophy,
  Home as HomeIcon,
  Info,
  Users,
  Calendar,
  User,
  Menu as MenuIcon,
  X as CloseIcon,
  MapIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AdminSidebar({ clubData, activeTab, setActiveTab }) {
  const [open, setOpen] = useState(false);

  // Sidebar content extraído para reutilizarlo
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className="flex items-center space-x-2"
          onClick={() => {
            setActiveTab("club");
            setOpen(false);
          }}
        >
          <Trophy className="h-6 w-6 text-primary" />
          <span>{clubData?.nombre}</span>
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => {
            setActiveTab("club");
            setOpen(false);
          }}
          className={cn(
            "flex items-center px-4 py-2 rounded-md space-x-2 transition-colors cursor-pointer w-full",
            activeTab === "club"
              ? "bg-primary text-primary-foreground"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <Info className="h-5 w-5" />
          <span>Información</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("teams");
            setOpen(false);
          }}
          className={cn(
            "flex items-center px-4 py-2 rounded-md space-x-2 transition-colors cursor-pointer w-full",
            activeTab === "teams"
              ? "bg-primary text-primary-foreground"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <Users className="h-5 w-5" />
          <span>Equipos</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("players");
            setOpen(false);
          }}
          className={cn(
            "flex items-center px-4 py-2 rounded-md space-x-2 transition-colors cursor-pointer w-full",
            activeTab === "players"
              ? "bg-primary text-primary-foreground"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <User className="h-5 w-5" />
          <span>Jugadores</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("matches");
            setOpen(false);
          }}
          className={cn(
            "flex items-center px-4 py-2 rounded-md space-x-2 transition-colors cursor-pointer w-full",
            activeTab === "matches"
              ? "bg-primary text-primary-foreground"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <Calendar className="h-5 w-5" />
          <span>Partidos</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("ligas");
            setOpen(false);
          }}
          className={cn(
            "flex items-center px-4 py-2 rounded-md space-x-2 transition-colors cursor-pointer w-full",
            activeTab === "ligas"
              ? "bg-primary text-primary-foreground"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <Trophy className="h-5 w-5" />
          <span>Ligas</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("sedes");
            setOpen(false);
          }}
          className={cn(
            "flex items-center px-4 py-2 rounded-md space-x-2 transition-colors cursor-pointer w-full",
            activeTab === "sedes"
              ? "bg-primary text-primary-foreground"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <MapIcon className="h-5 w-5" />
          <span>Sedes</span>
        </button>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Botón hamburguesa solo en móvil */}
      {!open && (
        <button
          className="lg:hidden fixed top-1 left-3 z-50 bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl border border-slate-200"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar en móvil */}
      <div className="fixed inset-0 z-40 flex pointer-events-none">
        {/* Fondo oscuro */}
        <div
          className={cn(
            "bg-black bg-opacity-50 absolute inset-0 transition-opacity duration-300",
            open ? "opacity-100 pointer-events-auto" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        {/* Sidebar */}
        <div
          className={cn(
            "w-64 bg-white h-full shadow-lg relative transform transition-transform duration-300 pointer-events-auto",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
          {sidebarContent}
        </div>
      </div>

      {/* Sidebar fijo en escritorio */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-2rem)] sticky top-4">
        {sidebarContent}
      </div>
    </>
  );
}
