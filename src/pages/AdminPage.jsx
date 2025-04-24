import CardEquipo from "@/components/CardEquipo";
import { getClub } from "@/lib/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminPage() {
  const { id } = useParams();

  const [clubData, setClubData] = useState([]);
  useEffect(() => {
    const getClubData = async (id) => {
      try {
        console.log(id);
        if (!id) return;

        const [club] = await getClub(id);
        setClubData(club);
      } catch (error) {
        console.error(error);
      }
    };

    getClubData(id);
  }, []);

//   console.log(clubData);
  return (
    <div className="container mx-auto p-2 my-4">
      <h1 className="text-4xl"> Club #{id}</h1>

      <div className="flex items-center gap-3 flex-wrap mt-5">
        {clubData?.equipos?.length !== 0 ? (
            clubData?.equipos?.map((equipo) => 
                <CardEquipo key={equipo.id} equipo={equipo}/>
            )
        ): (
            <p>No hay equipos asociados a este club.</p>
        )}
        </div>
    </div>
  );
}
