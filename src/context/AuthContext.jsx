import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/supabase/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // estado del usuario, que si existe se obtiene el usuario
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Función para guardar el usuario en localStorage y actualizar el estado del usuario
  const saveUserToLocalStorage = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  useEffect(() => {
    // Obtener datos de personas al iniciar sesión
    const getUserData = async (session) => {
      if (session?.user) {
        const { data, error } = await supabase
          .from("personas")
          .select("*")
          .eq("user_id", session.user.id)

        if (error) {
          console.error("Error obteniendo datos de personas:", error);
        } else {
          const userData = { persona: data };
          saveUserToLocalStorage(userData);
        }
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      getUserData(session);
    });

    // escuchar cambios en la sesión de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      getUserData(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const {data, error} = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return { data };
  }

  const signOut = async() => {
    supabase.auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
  }

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
