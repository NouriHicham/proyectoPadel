# Proyecto Padel

## Escenario del proyecto - PadelDAW224

El proyecto 'Proyecto Padel' es una aplicación web destinada a facilitar la organización de partidos entre jugadores de pádel. A través de esta plataforma, los usuarios podrán registrarse, crear partidos, gestionar su disponibilidad y coordinar encuentros de manera eficiente.

El sistema permitirá a los jugadores organizar partidos según su disponibilidad, invitando a otros usuarios registrados o buscando compañeros de juego. Además, se incluirá un sistema de gestión de equipos, donde los usuarios podrán formar grupos recurrentes para participar en encuentros organizados.

Hasta ahora, la organización de partidos y la coordinación entre jugadores se realizaba mediante aplicaciones de mensajería y hojas de cálculo compartidas. Sin embargo, este proceso suele ser poco eficiente y generar confusión entre los participantes. Con esta nueva aplicación, se busca centralizar la gestión de los partidos en una plataforma intuitiva y fácil de usar.

## Casos de uso

![alt text](diagramacasosdeuso.png)

## Fases de desarrollo 

1. **Definición del proyecto y requisitos básicos**

2. **Definición de las versiones**: Una vez conocemos los requisitos del proyecto, dividiremos el trabajo en diferentes versiones, de manera que todas ellas serán operativas, aunque cada una ampliando las funcionalidades.

3. **Planificación del proyecto**: Basandonos en la metodología Agile devidiremos todo el proceso en diferentes historias/tareas (para cada una de las versiones definidas) que: agruparemos y temporizaremos.

4. **Diseño de la interficie**: Basandonos en el diseño centrado en el usuario (DCU):
   - Realizaremos un Benchmarking de otras aplicaciones de gestión de equipos.
   - Diseñaremos los prototipos de bajo nivel(bocetos, wireframes).
   - Diseñaremos el mockup.
   - Haremos pruebas de usabilidad y rediseñaremos los prototipos si es necesario.

5. **Programación del frontend (html/css/js/jsx)**: Maquetaremos los prototipos (html/css) y diseñaremos la lógica de validación de cliente.

6. **Programación del backend**: Utilizaremos un backend como servicio (SUPABASE) para:
   - Crear las bases de datos
   - Diseñar consultas sql y funciones postgres
   - Programaremos un ORM en javascript para el mapping de la bd.

7. **Integración de frontend y backend en la aplicación**:
   - Programaremos la SPA a partir de los prototipos
   - Programaremos la lógica de acceso a la bd empleando el ORM
   - Programaremos el resto de funcionalidades (sesiones y roles de acceso, etc)

8. **Analisis usabilidad II**: Haremos pruebas de usabilidad (test de usuarios) y solucionaremos los posibles conflictos detectados.

9. **Testing y despliegue en producción**:
   - Diseñaremos un sistema de testing para crear tests unitarios
   - Configuraremos un entorno DevOps para trabajar con Integración continua y despliegue continuo (CI/CD)
   - Desplegaremos en producción cada una de las versiones

## Versiones
Vamos a dividir el desarrollo del proyecto en diferentes versiones a partir de las funcionalidades que podrá realizar:
- VERSIÓN 1.0:
Implementación de la creación de equipos y sus jugadores. 
- VERSIÓN 2.0:
Implementación de la creación de partidos.
- VERSIÓN 3.0:
Implementación del sistema de skill para los jugadores
