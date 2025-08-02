import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavItem } from '@/constants/navigation';
import { useActiveRoute, useNavigationState } from '@/hooks/useNavigation';

interface NavigationDropdownProps {
  label: string;
  items: NavItem[];
}

export const NavigationDropdown = ({ label, items }: NavigationDropdownProps) => {
  const { isActiveRoute } = useActiveRoute();
  const { hoveredItem, handleMouseEnter, handleMouseLeave } = useNavigationState();

  const isDropdownActive = items.some(item => isActiveRoute(item.href));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`relative flex items-center space-x-1 transition-colors duration-200 ${
            isDropdownActive
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onMouseEnter={() => handleMouseEnter(label)}
          onMouseLeave={handleMouseLeave}
        >
          <span>{label}</span>
          <ChevronDown className="w-4 h-4" />
          {(hoveredItem === label || isDropdownActive) && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-pulse" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border"
        align="start"
      >
        {items.map((item) => {
          const Icon = item.icon;
          
          return (
            <DropdownMenuItem key={item.label} asChild>
              <Link
                to={item.href}
                className={`flex items-center space-x-2 cursor-pointer ${
                  isActiveRoute(item.href)
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};