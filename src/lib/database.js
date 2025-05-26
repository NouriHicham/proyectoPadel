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
export async function getEquiposPorLiga(liga_id) {
  try {
    const { data, error } = await supabase
      .from("equipos")
      .select("*")
      .eq("liga_id", liga_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener equipos:", error.message);
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
    // Obtener la persona por id
    const { data: personaData, error: personaError } = await supabase
      .from("personas")
      .select("*")
      .eq("id", id)
      .single();

    if (personaError) throw personaError;

    // Buscar partidos_pistas donde el jugador esté en cualquiera de las 4 columnas
    const { data: partidosPistas, error: pistasError } = await supabase
      .from("partidos_pistas")
      .select("*")
      .or(
        `pareja_1_jugador_1_id.eq.${id},pareja_1_jugador_2_id.eq.${id},pareja_2_jugador_1_id.eq.${id},pareja_2_jugador_2_id.eq.${id}`
      );

    if (pistasError) throw pistasError;

    // Puedes devolver ambos datos juntos
    return [{ ...personaData, partidos_pistas: partidosPistas }];
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

// export const aceptarcion = async (personaId, equipoId, aceptado) => {
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
      .select()
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
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al insertar sede:", error.message);
    return null;
  }
}
export async function insertarLiga(liga) {
  try {
    const { data, error } = await supabase
      .from("ligas")
      .insert([liga])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al insertar liga:", error.message);
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
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al actualizar la persona:", error.message);
    return null;
  }
}
export async function updateLigas(id, datos) {
  try {
    const { data, error } = await supabase
      .from("ligas")
      .update(datos)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al actualizar la liga:", error.message);
    return null;
  }
}
export async function updateSedes(id, datos) {
  try {
    const { data, error } = await supabase
      .from("sedes")
      .update(datos)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al actualizar la sede:", error.message);
    return null;
  }
}

//funciones sin probar
// Función para crear un nuevo equipo
// export async function crearEquipo(equipo) {
//   try {
//     const { data, error } = await supabase
//       .from("equipos")
//       .insert([equipo])
//       .single();

//     if (error) throw error;

//     return data;
//   } catch (error) {
//     console.error("Error al crear equipo:", error.message);
//     return null;
//   }
// }
export async function crearEquipo(equipo) {
  try {
    // 1. Insertar el equipo y obtener todos los campos, incluido el id generado
    const { data, error } = await supabase
      .from("equipos")
      .insert([equipo])
      .select("*")
      .single();

    if (error) throw error;

    // 2. Función auxiliar para crear o actualizar la relación
    async function crearOActualizarRelacion(persona_id) {
      if (!persona_id) return;

      // Buscar si ya existe la relación
      const { data: relacion, error: fetchError } = await supabase
        .from("equipos_personas")
        .select("id")
        .eq("equipo_id", data.id)
        .eq("persona_id", persona_id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (relacion) {
        // Si existe, actualizar el estado a "aceptado"
        const { error: updateError } = await supabase
          .from("equipos_personas")
          .update({ estado: "aceptado" })
          .eq("id", relacion.id);
        if (updateError) throw updateError;
      } else {
        // Si no existe, insertar
        const { error: insertError } = await supabase
          .from("equipos_personas")
          .insert([{ equipo_id: data.id, persona_id, estado: "aceptado" }]);
        if (insertError) throw insertError;
      }
    }

    // 3. Capitán
    await crearOActualizarRelacion(equipo.capitan_id);

    // 4. Subcapitán (si es distinto)
    if (equipo.subcapitan_id && equipo.subcapitan_id !== equipo.capitan_id) {
      await crearOActualizarRelacion(equipo.subcapitan_id);
    }

    return data;
  } catch (error) {
    console.error("Error al crear equipo:", error.message);
    return null;
  }
}

// Función para actualizar un equipo
// export async function actualizarEquipo(equipoId, actualizaciones) {
//   try {
//     const { data, error } = await supabase
//       .from("equipos")
//       .update(actualizaciones)
//       .eq("id", equipoId)
//       .single();

//     // comprobar antes si en equipos_persona existe el registro con equipo id, personaid y estado

//     // hay que actualizar el estado a "aceptado" si es necesario
//     const { data: persona, error: persona_error } = await supabase
//       .from("equipos_personas")
//       .update({ estado: "aceptado" })
//       .eq("equipo_id", data?.id)
//       .eq("persona_id", data?.capitan_id)
//       .single();

//     if (error) throw error;

//     return data;
//   } catch (error) {
//     console.error("Error al actualizar equipo:", error.message);
//     return null;
//   }
// }

export async function actualizarEquipo(equipoId, actualizaciones) {
  try {
    // 1. Actualizar el equipo
    const { data, error } = await supabase
      .from("equipos")
      .update(actualizaciones)
      .eq("id", equipoId)
      .select("*")
      .single();

    if (error) throw error;

    // 2. Función auxiliar para actualizar o crear la relación
    async function crearOActualizarRelacion(persona_id) {
      if (!persona_id) return;

      // Buscar si ya existe la relación
      const { data: relacion, error: fetchError } = await supabase
        .from("equipos_personas")
        .select("id")
        .eq("equipo_id", equipoId)
        .eq("persona_id", persona_id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (relacion) {
        // Si existe, actualizar el estado a "aceptado"
        const { error: updateError } = await supabase
          .from("equipos_personas")
          .update({ estado: "aceptado" })
          .eq("id", relacion.id);
        if (updateError) throw updateError;
      } else {
        // Si no existe, insertar
        const { error: insertError } = await supabase
          .from("equipos_personas")
          .insert([{ equipo_id: equipoId, persona_id, estado: "aceptado" }]);
        if (insertError) throw insertError;
      }
    }

    // 3. Capitán
    const capitanId = actualizaciones.capitan_id || data.capitan_id;
    await crearOActualizarRelacion(capitanId);

    // 4. Subcapitán (si es distinto)
    const subcapitanId = actualizaciones.subcapitan_id || data.subcapitan_id;
    if (subcapitanId && subcapitanId !== capitanId) {
      await crearOActualizarRelacion(subcapitanId);
    }

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
export async function eliminarLiga(liga_id) {
  try {
    const { error } = await supabase.from("ligas").delete().eq("id", liga_id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error al eliminar la liga:", error.message);
    return false;
  }
}
export async function eliminarSede(sede_id) {
  try {
    const { error } = await supabase.from("sedes").delete().eq("id", sede_id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error al eliminar la sede:", error.message);
    return false;
  }
}
// eliminar jugador de un equipo
export async function eliminarJugadorEquipo(jugadorId, equipoId) {
  try {
    const { error } = await supabase
      .from("equipos_personas")
      .delete()
      .eq("equipo_id", equipoId)
      .eq("persona_id", jugadorId);

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

// export async function getJugadoresClub(club_id) {
//   try {
//     const { data, error } = await supabase
//       .from("personas")
//       .select("*")
//       .eq("club_id", club_id);

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }
export async function getJugadoresClub(club_id) {
  try {
    const { data, error } = await supabase
      .from("equipos_personas")
      .select(
        `
        *,
        equipos(*),
        personas(*)
      `
      )
      .eq("estado", "aceptado")
      .eq("equipos.club_id", club_id);

    if (error) throw error;

    const filtered = (data ?? []).filter(
      (solicitud) => solicitud.equipos && solicitud.equipos.club_id === club_id
    );
    return filtered;
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
      .eq("equipo_id", equipo_id)
      .eq("estado", "aceptado");

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

// obtener todos los registros con estado 'solicitado' y datos del equipo, (fk, equipo_id), y datos de la persona fk (persona_id)

export async function getSolicitudesClub(clubId) {
  try {
    const { data, error } = await supabase
      .from("equipos_personas")
      .select(
        `
          *,
          equipos (*),
          personas (*)
        `
      )
      .eq("estado", "solicitado");

    if (error) throw error;
    // Filtrar en el cliente por clubId en el objeto equipos
    const filtered = (data ?? []).filter(
      (solicitud) => solicitud.equipos && solicitud.equipos.club_id === clubId
    );

    return filtered;
  } catch (error) {
    console.error("Error al obtener solicitudes del club:", error.message);
    return [];
  }
}

// export async function getSolicitudesClub(clubId) {
//   try {
//     const { data, error } = await supabase
//       .from("equipos_personas")
//       .select(
//         `
//           *,
//           equipos (*),
//           personas (*)
//         `
//       )
//       .eq("estado", "solicitado");

//     if (error) throw error;

//     // Filtrar en el cliente por clubId en el objeto equipos
//     const filtered = (data ?? []).filter(
//       (solicitud) => solicitud.equipos && solicitud.equipos.club_id === clubId
//     );

//     return filtered;

export async function getResultados(id) {
  try {
    const { data, error } = await supabase
      .from("partidos")
      .select("id, partidos_pistas(*)")
      .eq("id", id)
      .eq("estado", "finalizado");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPartidosPorClub(clubId) {
  try {
    // 1. Obtener equipos del club
    const { data: equipos, error: errorEquipos } = await supabase
      .from("equipos")
      .select("id")
      .eq("club_id", clubId);

    if (errorEquipos) throw errorEquipos;
    const equiposDelClub = equipos.map((e) => e.id);

    // 2. Obtener partidos relacionados con el club (equipo1 o equipo2)
    const { data: partidos, error: errorPartidos } = await supabase
      .from("partidos")
      .select(
        `
        id,
        fecha,
        estado,
        liga:ligas(*),
        sede:sedes(*),
        equipo1:equipos!partidos_equipo1_id_fkey(*),
        equipo2:equipos!partidos_equipo2_id_fkey(*),
        partidos_pistas(*)
      `
      )
      .or(
        `equipo1_id.in.(${equiposDelClub.join(
          ","
        )}),equipo2_id.in.(${equiposDelClub.join(",")})`
      )
      .order("fecha", { ascending: false });

    if (errorPartidos) throw errorPartidos;

    // añadir datos de las personas de las pistas, de forma manual

    // 3. Recopilar todos los IDs de personas de las pistas
    const personasIds = [];
    partidos.forEach((partido) => {
      partido.partidos_pistas.forEach((pista) => {
        [
          pista.pareja_1_jugador_1_id,
          pista.pareja_1_jugador_2_id,
          pista.pareja_2_jugador_1_id,
          pista.pareja_2_jugador_2_id,
        ].forEach((id) => {
          if (id && !personasIds.includes(id)) personasIds.push(id);
        });
      });
    });

    // 4. Obtener los datos de las personas
    let personasMap = {};
    if (personasIds.length) {
      const { data: personas, error: errorPersonas } = await supabase
        .from("personas")
        .select("*")
        .in("id", personasIds);

      if (errorPersonas) throw errorPersonas;
      personasMap = Object.fromEntries(personas.map((p) => [p.id, p]));
    }

    // 5. Asignar los datos de persona a cada posición de la pista
    partidos.forEach((partido) => {
      partido.partidos_pistas.forEach((pista) => {
        pista.pareja_1_jugador_1 =
          personasMap[pista.pareja_1_jugador_1_id] || null;
        pista.pareja_1_jugador_2 =
          personasMap[pista.pareja_1_jugador_2_id] || null;
        pista.pareja_2_jugador_1 =
          personasMap[pista.pareja_2_jugador_1_id] || null;
        pista.pareja_2_jugador_2 =
          personasMap[pista.pareja_2_jugador_2_id] || null;
      });
    });

    // 6. Calcular el resumen
    const total = partidos.length;
    const finalizados = partidos.filter(
      (p) => p.estado === "finalizado"
    ).length;
    const programados = partidos.filter(
      (p) => p.estado === "programado"
    ).length;
    const enJuego = partidos.filter((p) => p.estado === "en juego").length;

    const resumen = {
      total_partidos: total,
      partidos_finalizados: finalizados,
      partidos_programados: programados,
      partidos_enJuego: enJuego,
    };

    // 7. Devolver ambos resultados juntos
    return {
      resumen,
      partidos,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function insertarPistas(partido_id) {
  try {
    const inserts = [1, 2, 3].map((num) => ({
      partido_id,
      pista_numero: num,
      pareja_1_jugador_1_id: null,
      pareja_1_jugador_2_id: null,
      pareja_2_jugador_1_id: null,
      pareja_2_jugador_2_id: null,
      resultados: null,
      duracion: null,
    }));

    const { data, error } = await supabase
      .from("partidos_pistas")
      .insert(inserts)
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al insertar pistas:", error.message);
  }
}
// Obtener todas las skills creadas por un capitán
export async function getSkillsByCapitan(capitan_id) {
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("capitan_id", capitan_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener skills del capitán:", error.message);
    return [];
  }
}

// Obtener todos los comentarios de skills para un jugador
export async function getComentariosSkillByJugador(jugador_id) {
  try {
    const { data, error } = await supabase
      .from("comentario_skill")
      .select("*")
      .eq("jugador_id", jugador_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener comentarios de skills:", error.message);
    return [];
  }
}

// Añadir una nueva skill (solo para el capitán)
export async function addSkill({ capitan_id, nombre, descripcion }) {
  try {
    const { data, error } = await supabase
      .from("skills")
      .insert([{ capitan_id, nombre, descripcion }])
      .select("*")
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al añadir skill:", error.message);
    return null;
  }
}

// Añadir o actualizar comentario de skill para un jugador
export async function addComentarioSkill({ skill, jugador_id, comentario }) {
  try {
    // upsert por skill y jugador_id
    const { data, error } = await supabase
      .from("comentario_skill")
      .upsert([{ skill, jugador_id, comentario }], {
        onConflict: "skill,jugador_id",
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al añadir comentario de skill:", error.message);
    return null;
  }
}
