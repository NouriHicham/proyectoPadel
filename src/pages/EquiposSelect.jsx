import { useState, useEffect } from 'react';
import CardEquipo from "@/components/CardEquipo";
import { getEquiposUsuario } from '@/lib/database';

export default function EquiposSelect() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState([true]);

  useEffect(() => {
    async function fetchEquipos() {
      const user = JSON.parse(localStorage.getItem('user'));

      if (user !== null) {
        const equiposData = await getEquiposUsuario(user.persona[0].id);
        setEquipos(equiposData);
      }
      setLoading(false);
    }

    fetchEquipos();
  }, []);

  console.log(equipos);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-semibold">Mis equipos</h1>
        <p>Visualiza los equipos a los que perteneces</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {equipos.map((equipo) => (
          <CardEquipo key={equipo.id} equipo={equipo} />
        ))}
      </div>
    </div>
  );
}

