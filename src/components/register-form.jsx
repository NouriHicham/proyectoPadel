import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function RegisterForm({ className, ...props }) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Regístrate</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Completa los siguientes campos para poder registrarte.
        </p>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="name">Nombre</Label>
        </div>
        <Input id="name" type="text" required />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="surname">Apellidos</Label>
        </div>
        <Input id="surname" type="text" required />
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="dni">DNI</Label>
          </div>
          <Input id="dni" type="text" required />
        </div>
        {/* <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="avatar">Avatar</Label>
          </div>
          <Input id="avatar" type="file"/>
        </div> */}
        <Button type="submit" className="w-full">
          Registrarse
        </Button>
      </div>
      <div className="text-center text-sm">
        Ya tienes una cuenta?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Iniciar Sesión
        </Link>
      </div>
    </form>
  );
}
