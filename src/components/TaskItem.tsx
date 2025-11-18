import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, MoveRight, GripVertical } from "lucide-react";
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
  completed: boolean;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newDate: string) => void;
  onToggleComplete: (id: string) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetId: string) => void;
  onTouchStart?: (e: React.TouchEvent, id: string) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}

const TaskItem = ({
  id,
  text,
  date,
  completed,
  onUpdate,
  onDelete,
  onMove,
  onToggleComplete,
  isDragging = false,
  onDragStart,
  onDragOver,
  onDrop,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [swipeX, setSwipeX] = useState(0);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
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

  const handleSwipeStart = (clientX: number) => {
    setSwipeStartX(clientX);
  };

  const handleSwipeMove = (clientX: number) => {
    if (swipeStartX === null) return;
    const deltaX = clientX - swipeStartX;
    setSwipeX(deltaX);
  };

  const handleSwipeEnd = () => {
    if (swipeStartX === null) return;
    
    // Swipe left to delete (threshold: -100px)
    if (swipeX < -100) {
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      onDelete(id);
    }
    // Swipe right to complete (threshold: 100px)
    else if (swipeX > 100) {
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      onToggleComplete(id);
    }
    
    // Reset
    setSwipeX(0);
    setSwipeStartX(null);
  };

  return (
    <div
      data-task-id={id}
      style={{
        transform: `translateX(${swipeX}px)`,
        transition: swipeStartX === null ? 'transform 0.3s ease' : 'none',
      }}
      className={`group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-xl hover:shadow-2xl hover:bg-task-hover ${
        isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"
      } ${completed ? "opacity-60" : ""} ${
        swipeX < -50 ? 'bg-destructive/20' : swipeX > 50 ? 'bg-primary/20' : ''
      }`}
      draggable
      onDragStart={(e) => onDragStart?.(e, id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, id)}
      onTouchStart={(e) => {
        onTouchStart?.(e, id);
        handleSwipeStart(e.touches[0].clientX);
      }}
      onTouchMove={(e) => {
        onTouchMove?.(e);
        handleSwipeMove(e.touches[0].clientX);
      }}
      onTouchEnd={(e) => {
        onTouchEnd?.(e);
        handleSwipeEnd();
      }}
      onMouseDown={(e) => handleSwipeStart(e.clientX)}
      onMouseMove={(e) => {
        if (e.buttons === 1) {
          handleSwipeMove(e.clientX);
        }
      }}
      onMouseUp={handleSwipeEnd}
      onMouseLeave={() => {
        if (swipeStartX !== null) {
          setSwipeX(0);
          setSwipeStartX(null);
        }
      }}
    >
      {/* Drag Handle */}
      <div className="cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
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
            className={`text-foreground text-base cursor-text ${
              completed ? "line-through" : ""
            }`}
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
            onClick={() => onToggleComplete(id)}
            className="cursor-pointer text-foreground hover:bg-task-hover"
          >
            <span className="mr-2">{completed ? "☑" : "☐"}</span>
            {completed ? "Mark Incomplete" : "Mark Complete"}
          </DropdownMenuItem>
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
