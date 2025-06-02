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
import { getLigas } from "@/lib/database";

export function ComboboxLigas({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [ligas, setLigas] = useState([]);

  useEffect(() => {
    const fetchLigas = async () => {
      try {
        const data = await getLigas();
        setLigas(data || []);
      } catch (error) {
        console.error("Error fetching ligas:", error);
      }
    };
    fetchLigas();
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
          {value
            ? ligas.find((liga) => String(liga.id) === String(value))?.nombre
            : "Selecciona una liga..."}
          <ChevronsUpDown className="ml-2 opacity-50 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[350px] p-0" 
        align="start"
      >
        <Command>
          <CommandInput placeholder="Buscar liga..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron ligas.</CommandEmpty>
            <CommandGroup>
              {ligas.map((liga) => (
                <CommandItem
                  key={liga.id}
                  value={String(liga.id)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">{liga.nombre}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {liga.tipo}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto",
                      String(value) === String(liga.id)
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
