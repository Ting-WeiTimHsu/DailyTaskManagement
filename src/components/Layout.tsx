import { useState, useEffect } from "react";
import { Menu, Home, Calendar, LogIn, LogOut, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";

import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/auth");
    setOpen(false);
  };

  const menuItems = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Past Tasks", icon: Calendar, path: "/past-tasks" },
  ];

  return (
    <div className="min-h-screen bg-background gradient-animated">
      <header className="sticky top-0 z-50 w-full pt-4">
        <div className="mx-auto w-[80%] relative">
          <div className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border rounded-full shadow-lg overflow-hidden transition-all duration-300">
            <div className="flex h-16 items-center px-4 gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="shrink-0 hover:bg-transparent focus:bg-transparent active:bg-transparent"
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
              
              {open ? (
                <nav className="flex items-center gap-2 flex-1 overflow-x-auto animate-slide-in">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-2 rounded-full px-4 py-2 text-foreground transition-colors hover:bg-task-hover whitespace-nowrap shrink-0"
                      activeClassName="bg-secondary text-secondary-foreground font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  ))}
                  
                  {user ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 rounded-full shrink-0"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </Button>
                  ) : (
                    <NavLink
                      to="/auth"
                      className="flex items-center gap-2 rounded-full px-4 py-2 text-foreground transition-colors hover:bg-task-hover whitespace-nowrap shrink-0"
                      activeClassName="bg-secondary text-secondary-foreground font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="text-sm">Login</span>
                    </NavLink>
                  )}
                </nav>
              ) : (
                <h1 className="text-xl font-semibold text-foreground">
                  Daily Tasks Track
                </h1>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container py-6 px-4">{children}</main>
    </div>
  );
};

export default Layout;
