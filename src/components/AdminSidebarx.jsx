import { Trophy, Home as HomeIcon, Info, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; 

export default function AdminSidebar({ clubData, activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button className="flex items-center space-x-2" onClick={() => setActiveTab("club")}>
            <Trophy className="h-6 w-6 text-primary" />
            <span>{clubData?.nombre}</span>
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("club")}
            className={cn(
              "flex items-center px-4 py-2 rounded-md space-x-2 transition-colors cursor-pointer",
              activeTab === "club"
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <Info className="h-5 w-5" />
            <span>Información</span>
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={cn(
              "flex items-center px-4 py-2 rounded-md space-x-2 transition-colors cursor-pointer",
              activeTab === "teams"
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <Users className="h-5 w-5" />
            <span>Equipos</span>
          </button>
          <button
            onClick={() => setActiveTab("matches")}
            className={cn(
              "flex items-center px-4 py-2 rounded-md space-x-2 transition-colors cursor-pointer",
              activeTab === "matches"
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <Calendar className="h-5 w-5" />
            <span>Partidos</span>
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
    </div>
  );
}
