import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import InteractiveDuck from "@/components/InteractiveDuck";
import DemoTaskManager from "@/components/DemoTaskManager";

const Landing = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const duckY = useTransform(scrollY, [0, 500], [0, -100]);

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
      <section className="relative min-h-screen flex flex-col items-center justify-end pb-20 px-4 pt-24 overflow-hidden">
        <motion.div style={{ y: duckY }} className="w-full">
          <InteractiveDuck />
        </motion.div>
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-4xl mx-auto text-center space-y-8 mt-12"
        >
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-6xl md:text-7xl font-bold text-foreground leading-tight"
            >
              Type
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-6xl md:text-7xl font-bold text-foreground leading-tight"
            >
              Click
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-6xl md:text-7xl font-bold text-foreground leading-tight"
            >
              Manage
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Organize your daily tasks with ease. Simple, beautiful, and effective.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
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
          </motion.div>
        </motion.div>
      </section>

      {/* Demo Section */}
      <motion.section 
        id="demo-section" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-4xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Try It Out
            </h2>
            <p className="text-xl text-muted-foreground">
              No sign-up required. Start managing your tasks right now.
            </p>
          </motion.div>
          
          {showDemo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <DemoTaskManager />
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-background to-accent/5"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            Ready for More?
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: CheckCircle2,
                title: "Cloud Sync",
                description: "Access your tasks from any device, anywhere"
              },
              {
                icon: CheckCircle2,
                title: "Task History",
                description: "View and manage all your past tasks"
              },
              {
                icon: CheckCircle2,
                title: "Drag & Drop",
                description: "Easily reorder tasks with intuitive controls"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-xl border bg-card space-y-3"
              >
                <feature.icon className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
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
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;
