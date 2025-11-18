import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import DateDropdown from "@/components/DateDropdown";
import TaskItem from "@/components/TaskItem";
import FlipClock from "@/components/FlipClock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  date: string;
  completed: boolean;
  position: number;
}

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchedTaskId, setTouchedTaskId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check auth and redirect if not logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load tasks from Supabase
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, selectedDate]);

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", selectedDate)
      .order("position", { ascending: true });

    if (error) {
      toast({
        title: "Error loading tasks",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTasks(data || []);
    }
  };

  const handleAddTask = async () => {
    if (newTaskText.trim() && user) {
      const maxPosition = tasks.length > 0 ? Math.max(...tasks.map((t) => t.position)) : -1;
      
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          text: newTaskText.trim(),
          date: selectedDate,
          position: maxPosition + 1,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding task",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setTasks([...tasks, data]);
        setNewTaskText("");
      }
    }
  };

  const handleUpdateTask = async (id: string, text: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ text })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)));
    }
  };

  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleMoveTask = async (id: string, newDate: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ date: newDate })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error moving task",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
      toast({ title: "Task moved successfully" });
    }
  };

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const draggedIndex = tasks.findIndex((t) => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex((t) => t.id === targetId);

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    // Update positions
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      position: index,
    }));

    setTasks(updatedTasks);
    setDraggedTaskId(null);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Update positions in database
    for (const task of updatedTasks) {
      await supabase
        .from("tasks")
        .update({ position: task.position })
        .eq("id", task.id);
    }
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

  const handleTouchEnd = async (e: React.TouchEvent) => {
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

          // Update positions
          const updatedTasks = newTasks.map((task, index) => ({
            ...task,
            position: index,
          }));

          setTasks(updatedTasks);

          // Haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }

          // Update positions in database
          for (const task of updatedTasks) {
            await supabase
              .from("tasks")
              .update({ position: task.position })
              .eq("id", task.id);
          }
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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <FlipClock />

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

      {/* Footer */}
      <footer className="mt-12 border-t bg-card/50 backdrop-blur rounded-xl p-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Daily Tasks Track - Simple and effective task management for your daily productivity.
          </p>
          <p className="text-xs text-muted-foreground">
            Developed by Tim Hsu with{' '}
            <a 
              href="https://lovable.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="story-link inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
            >
              Lovable
              <svg 
                viewBox="0 0 24 24" 
                className="w-3 h-3 transition-transform duration-300 hover:scale-110 hover:rotate-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="lovable-gradient-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path fill="url(#lovable-gradient-footer)" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
              </svg>
            </a>
            {', Deployed by '}
            <a 
              href="https://vercel.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="story-link inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
            >
              Vercel
              <svg 
                viewBox="0 0 24 24" 
                className="w-3 h-3 transition-transform duration-300 hover:scale-110 hover:-rotate-12"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path d="M12 2L2 22h20L12 2z"/>
              </svg>
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
