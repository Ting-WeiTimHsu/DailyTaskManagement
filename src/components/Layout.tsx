import { useState } from "react";
import { Menu, Home, Calendar, UserPlus } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Past Tasks", icon: Calendar, path: "/past-tasks" },
    { title: "Sign Up", icon: UserPlus, path: "/signup" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center px-4">
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
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Daily Tasks
          </h1>
        </div>
      </header>
      <main className="container py-6 px-4">{children}</main>
    </div>
  );
};

export default Layout;
