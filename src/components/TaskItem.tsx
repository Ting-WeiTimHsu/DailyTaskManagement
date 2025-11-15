import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { format, addDays, startOfDay } from "date-fns";

interface TaskItemProps {
  id: string;
  text: string;
  date: string;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newDate: string) => void;
  isDragging?: boolean;
}

const TaskItem = ({
  id,
  text,
  date,
  onUpdate,
  onDelete,
  onMove,
  isDragging = false,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditText(text);
      setIsEditing(false);
    }
  };

  const getNext7Days = () => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(today, i);
      return {
        date: format(day, "yyyy-MM-dd"),
        display: format(day, "MMM d, EEE"),
      };
    });
  };

  const handleMoveToDate = (newDate: string) => {
    onMove(id, newDate);
  };

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all shadow-md hover:shadow-lg hover:bg-task-hover ${
        isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"
      }`}
      draggable
    >
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-foreground text-base"
          />
        ) : (
          <p
            className="text-foreground text-base cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {text}
          </p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-popover">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer text-foreground">
              <MoveRight className="mr-2 h-4 w-4 text-foreground" />
              Move to
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-popover">
              {getNext7Days().map((day) => (
                <DropdownMenuItem
                  key={day.date}
                  onClick={() => handleMoveToDate(day.date)}
                  className="cursor-pointer text-foreground hover:bg-task-hover"
                >
                  {day.display}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            onClick={() => onDelete(id)}
            className="cursor-pointer text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskItem;
