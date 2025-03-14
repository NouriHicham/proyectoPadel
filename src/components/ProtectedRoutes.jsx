import { useAuth } from "@/context/AuthContext"
import {Outlet, Navigate} from "react-router-dom"

/* 
    Si el usuario es null, redirigelo a /login.
    El user se obtiene de localStorage, y se usa context para poder acceder a este desde otros archivos.

    Si el usuario está logeado entonces renderiza Outlet, lo que permite mostrar las rutas
*/
const ProtectedRoutes = () => {
    const {user} = useAuth()
    return user ? <Outlet/> : <Navigate to={"/login"}/>
}

export default ProtectedRoutes