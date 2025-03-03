import { useEffect, useState } from 'react'
import './App.css'
import {leerPersonas} from './supabase/supabase'
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';
// import { Header } from './components/header';
import Home from './pages/home';
import RegisterPage from './pages/register';

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
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
    </Routes>
  </>
);
}

export default App
