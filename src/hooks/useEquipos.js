import { useAuth } from "@/context/AuthContext";
import {
  getClub,
  getClubs,
  getJugadoresEquipo,
  getLigas,
} from "@/lib/database";

export function useClubData() {
  const {
    clubData,
    setClubData,
    setUserClubs,
    user,
    availablePlayers,
    setAvailablePlayers,
    // setLigas,
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
      console.log("teamdata", teamData);
      const data = await getJugadoresEquipo(teamData?.id);
      console.log("data: ", data);
      setAvailablePlayers(data || []);
    } catch (error) {
      console.error(("Error fetching available players:", error));
    }
  };

  // const fetchLigas = async () => {
  //   try {
  //     const ligasData = await getLigas();
  //     setLigas(ligasData || []);
  //   } catch (error) {
  //     console.error("Error fetching ligas: ", error);
  //   }
  // };

  return {
    clubData,
    setClubData,
    getClubData,
    getUserClubs,
    availablePlayers,
    getAvailablePlayers,
  };
}
