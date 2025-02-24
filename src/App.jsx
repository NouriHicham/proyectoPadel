import { useEffect, useState } from 'react'
import './App.css'
import {leerPersonas} from './supabase/supabase'

function App() {
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      const data = await leerPersonas();
      setPersonas(data);
    };

    fetchPersonas();
  }, []);

return(
  <>
    <h1>Lista de personas</h1>
    <ul>
    {personas.map((persona) => (<li key={persona.id}>{persona.nombre}</li>))}
    </ul>
  </>
);
}

export default App
