import { supabase } from "@/supabase/supabase";
import { addYears } from "date-fns";

// Función para obtener los equipos de un usuario
export async function getEquiposUsuario(userId) {
  try {
    const { data, error } = await supabase
      .from("equipos_personas")
      .select("*, equipos(*)")
      .eq("persona_id", userId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al obtener equipos:", error.message);
    return [];
  }
}

export async function getEquipos(id, campos = "*") {
  try {
    const { data, error } = await supabase
      .from("equipos")
      .select(campos)
      .eq("id", id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener equipo:", error.message);
    return null;
  }
}

// contar los miembros de un equipo
export async function getMiembrosEquipo(equipo_id) {
  try {
    const { count, error } = await supabase
      .from("equipos_personas")
      .select("*", { count: "exact" }) // Solo cuenta, sin traer datos
      .eq("equipo_id", equipo_id)
      .eq("estado", "aceptado");

    if (error) throw error;
    return count;
  } catch (error) {
    console.error("Error al contar miembros del equipo:", error.message);
    return 0;
  }
}

// funcion para obtener los ultimos partidos jugados
export async function getUltimosPartidosJugados(equipo_id, limit = 1) {
  try {
    const { data, error } = await supabase
      .from("partidos")
      .select("*")
      .or(`equipo1_id.eq.${equipo_id},equipo2_id.eq.${equipo_id}`)
      .eq("estado", "finalizado")
      .order("fecha", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al obtener los últimos partidos:", error.message);
    return [];
  }
}

// funcion para obtener el siguiente partido a jugar
export async function getUltimoPartidoaJugar(equipo_id, limit = 1) {
  try {
    const { data, error } = await supabase
      .from("partidos")
      .select("*, sedes(*)")
      .or(`equipo1_id.eq.${equipo_id},equipo2_id.eq.${equipo_id}`)
      .eq("estado", "programado")
      .order("fecha", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al obtener los últimos partidos:", error.message);
    return [];
  }
}

//función para leer personas de un equipo
export const leerPersonas = async (equipoId) => {
  try {
    let { data, error } = await supabase
      .from("equipos_personas")
      .select(
        `
      *,
      personas (*)
    `
      )
      .eq("equipo_id", equipoId);

    if (error) {
      throw error;
    }

    console.log("personas", data);
    return data;
  } catch (error) {
    console.error("Error al leer personas:", error);
    return [];
  }
};

export const getPerfilUsuario = async (id) => {
  try {
    // select * from personas where id = (select persona_id from equipos_personas WHERE id = id)
    const { data, error } = await supabase
      .from("equipos_personas")
      .select("persona_id")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          return supabase
            .from("personas")
            .select("*")
            .eq("id", data.persona_id);
        }
      });

    if (error) {
      throw error;
    }

    console.log("personas", data);
    return data;
  } catch (error) {
    console.error("Error al leer personas:", error);
    return [];
  }
};

// Mostrar los demás jugadores, para poder invitarlos
export const jugadoresDiferenteEquipo = async (equipoId) => {
  try {
    // Paso 1: Obtener los persona_id del equipo que queremos excluir
    const { data: excludedIds, error: excludedError } = await supabase
      .from("equipos_personas")
      .select("persona_id")
      .eq("equipo_id", equipoId);

    if (excludedError) {
      console.error("Error al obtener IDs excluidos:", excludedError.message);
      return [];
    }

    // Extraer los IDs a excluir y formatearlos correctamente
    const idsToExclude = excludedIds.map((item) => item.persona_id);

    if (idsToExclude.length === 0) {
      console.log("No hay IDs para excluir.");
      return await supabase.from("personas").select("*");
    }

    // Paso 2: Usar los IDs excluidos para filtrar en la tabla personas
    const { data, error } = await supabase
      .from("personas")
      .select("*")
      .not("id", "in", `(${idsToExclude.join(",")})`);

    if (error) {
      console.error("Error al ejecutar la consulta:", error.message);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error al leer personas:", error.message);
    return [];
  }
};

export const invitarPersona = async (personaId, equipoId) => {
  try {
    const { data, error } = await supabase.from("equipos_personas").upsert([
      {
        equipo_id: equipoId,
        persona_id: personaId,
        estado: "invitado",
      },
    ]);
    if (error) throw error;
  } catch (error) {
    console.error("Error al invitar a la persona:", error.message);
  }
};

export const aceptarInvitacion = async (personaId, equipoId, aceptado) => {
  try {
    const { data, error } = await supabase
      .from("equipos_personas")
      .update({ estado: aceptado })
      .eq("persona_id", personaId)
      .eq("equipo_id", equipoId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al aceptar la invitación:", error.message);
  }
};

// Obtener equipos a los que puedo solicitar unirme
export const obtenerEquiposDiferentes = async (personaId) => {
  try {
    const { data: equiposRelacionados, error: errorRelacionados } =
      await supabase
        .from("equipos_personas")
        .select("equipo_id")
        .eq("persona_id", personaId);

    if (errorRelacionados) {
      console.error(
        "Error obteniendo los ids de los equipos relacionados con el usuario:",
        errorRelacionados
      );
      return null;
    }

    const idsRelacionados = equiposRelacionados.map((row) => row.equipo_id);

    const { data: equiposDiferentes, error: errorDiferentes } = await supabase
      .from("equipos")
      .select("*")
      .not("id", "in", `(${idsRelacionados.join(",")})`);

    if (errorDiferentes) {
      console.error(
        "Error obteniendo los equipos a los que el usuario no pertenece:",
        errorDiferentes
      );
      return null;
    }

    return equiposDiferentes;
  } catch (error) {
    console.error("Error en obtenerEquiposDiferentes:", error.message);
    return null;
  }
};

//funcion para insertar un partido
export async function insertarPartido(partido) {
  try {
    const { data, error } = await supabase
      .from("partidos")
      .insert([partido])
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al insertar partido:", error.message);
    return null;
  }
}

//funcion para insertar sedes
export async function insertarSede(sede) {
  try {
    const { data, error } = await supabase
      .from("sedes")
      .insert([sede])
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al insertar sede:", error.message);
    return null;
  }
}

//obtener equipos que pertenezcan a una liga, exclutendote a ti mismo
export async function getEquipoPartidos(id, liga_id) {
  try {
    const { data, error } = await supabase
      .from("equipos")
      .select("*")
      .eq("liga_id", liga_id)
      .neq("id", id);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al obtener equipos para los partidos:", error.message);
    return null;
  }
}

//obtener todas las sedes
export async function getSedes() {
  try {
    const { data, error } = await supabase.from("sedes").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al obtener las sedes:", error.message);
    return null;
  }
}

export async function updatePersona(id, datos) {
  try {
    const { data, error } = await supabase
      .from("personas")
      .update(datos)
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al actualizar la persona:", error.message);
    return null;
  }
}

//funciones sin probar
// Función para crear un nuevo equipo
export async function crearEquipo(equipo) {
  try {
    const { data, error } = await supabase
      .from("equipos")
      .insert([equipo])
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al crear equipo:", error.message);
    return null;
  }
}

// Función para actualizar un equipo
export async function actualizarEquipo(equipoId, actualizaciones) {
  try {
    const { data, error } = await supabase
      .from("equipos")
      .update(actualizaciones)
      .eq("id", equipoId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al actualizar equipo:", error.message);
    return null;
  }
}

// Función para eliminar un equipo
export async function eliminarEquipo(equipoId) {
  try {
    const { error } = await supabase
      .from("equipos")
      .delete()
      .eq("id", equipoId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error al eliminar equipo:", error.message);
    return false;
  }
}

export const solicitarUnirseEquipo = async (personaId, equipoId) => {
  try {
    const { data, error } = await supabase
      .from("equipos_personas")
      .upsert([
        {
          equipo_id: equipoId,
          persona_id: personaId,
          estado: "solicitado",
        },
      ])
      .select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al invitar a la persona:", error.message);
  }
};

export async function getClubs(id_persona = null) {
  try {
    let query = supabase.from("clubs").select("*");

    // Solo filtra por admin_id si se proporciona id_persona
    if (id_persona) {
      query = query.eq("admin_id", id_persona);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener los clubes:", error.message);
    return null;
  }
}

export async function getClub(id) {
  try {
    const { data, error } = await supabase
      .from("clubs")
      .select(
        `
    *,
    equipos (
      *,
      equipos_personas (*)
    )
  `
      )
      .eq("id", id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener los clubes:", error.message);
    return null;
  }
}

// Insertar club
export async function crearClub(clubData) {
  try {
    const { data, error } = await supabase
      .from("clubs")
      .insert(clubData)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al insertar partido:", error.message);
    return null;
  }
}

export async function actualizarClub(clubId, actualizaciones) {
  try {
    const { data, error } = await supabase
      .from("clubs")
      .update(actualizaciones)
      .eq("id", clubId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al actualizar el club:", error.message);
    return null;
  }
}

export async function eliminarClub(clubId) {
  try {
    const { error } = await supabase.from("clubs").delete().eq("id", clubId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error al eliminar equipo:", error.message);
    return false;
  }
}

// ligas

export async function getLigas() {
  try {
    const { data, error } = await supabase.from("ligas").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getJugadresClub(club_id) {
  try {
    const { data, error } = await supabase
      .from("personas")
      .select("*")
      .eq("club_id", club_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
