import { supabase } from "@/supabase/supabase";
// --- FUNCIONES PARA USAR EL BUCKET "images" ---

export async function uploadImageToBucket(file, path) {
  try {
    if (!file || !(file instanceof File) || file.size === 0) {
      console.error("Archivo inválido para subir:", file);
      return null;
    }
    if (!path || typeof path !== "string" || path.trim() === "") {
      console.error("Path inválido para subir imagen:", path);
      return null;
    }

    const { data, error } = await supabase.storage
      .from("images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Error subiendo imagen:", error.message);
      return null;
    }

    // Obtener la URL pública después de subir correctamente
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(path);

    if (!urlData?.publicUrl) {
      console.error("No se pudo obtener la URL pública para:", path);
      return null;
    }

    console.log("URL pública generada:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (err) {
    console.error("Error subiendo imagen:", err.message || err);
    return null;
  }
}

export function getImageUrl(path) {
  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data?.publicUrl || "";
}
