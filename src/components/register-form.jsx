import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function RegisterForm({ className, ...props }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const { registrar } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registrar(email, password, name, surname, phone);
    
    console.log(result)
    
    if (result.success) {
      console.log("Registro exitoso:", result.data);
    } else {
      console.error("Error en el registro:", result.error);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
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
        <Input 
          id="name" 
          type="text" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="surname">Apellidos</Label>
        </div>
        <Input 
          id="surname" 
          type="text" 
          required 
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="phone">Teléfono</Label>
          </div>
          <Input 
            id="phone" 
            type="number" 
            required 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
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
