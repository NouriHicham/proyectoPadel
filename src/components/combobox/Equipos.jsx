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
import { getClubs } from "@/lib/database";

// por terminar
export function ComboboxEquipos({ club, setClub }) {
  const [open, setOpen] = useState(false);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const data = await getClubs();
        setClubs(data || []);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);

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
          {club
            ? clubs.find((c) => String(c.id) === String(club))?.nombre
            : "Selecciona un club..."}
          <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar club..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron clubes.</CommandEmpty>
            <CommandGroup>
              {clubs.map((c) => (
                <CommandItem
                  key={c.id}
                  value={String(c.nombre)}
                  onSelect={() => {
                    setClub(c.id);
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">{c.nombre}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      String(club) === String(c.id)
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
