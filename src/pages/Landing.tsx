import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InteractiveDuck from "@/components/InteractiveDuck";
import DemoTaskManager from "@/components/DemoTaskManager";

const Landing = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full pt-4">
        <div className="mx-auto w-[80%]">
          <div className="flex h-16 items-center justify-between px-6 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border rounded-full shadow-lg">
            <h1 className="text-xl font-semibold text-foreground">
              Daily Tasks Track
            </h1>
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="rounded-full"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-end pb-20 px-4 pt-24">
        <InteractiveDuck />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 mt-12">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-tight">
              Type
            </h1>
            <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-tight">
              Click
            </h1>
            <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-tight">
              Manage
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Organize your daily tasks with ease. Simple, beautiful, and effective.
          </p>
          
          <Button
            size="lg"
            onClick={() => {
              const demoSection = document.getElementById('demo-section');
              demoSection?.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => setShowDemo(true), 500);
            }}
            className="text-lg px-8 py-6 rounded-full"
          >
            Try It Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Demo Section */}
      <section 
        id="demo-section" 
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Try It Out
            </h2>
            <p className="text-xl text-muted-foreground">
              No sign-up required. Start managing your tasks right now.
            </p>
          </div>
          
          {showDemo && <DemoTaskManager />}
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready for More?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Cloud Sync</h3>
              <p className="text-muted-foreground">
                Access your tasks from any device, anywhere
              </p>
            </div>
            
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Task History</h3>
              <p className="text-muted-foreground">
                View and manage all your past tasks
              </p>
            </div>
            
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Drag & Drop</h3>
              <p className="text-muted-foreground">
                Easily reorder tasks with intuitive controls
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-12 py-6 rounded-full"
            >
              Sign Up Now - It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth')}
                className="text-primary hover:underline font-medium"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
