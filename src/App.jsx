import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';
// import { Header } from './components/header';
import Home from './pages/home';
import RegisterPage from './pages/register';
import PartidosPage from './pages/partidos';
import PartidoDetalles from './pages/partidoDetalles';
import EquipoPage from './pages/equipo';
import JugadorDetalles from './pages/jugadorDetalles';

function App() {

return(
  <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/partidos' element={<PartidosPage/>}/>
      <Route path='/partidos/:id' element={<PartidoDetalles/>}/>  
      <Route path='/equipo' element={<EquipoPage/>}/>
      <Route path='/equipo/jugador/:id' element={<JugadorDetalles/>}/>
    </Routes>
  </>
);
}

export default App
