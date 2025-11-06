import { useState } from "react";
import { MapPin, Check } from "lucide-react";
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
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

const mockRegions = [
  { id: '1', name: 'Mumbai', coordinates: [72.8777, 19.0760] as [number, number] },
  { id: '2', name: 'Delhi', coordinates: [77.1025, 28.7041] as [number, number] },
  { id: '3', name: 'Bengaluru', coordinates: [77.5946, 12.9716] as [number, number] },
  { id: '4', name: 'Chennai', coordinates: [80.2707, 13.0827] as [number, number] },
  { id: '5', name: 'Kolkata', coordinates: [88.3639, 22.5726] as [number, number] },
];

const RegionPicker = () => {
  const [open, setOpen] = useState(false);
  const { selectedRegion, setRegion } = useAppStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{selectedRegion?.name || "Select region"}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search region..." />
          <CommandList>
            <CommandEmpty>No region found.</CommandEmpty>
            <CommandGroup>
              {mockRegions.map((region) => (
                <CommandItem
                  key={region.id}
                  value={region.name}
                  onSelect={() => {
                    setRegion(region);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedRegion?.id === region.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {region.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default RegionPicker;
