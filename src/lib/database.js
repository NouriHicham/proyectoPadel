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
      .select("*, sedes(*)")
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

// export const invitarPersona = async (personaId, equipoId) => {
//   try {
//     const { data, error } = await supabase.from("equipos_personas").upsert([
//       {
//         equipo_id: equipoId,
//         persona_id: personaId,
//         estado: "invitado",
//       },
//     ]);
//     if (error) throw error;
//   } catch (error) {
//     console.error("Error al invitar a la persona:", error.message);
//   }
// };
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

    return {
      success: true,
      message: "Persona invitada correctamente.",
      data,
    };
  } catch (error) {
    console.error("Error al invitar a la persona:", error.message);
    return {
      success: false,
      message: "Error al invitar a la persona.",
      error: error.message,
    };
  }
};

// export const aceptarInvitacion = async (personaId, equipoId, aceptado) => {
//   try {
//     const { data, error } = await supabase
//       .from("equipos_personas")
//       .update({ estado: aceptado })
//       .eq("persona_id", personaId)
//       .eq("equipo_id", equipoId);
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error al aceptar la invitación:", error.message);
//   }
// };

export const aceptarInvitacion = async (personaId, equipoId, estado) => {
  try {
    if (estado === "rechazado") {
      // Si el usuario rechaza la invitación, solo actualiza el estado
      const { data, error } = await supabase
        .from("equipos_personas")
        .update({ estado: "rechazado" })
        .eq("persona_id", personaId)
        .eq("equipo_id", equipoId);

      if (error) throw error;

      return {
        success: true,
        message: "Has rechazado la invitación al equipo.",
        data,
      };
    }

    // --- Lógica para aceptar la invitación ---
    // 1. Consultar club_id del usuario
    const { data: persona, error: errorPersona } = await supabase
      .from("personas")
      .select("club_id")
      .eq("id", personaId)
      .single();

    if (errorPersona) throw errorPersona;

    // 2. Consultar club_id del equipo
    const { data: equipo, error: errorEquipo } = await supabase
      .from("equipos")
      .select("club_id")
      .eq("id", equipoId)
      .single();

    if (errorEquipo) throw errorEquipo;

    // 3. Lógica de aceptación
    if (!persona.club_id) {
      // El usuario no tiene club: se le asigna el club del equipo y se acepta la invitación
      const { data: dataEquipoPersona, error: errorEquipoPersona } =
        await supabase
          .from("equipos_personas")
          .update({ estado: "aceptado" })
          .eq("persona_id", personaId)
          .eq("equipo_id", equipoId);

      if (errorEquipoPersona) throw errorEquipoPersona;

      const { error: errorUpdatePersona } = await supabase
        .from("personas")
        .update({ club_id: equipo.club_id })
        .eq("id", personaId);

      if (errorUpdatePersona) throw errorUpdatePersona;

      return {
        success: true,
        message: "Te has unido al equipo y también al club asociado.",
        data: dataEquipoPersona,
      };
    } else if (persona.club_id === equipo.club_id) {
      // El usuario ya pertenece a este club: solo se acepta la invitación
      const { data: dataEquipoPersona, error: errorEquipoPersona } =
        await supabase
          .from("equipos_personas")
          .update({ estado: "aceptado" })
          .eq("persona_id", personaId)
          .eq("equipo_id", equipoId);

      if (errorEquipoPersona) throw errorEquipoPersona;

      return {
        success: true,
        message: "Te has unido al equipo. Ya pertenecías a este club.",
        data: dataEquipoPersona,
      };
    } else {
      // El usuario pertenece a otro club: no se permite la operación
      return {
        success: false,
        message:
          "Ya perteneces a otro club. Para unirte a este equipo, el administrador debe quitarte del club actual primero.",
      };
    }
  } catch (error) {
    console.error("Error al aceptar la invitación:", error.message);
    return {
      success: false,
      message: "Ha ocurrido un error al procesar la invitación.",
      error: error.message,
    };
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

// export const solicitarUnirseEquipo = async (personaId, equipoId) => {
//   try {
//     const { data, error } = await supabase
//       .from("equipos_personas")
//       .upsert([
//         {
//           equipo_id: equipoId,
//           persona_id: personaId,
//           estado: "solicitado",
//         },
//       ])
//       .select();
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Error al invitar a la persona:", error.message);
//   }
// };

export const solicitarUnirseEquipo = async (personaId, equipoId) => {
  try {
    // 1. Obtener club_id de la persona
    const { data: persona, error: errorPersona } = await supabase
      .from("personas")
      .select("club_id")
      .eq("id", personaId)
      .single();
    if (errorPersona) throw errorPersona;

    // 2. Obtener club_id del equipo
    const { data: equipo, error: errorEquipo } = await supabase
      .from("equipos")
      .select("club_id")
      .eq("id", equipoId)
      .single();
    if (errorEquipo) throw errorEquipo;

    // 3. Lógica de validación
    if (!persona.club_id || persona.club_id === equipo.club_id) {
      // Puede solicitar unirse
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
      return {
        success: true,
        message: "Solicitud enviada correctamente.",
        data,
      };
    } else {
      // No puede solicitar unirse
      return {
        success: false,
        message:
          "Debes desvincularte de tu club actual antes de solicitar unirte a este equipo. Habla con el administrador de tu club.",
      };
    }
  } catch (error) {
    console.error("Error al solicitar unirse al equipo:", error.message);
    return {
      success: false,
      message: "Ha ocurrido un error al solicitar unirse al equipo.",
      error: error.message,
    };
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

export async function getPartidos(id) {
  try {
    const { data, error } = await supabase
      .from("partidos")
      .select("*, equipo1_id(*), equipo2_id(*), sedes(*)")
      .eq("id", id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getJugadoresEquipo(equipo_id) {
  try {
    const { data, error } = await supabase
      .from("equipos_personas")
      .select("persona:persona_id(*)")
      .eq("equipo_id", equipo_id);

    if (error) throw error;

    // Si solo quieres el array de personas:
    return data.map((row) => row.persona);
  } catch (error) {
    console.error("Error al obtener jugadores del equipo:", error.message);
    return null;
  }
}

export async function getDisponibilidad(id) {
  try {
    const { data, error } = await supabase
      .from("disponibilidad_partidos")
      .select("*, persona_id(*)")
      .eq("partido_id", id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addDisponibilidad(persona_id, partido_id) {
  try {
    const { data, error } = await supabase
      .from("disponibilidad_partidos")
      .insert([
        {
          persona_id: persona_id,
          partido_id: partido_id,
          disponible: true,
          convocado: false,
        },
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
