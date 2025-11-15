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
}

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => task.date === selectedDate);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        date: selectedDate,
      };
      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const handleUpdateTask = (id: string, text: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleMoveTask = (id: string, newDate: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, date: newDate } : task)));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Your Tasks</h2>
        <p className="text-muted-foreground">Select a date and manage your daily tasks</p>
      </div>

      <DateDropdown value={selectedDate} onChange={setSelectedDate} />

      <div className="space-y-3 bg-card rounded-xl p-6 border shadow-sm">
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
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No tasks for this day</p>
              <p className="text-sm mt-1">Add a task to get started</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                text={task.text}
                date={task.date}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onMove={handleMoveTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
