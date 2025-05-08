import { useAuth } from "@/context/AuthContext";
import { getClub, getClubs } from "@/lib/database";

export function useClubData() {
  const { clubData, setClubData, setUserClubs, user } = useAuth();

  const getClubData = async (id) => {
    try {
      console.log(clubData);
      if (!id) return;
      const [club] = await getClub(id);
      setClubData(club || {});
    } catch (error) {
      console.error(error);
    }
  };

  const getUserClubs = async () => {
    try {
      if (!user) return;

      const clubsData = await getClubs(user.persona[0].id);
      setUserClubs(clubsData);
    } catch (error) {
      console.error(error);
    }
  };

  return { clubData, setClubData, getClubData, getUserClubs };
}
