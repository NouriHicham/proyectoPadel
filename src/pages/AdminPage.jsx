import AdminSidebar from "@/components/AdminSidebarx";
import CardEquipo from "@/components/CardEquipo";
import { getClub } from "@/lib/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// componentes de prueba
function ClubInfo({ clubData }) {
  return (
    <div>
      <h2 className="text-2xl mb-2">Información del club</h2>
      <pre>{JSON.stringify(clubData, null, 2)}</pre>
    </div>
  );
}
function TeamsManagement({ teams }) {
  return (
    <div>
      <h2 className="text-2xl mb-2">Equipos</h2>
      <div className="flex flex-wrap gap-3">
        {teams.map((equipo) => (
          <CardEquipo key={equipo.id} equipo={equipo} />
        ))}
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

  return (
    <div className="container mx-auto p-2 my-4 flex">
      <AdminSidebar clubData={clubData} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-4">
        <h1 className="text-4xl">Club #{id}</h1>
        <div className="mt-5">
          {activeTab === "club" && <ClubInfo clubData={clubData} />}
          {activeTab === "teams" && (
            <TeamsManagement teams={clubData.equipos || []} />
          )}
          {activeTab === "matches" && (
            <MatchesManagement matches={clubData.partidos || []} />
          )}
        </div>
      </div>
    </div>
  );
}
