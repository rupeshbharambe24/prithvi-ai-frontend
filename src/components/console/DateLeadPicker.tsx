import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppStore } from "@/store/appStore";
import { format } from "date-fns";

const DateLeadPicker = () => {
  const { selectedDate, leadTime, setLeadTime } = useAppStore();

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(selectedDate, 'MMM dd, yyyy')}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <p className="text-sm text-muted-foreground">
            Date picker coming soon
          </p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start gap-2 w-[140px]">
            <Clock className="h-4 w-4" />
            <span>+{leadTime} days</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Forecast Lead Time</label>
              <p className="text-xs text-muted-foreground">
                Days ahead: {leadTime}
              </p>
            </div>
            <Slider
              value={[leadTime]}
              onValueChange={([value]) => setLeadTime(value)}
              max={7}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 day</span>
              <span>7 days</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateLeadPicker;
