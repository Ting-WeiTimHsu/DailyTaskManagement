import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, addDays } from "date-fns";

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

  const handleMoveToTomorrow = () => {
    const currentDate = new Date(date);
    const tomorrow = addDays(currentDate, 1);
    onMove(id, format(tomorrow, "yyyy-MM-dd"));
  };

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:bg-task-hover ${
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
          <DropdownMenuItem
            onClick={handleMoveToTomorrow}
            className="cursor-pointer text-foreground hover:bg-task-hover"
          >
            <MoveRight className="mr-2 h-4 w-4 text-primary" />
            Move to later
          </DropdownMenuItem>
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
