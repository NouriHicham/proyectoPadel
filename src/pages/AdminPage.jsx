import AdminSidebar from "@/components/AdminSidebarx";
import CardEquipo from "@/components/CardEquipo";
import CreateTeamDialog from "@/components/CreateTeamDialog";
import { getClub } from "@/lib/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// componentes de prueba
function ClubInfo({ clubData }) {
  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex-shrink-0">
          {clubData.foto ? (
            <img
              src={clubData.foto}
              alt={`Logo de ${clubData.nombre}`}
              className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 border-2 border-primary shadow">
              {clubData.nombre?.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-primary mb-1">
            {clubData.nombre}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {clubData.descripcion}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2">
        <div className="flex items-center">
          <span className="font-semibold w-32">Ubicación:</span>
          <span className="text-gray-700 dark:text-gray-200">
            {clubData.ubicacion}
          </span>
        </div>
      </div>
    </div>
  );
}
function TeamsManagement({ teams , clubData}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl mb-2 font-semibold">Equipos</h2>
        <CreateTeamDialog clubData={clubData}/>
      </div>
      <div className="flex flex-wrap gap-3">
        {teams.length === 0 ? (
          <p>Todavia no hay equipos asociados a este club.</p>
        ) : (
          teams.map((equipo) => <CardEquipo key={equipo.id} equipo={equipo} />)
        )}
      </div>
    </div>
  );
}
function MatchesManagement({ matches }) {
  return (
    <div>
      <h2 className="text-2xl mb-2">Partidos</h2>
      <pre>{JSON.stringify(matches, null, 2)}</pre>
    </div>
  );
}

export default function AdminPage() {
  const { id } = useParams();
  const [clubData, setClubData] = useState({});
  const [activeTab, setActiveTab] = useState("club");

  useEffect(() => {
    const getClubData = async (id) => {
      try {
        if (!id) return;
        const [club] = await getClub(id);
        setClubData(club || {});
      } catch (error) {
        console.error(error);
      }
    };
    getClubData(id);
  }, [id]);

  console.log(clubData);

  return (
    <div className="container mx-auto p-2 my-4 flex">
      <AdminSidebar
        clubData={clubData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 ml-4">
        <h1 className="text-4xl">Club #{id}</h1>
        <div className="mt-5">
          {activeTab === "club" && <ClubInfo clubData={clubData} />}
          {activeTab === "teams" && (
            <TeamsManagement teams={clubData?.equipos || []} clubData={clubData}/>
          )}
          {activeTab === "matches" && (
            <MatchesManagement matches={clubData?.partidos || []} />
          )}
        </div>
      </div>
    </div>
  );
}
