import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Twitter, Github, Mail } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import DemoTaskManager from "@/components/DemoTaskManager";
import BackgroundParticles from "@/components/BackgroundParticles";
import FlipClock from "@/components/FlipClock";

const Landing = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundParticles />
      
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
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center pb-16 px-4 pt-24 overflow-hidden">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex flex-col gap-2"
            >
              <motion.h1 
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 30px hsl(var(--primary)))" }}
                transition={{ duration: 0.3 }}
                className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight cursor-pointer"
              >
                Type
              </motion.h1>
              <motion.h1 
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 30px hsl(var(--primary)))" }}
                transition={{ duration: 0.3 }}
                className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary/60 via-primary/80 to-primary bg-clip-text text-transparent leading-tight cursor-pointer"
              >
                Tap
              </motion.h1>
              <motion.h1 
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 30px hsl(var(--primary)))" }}
                transition={{ duration: 0.3 }}
                className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight cursor-pointer"
              >
                Track
              </motion.h1>
            </motion.div>
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
              Try it out
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
        className="flex items-center justify-center px-4 py-12"
      >
        <div className="max-w-4xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Try It Out!
            </h2>
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
        className="flex items-center justify-center px-4 py-12 mt-8 bg-gradient-to-b from-background to-accent/5"
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
              Sign Up Now
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

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Daily Tasks Track</h3>
              <p className="text-sm text-muted-foreground">
                Simple and effective task management for your daily productivity.
              </p>
            </div>
            
            <div className="space-y-4 md:text-right">
              <p className="text-sm text-muted-foreground">
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
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="lovable-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path fill="url(#lovable-gradient)" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
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
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 22h20L12 2z"/>
                  </svg>
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
