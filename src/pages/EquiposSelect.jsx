import CardEquipo from "@/components/CardEquipo";


export default function EquiposSelect() {
  return (
    <div className="container mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-semibold">Mis equipos</h1>
        <p>Visualiza los equipos a los que perteneces</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((equipo) => (
          <CardEquipo key={equipo} />
        ))}
      </div>
    </div>
  );
}
