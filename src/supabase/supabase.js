import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ndzzdinmqmhmexyaorac.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kenpkaW5tcW1obWV4eWFvcmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTgwNjAsImV4cCI6MjA1NTk5NDA2MH0.YoV4jqtmRrXq-ZHLxMWgHKGRIVwYNz7KRVhnkYOxYIs";
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- FUNCIONES PARA USAR EL BUCKET "images" ---

/**
 * Sube una imagen al bucket "images" en Supabase Storage.
 * @param {File} file - Archivo de imagen a subir.
 * @param {string} path - Ruta/nombre de archivo dentro del bucket (ej: "avatars/userid.jpg").
 * @returns {Promise<string|null>} - URL pública de la imagen o null si falla.
 */
export async function uploadImageToBucket(file, path) {
  const { data, error } = await supabase.storage
    .from("images")
    .upload(path, file, { upsert: true });
  if (error) {
    console.error("Error subiendo imagen:", error);
    return null;
  }
  // Obtener la URL pública
  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(path);
  return publicUrlData?.publicUrl || null;
}

/**
 * Obtiene la URL pública de una imagen en el bucket "images".
 * @param {string} path - Ruta/nombre de archivo dentro del bucket.
 * @returns {string} - URL pública.
 */
export function getImageUrl(path) {
  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data?.publicUrl || "";
}
