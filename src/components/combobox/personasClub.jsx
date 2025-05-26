import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { getJugadoresClub } from "@/lib/database";
import { useAuth } from "@/context/AuthContext";

export function ComboboxPersonas({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [personas, setPersonas] = useState([]);
  const { clubData } = useAuth();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        console.log(clubData);
        const data = await getJugadoresClub(clubData?.id);
        setPersonas(data || []);
      } catch (error) {
        console.error("Error fetching ligas:", error);
      }
    };
    fetchPersonas();
  }, []);

  console.log("personas club: ", personas);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          onClick={() => setOpen((prev) => !prev)}
        >
          {value
            ? personas.find((persona) => String(persona.id) === String(value))
                ?.nombre
            : "Selecciona una persona de tu club..."}
          <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandInput placeholder="Buscar liga..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron personas de tu club.</CommandEmpty>
            <CommandGroup>
              {personas.map((persona) => (
                <CommandItem
                  key={persona?.personas.id}
                  value={String(persona?.personas.id)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">
                    {persona?.personas.nombre + " " + persona?.personas.apellido}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {persona?.personas.posicion}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto",
                      String(value) === String(persona?.personas.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
