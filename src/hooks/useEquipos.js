import { useAuth } from "@/context/AuthContext";
import { getClub } from "@/lib/database";

export function useClubData() {
  const { clubData, setClubData } = useAuth();

  const getClubData = async (id) => {
    try {
       console.log(clubData) 
      if (!id) return;
      const [club] = await getClub(id);
      setClubData(club || {});
    } catch (error) {
      console.error(error);
    }
  };

  return { clubData, setClubData, getClubData };
}
