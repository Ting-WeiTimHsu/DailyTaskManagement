import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import DateDropdown from "@/components/DateDropdown";
import TaskItem from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  text: string;
  date: string;
  completed: boolean;
  position: number;
}

const DemoTaskManager = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchedTaskId, setTouchedTaskId] = useState<string | null>(null);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`demo-tasks-${selectedDate}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([]);
    }
  }, [selectedDate]);

  // Save tasks to localStorage
  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem(`demo-tasks-${selectedDate}`, JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const maxPosition = tasks.length > 0 ? Math.max(...tasks.map((t) => t.position)) : -1;
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: newTaskText.trim(),
        date: selectedDate,
        completed: false,
        position: maxPosition + 1,
      };
      saveTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const handleUpdateTask = (id: string, text: string) => {
    saveTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)));
  };

  const handleDeleteTask = (id: string) => {
    saveTasks(tasks.filter((task) => task.id !== id));
  };

  const handleMoveTask = (id: string, newDate: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    // Remove from current date
    saveTasks(tasks.filter((t) => t.id !== id));

    // Add to new date
    const targetDateTasks = localStorage.getItem(`demo-tasks-${newDate}`);
    const targetTasks = targetDateTasks ? JSON.parse(targetDateTasks) : [];
    const maxPosition = targetTasks.length > 0 ? Math.max(...targetTasks.map((t: Task) => t.position)) : -1;
    
    targetTasks.push({ ...task, date: newDate, position: maxPosition + 1 });
    localStorage.setItem(`demo-tasks-${newDate}`, JSON.stringify(targetTasks));
  };

  const handleToggleComplete = (id: string) => {
    saveTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const draggedIndex = tasks.findIndex((t) => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex((t) => t.id === targetId);

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      position: index,
    }));

    saveTasks(updatedTasks);
    setDraggedTaskId(null);
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    setTouchedTaskId(id);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchedTaskId || touchStartY === null) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = Math.abs(currentY - touchStartY);
    
    // Only start drag if moved more than 10px vertically
    if (deltaY > 10) {
      setDraggedTaskId(touchedTaskId);
    }
    
    // Find element at touch position
    const element = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    );
    
    if (element) {
      const taskElement = element.closest('[data-task-id]');
      if (taskElement) {
        const targetId = taskElement.getAttribute('data-task-id');
        if (targetId && targetId !== touchedTaskId) {
          // Visual feedback
          taskElement.classList.add('bg-accent/50');
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchedTaskId || !draggedTaskId) {
      setTouchedTaskId(null);
      setTouchStartY(null);
      setDraggedTaskId(null);
      return;
    }
    
    // Find element at touch position
    const element = document.elementFromPoint(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );
    
    if (element) {
      const taskElement = element.closest('[data-task-id]');
      if (taskElement) {
        const targetId = taskElement.getAttribute('data-task-id');
        if (targetId && targetId !== touchedTaskId) {
          // Perform the drop
          const draggedIndex = tasks.findIndex((t) => t.id === touchedTaskId);
          const targetIndex = tasks.findIndex((t) => t.id === targetId);

          const newTasks = [...tasks];
          const [draggedTask] = newTasks.splice(draggedIndex, 1);
          newTasks.splice(targetIndex, 0, draggedTask);

          const updatedTasks = newTasks.map((task, index) => ({
            ...task,
            position: index,
          }));

          saveTasks(updatedTasks);
        }
        // Remove visual feedback
        taskElement.classList.remove('bg-accent/50');
      }
    }
    
    setTouchedTaskId(null);
    setTouchStartY(null);
    setDraggedTaskId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <DateDropdown value={selectedDate} onChange={setSelectedDate} />

      <div className="space-y-3 bg-card rounded-xl p-6 border shadow-xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tasks Stack</h3>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-background border-border"
          />
          <Button
            onClick={handleAddTask}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-2 mt-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No tasks for this day</p>
              <p className="text-sm mt-1">Add a task to get started</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                text={task.text}
                date={task.date}
                completed={task.completed}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onMove={handleMoveTask}
                onToggleComplete={handleToggleComplete}
                isDragging={draggedTaskId === task.id}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoTaskManager;
