import { useEffect, useState } from 'react'
import './App.css'
import {leerPersonas} from './supabase/supabase'
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Header } from './components/header';

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
  // <div className='container mx-auto p-4'>
  //   <h1>Lista de personas</h1>
  //   <ul>
  //   {personas.map((persona) => (<li key={persona.id}>{persona.nombre}</li>))}
  //   </ul>
  // </div>
  <>
    <div className="min-h-screen flex flex-col">
        <Header />
    </div>
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
    </Routes>
  </>
);
}

export default App
