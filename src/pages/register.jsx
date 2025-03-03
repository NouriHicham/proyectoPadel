import { Trophy } from "lucide-react"
import { RegisterForm } from "../components/register-form"
import { Link } from "react-router-dom"

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border rounded shadow-xl flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Trophy className="size-4" />
              </div>
              Proyecto Padel
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}
