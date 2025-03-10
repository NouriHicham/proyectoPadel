import { createContext, useState, useContext, useEffect } from "react";
// import { supabase } from "supabase"; // Asegúrate de importar tu cliente de Supabase
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ndzzdinmqmhmexyaorac.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kenpkaW5tcW1obWV4eWFvcmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTgwNjAsImV4cCI6MjA1NTk5NDA2MH0.YoV4jqtmRrXq-ZHLxMWgHKGRIVwYNz7KRVhnkYOxYIs";
const supabase = createClient(supabaseUrl, supabaseKey);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  //hay que guardar la informacion de la tabla personas
  if (!user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  const registrar = async (email, password, name, surname, phone) => {
    // Registrar usuario en auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  
    if (authError) {
      return { error: authError.message };
    }
  
    // Insertar datos en public.personas
    const { data: personaData, error: personaError } = await supabase
      .from('personas')
      .insert([{
        user_id: authData.user.id, // ¡Clave! Vincular con auth.users
        nombre: name,
        apellido: surname,
        telefono: phone,
        email: email
      }]);
  
    if (personaError) {
      await supabase.auth.admin.deleteUser(authData.user.id); // Opcional: eliminar usuario si falla
      return { error: personaError.message };
    }
  
    return { data: personaData };
  };
  

  return (
    <AuthContext.Provider value={{ user, login, signOut, registrar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
