import { supabase } from "@/supabase/supabase";

// Función para obtener los equipos de un usuario
export async function getEquiposUsuario(userId) {
  try {
    const { data, error } = await supabase
      .from("equipos_personas")
      .select("*, equipos(capitan_id, subcapitan_id)")
      .eq("persona_id", userId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al obtener equipos:", error.message);
    return [];
  }
}

export async function getEquipos(id) {
  try {
    const { data, error } = await supabase
      .from("equipos")
      .select("*")
      .eq("id", id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener equipo:", error.message);
    return null;
  }
}

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
// --> ejemplo consulta sql: SELECT * from equipos_personas ep join personas p on (ep.persona_id = p.id) where equipo_id != 12 and persona_id not in (SELECT persona_id from equipos_personas where equipo_id = 12) 
export const jugadoresDiferenteEquipo = async (equipoId) => {
  try {
    // Primero obtenemos los persona_id del equipo que queremos excluir
    const { data: excludedPersonas } = await supabase
      .from('equipos_personas')
      .select('persona_id')
      .eq('equipo_id', equipoId);
    
    // Extraemos solo los IDs
    const excludedIds = excludedPersonas.map(p => p.persona_id);

    // Luego hacemos la consulta principal
    let { data, error } = await supabase
      .from('equipos_personas')
      .select(`
        *,
        personas (*)
      `)
      .neq('equipo_id', equipoId)
      .not('persona_id', 'in', `(${excludedIds.join(',')})`);

    if (error) throw error;

    console.log("personas encontradas:", data);
    return data;
  } catch (error) {
    console.error("Error al leer personas:", error);
    return [];
  }
};

