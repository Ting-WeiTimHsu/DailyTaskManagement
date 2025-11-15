import { useState, useEffect } from "react";
import { Menu, Home, Calendar, LogIn, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
        <div className="mx-auto w-[80%] flex h-16 items-center px-4 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border rounded-2xl shadow-lg">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card">
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-task-hover"
                    activeClassName="bg-secondary text-secondary-foreground font-medium"
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </NavLink>
                ))}
                
                <div className="mt-auto pt-4 border-t">
                  {user ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </Button>
                  ) : (
                    <NavLink
                      to="/auth"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-task-hover"
                      activeClassName="bg-secondary text-secondary-foreground font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </NavLink>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold text-foreground">
            Daily Tasks Track
          </h1>
        </div>
      </header>
      <main className="container py-6 px-4">{children}</main>
    </div>
  );
};

export default Layout;
