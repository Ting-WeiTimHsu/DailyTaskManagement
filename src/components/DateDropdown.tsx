import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, startOfDay } from "date-fns";

interface DateDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const DateDropdown = ({ value, onChange }: DateDropdownProps) => {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    // Generate 7 days starting from today
    const today = startOfDay(new Date());
    const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    setDates(next7Days);

    // Set today as default if no value
    if (!value) {
      onChange(format(today, "yyyy-MM-dd"));
    }
  }, []);

  const formatDateDisplay = (date: Date) => {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    
    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return `Today - ${format(date, "MMM d")}`;
    } else if (format(date, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd")) {
      return `Tomorrow - ${format(date, "MMM d")}`;
    }
    return format(date, "EEEE, MMM d");
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full max-w-xs bg-card border-border hover:bg-task-hover transition-colors">
        <Calendar className="mr-2 h-4 w-4 text-primary" />
        <SelectValue placeholder="Select a date" />
      </SelectTrigger>
      <SelectContent className="bg-popover">
        {dates.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          return (
            <SelectItem key={dateStr} value={dateStr} className="cursor-pointer">
              {formatDateDisplay(date)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default DateDropdown;
