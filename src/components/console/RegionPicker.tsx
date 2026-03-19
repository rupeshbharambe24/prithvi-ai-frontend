import { useState, useEffect } from "react";
import { MapPin, Check, Loader2 } from "lucide-react";
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
import { useAppStore, type Region } from "@/store/appStore";
import { cn } from "@/lib/utils";
import { useRegions } from "@/hooks/use-api";

const RegionPicker = () => {
  const [open, setOpen] = useState(false);
  const { selectedRegion, setRegion } = useAppStore();
  const { data: apiRegions, isLoading } = useRegions();

  const regions: Region[] = (apiRegions ?? []).map((r) => ({
    id: String(r.id),
    numericId: r.id,
    name: r.name,
    coordinates: [r.center?.lng ?? 0, r.center?.lat ?? 0] as [number, number],
  }));

  // Auto-select first region if none selected
  useEffect(() => {
    if (!selectedRegion && regions.length > 0) {
      setRegion(regions[0]);
    }
  }, [regions, selectedRegion, setRegion]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
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
              {regions.map((region) => (
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
