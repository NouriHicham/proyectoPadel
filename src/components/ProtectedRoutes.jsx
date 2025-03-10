import { useAuth } from "@/context/AuthContext"
import {Outlet, Navigate} from "react-router-dom"

// Si el usuario es null, redirige a /login.
const ProtectedRoutes = () => {
    const {user} = useAuth()
    return user ? <Outlet/> : <Navigate to={"/login"}/>
}

export default ProtectedRoutes