import { supabase } from "@/supabase/supabase";

// Función para obtener los equipos de un usuario
export async function getEquiposUsuario(userId) {
  try {
    const { data, error } = await supabase
      .from('equipos_personas')
      .select('*, equipos(capitan_id, subcapitan_id)')
      .eq('persona_id', userId)

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al obtener equipos:', error.message)
    return []
  }
}

// Función para crear un nuevo equipo
export async function crearEquipo(equipo) {
   try {
      const { data, error } = await supabase
         .from('equipos')
         .insert([equipo])
         .single()

      if (error) throw error

      return data
   } catch (error) {
      console.error('Error al crear equipo:', error.message)
      return null
   }
}

// Función para actualizar un equipo
export async function actualizarEquipo(equipoId, actualizaciones) {
  try {
    const { data, error } = await supabase
      .from('equipos')
      .update(actualizaciones)
      .eq('id', equipoId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error al actualizar equipo:', error.message)
    return null
  }
}

// Función para eliminar un equipo
export async function eliminarEquipo(equipoId) {
  try {
    const { error } = await supabase
      .from('equipos')
      .delete()
      .eq('id', equipoId)

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error al eliminar equipo:', error.message)
    return false
  }
}
//función para leer perfiles
export const leerPersonas = async ()=>{
  try {
    let { data, error } = await supabase
  .from('personas')
  .select('*')

  if (error) {
     throw error;
  }

  console.log('personas', data);
  return data;

  } catch (error) {
    console.error('Error al leer personas:', error);
    return [];
  }
}
