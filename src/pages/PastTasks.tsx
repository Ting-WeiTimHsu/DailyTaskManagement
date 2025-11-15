import { useState, useEffect } from "react";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  date: string;
}

const PastTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check auth
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

  // Load past tasks
  useEffect(() => {
    if (user) {
      loadPastTasks();
    }
  }, [user]);

  const loadPastTasks = async () => {
    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .lt("date", today)
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Error loading past tasks",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTasks(data || []);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const today = startOfDay(new Date());
  const pastTasks = tasks;

  // Group tasks by date
  const groupedTasks = pastTasks.reduce((acc, task) => {
    const date = task.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    return parseISO(b).getTime() - parseISO(a).getTime();
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Past Tasks</h2>
        <p className="text-muted-foreground">Review your completed tasks</p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">No past tasks yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks from previous days will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="bg-card rounded-xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {format(parseISO(date), "EEEE, MMMM d, yyyy")}
              </h3>
              <div className="space-y-2">
                {groupedTasks[date].map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border bg-background p-3"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <p className="text-foreground">{task.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastTasks;
