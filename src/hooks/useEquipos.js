import { useAuth } from "@/context/AuthContext";
import { getClub, getClubs, getJugadoresEquipo } from "@/lib/database";

export function useClubData() {
  const {
    clubData,
    setClubData,
    setUserClubs,
    user,
    availablePlayers,
    setAvailablePlayers,
  } = useAuth();

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

  // equipos
  const getAvailablePlayers = async (teamData) => {
    try {
      console.log("clubboff: ", teamData);
      const data = await getJugadoresEquipo(teamData?.id);
      console.log("databoff: ", data);
      setAvailablePlayers(data || []);
    } catch (error) {
      console.error(("Error fetching available players:", error));
    }
  };

  return {
    clubData,
    setClubData,
    getClubData,
    getUserClubs,
    availablePlayers,
    getAvailablePlayers,
  };
}
