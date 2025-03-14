import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';
// import { Header } from './components/header';
import Home from "./pages/home";
import RegisterPage from "./pages/register";
import PartidosPage from "./pages/partidos";
import PartidoDetalles from "./pages/partidoDetalles";
import EquipoPage from "./pages/equipo";
import JugadorDetalles from "./pages/jugadorDetalles";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Perfil from './pages/perfil';

/* 
  En ProtectedRoutes anidamos las rutas que nos interesa que el usuario no pueda 
  acceder si antes no se ha logueado 
*/
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

 
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/partidos" element={<PartidosPage />} />
          <Route path="/partidos/:id" element={<PartidoDetalles />} />
          <Route path="/equipo" element={<EquipoPage />} />
          <Route path="/equipo/jugador/:id" element={<JugadorDetalles />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<div> 404 | Not Found Page</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
