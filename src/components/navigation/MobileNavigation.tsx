import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mainNavItems, aboutNavItems } from "@/constants/navigation";
import { useActiveRoute } from "@/hooks/useNavigation";

interface MobileNavigationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileNavigation = ({ open, onOpenChange }: MobileNavigationProps) => {
  const { isAuthenticated } = useAuth();
  const { isActiveRoute } = useActiveRoute();

  const visibleNavItems = mainNavItems.filter(
    item => !item.authRequired || isAuthenticated
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 py-4">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">PREMONIX</span>
          </div>

          <Separator className="my-4" />

          {/* Main Navigation */}
          <nav className="flex-1 space-y-2">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground px-2 py-1">
                Main Navigation
              </h4>
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => onOpenChange(false)}
                    className={`flex items-center space-x-3 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* About Navigation */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground px-2 py-1">
                About
              </h4>
              {aboutNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => onOpenChange(false)}
                    className={`flex items-center space-x-3 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};