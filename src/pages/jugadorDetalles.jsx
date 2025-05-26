import { Header } from "@/components/header";

// import { Header } from "@/components/header"
// import { MobileNav } from "@/components/mobile-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEquipos, getPerfilUsuario } from "@/lib/database";
import {
  getSkillsByCapitan,
  getComentariosSkillByJugador,
  addSkill,
  addComentarioSkill,
} from "@/lib/database"; // Debes implementar estos métodos
import { Mail, Phone } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
export default function JugadorDetalles() {
  // Al cargar pagina, hacer fetch de los datos del usuario, con el id pasado por url
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [skills, setSkills] = useState([]);
  const [comentariosSkill, setComentariosSkill] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newSkillDesc, setNewSkillDesc] = useState("");
  const [newComentario, setNewComentario] = useState({});
  const [loadingSkills, setLoadingSkills] = useState(false);
  const savedInfo = JSON.parse(localStorage.getItem("personaGuardada"));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [data] = await getPerfilUsuario(id);
        const equipo = await getEquipos(
          savedInfo.equipo_id,
          "*, equipos_personas(personas(*))"
        );
        setUserData(data);
        setEquipo(equipo[0]);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [id]);
  console.log(userData);
  console.log(equipo);

  // Determinar si el usuario logueado es el capitán del equipo
  const isCapitan = equipo && savedInfo && equipo.capitan_id === savedInfo.persona_id;

  useEffect(() => {
    const fetchSkills = async () => {
      if (equipo && equipo.capitan_id) {
        setLoadingSkills(true);
        const skills = await getSkillsByCapitan(equipo.capitan_id);
        setSkills(skills || []);
        const comentarios = await getComentariosSkillByJugador(id);
        setComentariosSkill(comentarios || []);
        setLoadingSkills(false);
      }
    };
    fetchSkills();
  }, [equipo, id]);

  // Handler para crear una nueva skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill) return;
    const skill = await addSkill({
      capitan_id: equipo.capitan_id,
      nombre: newSkill,
      descripcion: newSkillDesc,
    });
    if (skill) {
      setSkills([...skills, skill]);
      setNewSkill("");
      setNewSkillDesc("");
    }
  };

  // Handler para añadir/editar comentario skill
  const handleAddComentario = async (skillId) => {
    if (!newComentario[skillId]) return;
    const comentario = await addComentarioSkill({
      skill: skillId,
      jugador_id: userData.id,
      comentario: newComentario[skillId],
    });
    // Actualizar comentarios en el estado
    setComentariosSkill((prev) => {
      const filtered = prev.filter((c) => c.skill !== skillId);
      return [...filtered, comentario];
    });
    setNewComentario((prev) => ({ ...prev, [skillId]: "" }));
  };

  // Por si queremos mostrar un cargando
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* <p>Cargando...</p> */}
        <div className="lex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-8 mb-16 lg:mb-0 mx-auto">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={userData?.foto || "/placeholder.svg?text=JP"}
                    />
                    <AvatarFallback>
                      {userData?.nombre?.[0]}
                      {userData?.apellido?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {userData?.nombre + " " + userData?.apellido}
                    </h1>
                    <p className="text-muted-foreground">
                      {/* Puedes ajustar la fecha si tienes el dato */}
                      Miembro desde 2025
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Posición: {userData?.posicion || "No especificada"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Disponibilidad:{" "}
                      {userData?.disponibilidad || "No especificada"}
                    </p>
                  </div>
                  <Button variant="outline">Editar perfil</Button>
                </div>
              </CardContent>
            </Card>

            {/* Mostrar información del equipo si existe */}
            {equipo && (
              <Card>
                <CardHeader>
                  <CardTitle>Equipo</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src={equipo.foto || "/placeholder.svg?text=EQ"}
                    />
                    <AvatarFallback>{equipo.nombre?.[0] || "E"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{equipo.nombre}</div>
                    <div className="text-sm text-muted-foreground">
                      {equipo.descripcion}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>+34 {userData?.telefono}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{userData?.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas del Jugador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Partidos Jugados
                    </p>
                    <p className="text-2xl font-bold">
                      {userData?.partidos_pistas?.length || 0}
                    </p>
                  </div>
                  {/* Puedes calcular victorias/ratio si tienes info en partidos_pistas */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Victorias</p>
                    <p className="text-2xl font-bold">
                      {/* Si tienes info de victorias, cámbialo aquí */}-
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Ratio Victoria
                    </p>
                    <p className="text-2xl font-bold">
                      {/* Si tienes info de ratio, cámbialo aquí */}-
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Derecha</p>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Revés</p>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Volea</p>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <Progress value={90} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Saque</p>
                    <span className="text-sm text-muted-foreground">80%</span>
                  </div>
                  <Progress value={80} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Tabs defaultValue="history" className={"mt-5"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" className={"cursor-pointer"}>
              Historial
            </TabsTrigger>
            <TabsTrigger value="partners" className={"cursor-pointer"}>
              Compañeros
            </TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Card>
              <CardContent className="p-4 space-y-4">
                {userData?.partidos_pistas &&
                userData.partidos_pistas.length > 0 ? (
                  userData.partidos_pistas.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          Partido #{p.partido_id} - Pista {p.pista_numero}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Duración: {p.duracion || "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {/* Puedes mostrar victoria/derrota si tienes info */}
                          {Array.isArray(p.resultados)
                            ? p.resultados.join(", ")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">
                    Sin partidos jugados
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="partners">
            <Card>
              <CardContent className="p-4 space-y-4">
                {equipo &&
                equipo.equipos_personas &&
                equipo.equipos_personas.length > 0 ? (
                  equipo.equipos_personas
                    .filter(
                      (ep) => ep.personas && ep.personas.id !== userData.id
                    )
                    .map((ep, idx) => (
                      <div
                        key={ep.personas.id || idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                ep.personas.foto || "/placeholder.svg?text=CP"
                              }
                            />
                            <AvatarFallback>
                              {ep.personas.nombre?.[0]}
                              {ep.personas.apellido?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {ep.personas.nombre} {ep.personas.apellido}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Posición: {ep.personas.posicion || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-muted-foreground">
                            {ep.personas.disponibilidad || ""}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {ep.personas.email}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-muted-foreground">No disponible</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Sección de Skills solo visible para el capitán */}
        {isCapitan && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Skills del Jugador</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSkills ? (
                <div className="text-muted-foreground">Cargando skills...</div>
              ) : (
                <>
                  {/* Formulario para crear nueva skill */}
                  <form
                    onSubmit={handleAddSkill}
                    className="mb-4 flex gap-2 flex-col"
                  >
                    <input
                      type="text"
                      placeholder="Nombre de la skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Descripción"
                      value={newSkillDesc}
                      onChange={(e) => setNewSkillDesc(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                    <Button type="submit" size="sm">
                      Añadir Skill
                    </Button>
                  </form>
                  {/* Listado de skills y comentarios */}
                  <div className="space-y-4">
                    {skills.length === 0 && (
                      <div className="text-muted-foreground">
                        No hay skills aún.
                      </div>
                    )}
                    {skills.map((skill) => (
                      <div key={skill.id} className="border rounded p-2">
                        <div className="font-semibold">{skill.nombre}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {skill.descripcion}
                        </div>
                        <div>
                          <div className="mb-1 font-medium">Comentario:</div>
                          <div className="mb-2">
                            {comentariosSkill.find((c) => c.skill === skill.id)
                              ?.comentario || (
                              <span className="text-muted-foreground">
                                Sin comentario
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Añadir/editar comentario"
                              value={newComentario[skill.id] || ""}
                              onChange={(e) =>
                                setNewComentario((prev) => ({
                                  ...prev,
                                  [skill.id]: e.target.value,
                                }))
                              }
                              className="border px-2 py-1 rounded flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddComentario(skill.id)}
                            >
                              Guardar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
