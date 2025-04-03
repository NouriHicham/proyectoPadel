import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();

  const { login, user } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await login(email, password);
    if (error) {
      console.error("Error de inicio de sesión:", error.message);
      setFail(true);
    } else {
      console.log("Sesion iniciada:", data);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/equipos");
    }
  }, [user, navigate]);

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleLogin}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicia Sesión</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Completa los siguientes campos para iniciar sesión.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {fail && (
          <div className="text-sm text-red-600">
            Error al iniciar sesión. Verifique email y contraseña.
          </div>
        )}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        No tienes cuenta?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Registrarse
        </Link>
      </div>
    </form>
  );
}
