import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  ReceiptText,
  Store,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({
  icon,
  label,
  href = "/",
  isActive = false,
  isCollapsed = false,
  onClick,
}: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            className={cn(
              "w-full justify-start",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-accent hover:text-accent-foreground",
              isCollapsed ? "px-2" : "px-4",
            )}
            onClick={onClick}
            asChild
          >
            <a href={href} className="flex items-center gap-3">
              {icon}
              {!isCollapsed && <span>{label}</span>}
            </a>
          </Button>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarProps {
  className?: string;
  stores?: Array<{ id: string; name: string }>;
  currentStoreId?: string;
  onStoreChange?: (storeId: string) => void;
}

const Sidebar = ({
  className,
  stores = [
    { id: "store-1", name: "Main Store" },
    { id: "store-2", name: "Warehouse" },
    { id: "store-3", name: "Branch Office" },
  ],
  currentStoreId = "store-1",
  onStoreChange = () => {},
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  const mainNavItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/",
    },
    {
      id: "sales",
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Sales",
      href: "/sales",
    },
    {
      id: "inventory",
      icon: <Package className="h-5 w-5" />,
      label: "Inventory",
      href: "/inventory",
    },
    {
      id: "users",
      icon: <Users className="h-5 w-5" />,
      label: "Users",
      href: "/users",
    },
    {
      id: "subscription",
      icon: <CreditCard className="h-5 w-5" />,
      label: "Subscription",
      href: "/subscription",
    },
    {
      id: "transactions",
      icon: <ReceiptText className="h-5 w-5" />,
      label: "Transactions",
      href: "/transactions",
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveItem(id);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b">
        {!collapsed && (
          <div className="font-bold text-xl tracking-tight">POS System</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activeItem === item.id}
              isCollapsed={collapsed}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </div>

        <Separator className="my-4" />

        {!collapsed && (
          <div className="px-4 mb-2 text-xs font-semibold text-muted-foreground">
            STORES
          </div>
        )}
        <div className="space-y-1">
          {stores.map((store) => (
            <TooltipProvider key={store.id} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={collapsed ? "icon" : "default"}
                    className={cn(
                      "w-full justify-start",
                      currentStoreId === store.id
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent hover:text-accent-foreground",
                      collapsed ? "px-2" : "px-4",
                    )}
                    onClick={() => onStoreChange(store.id)}
                  >
                    <Store className="h-5 w-5 mr-3" />
                    {!collapsed && <span>{store.name}</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{store.name}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 border-t mt-auto">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "default"}
                className="w-full justify-start"
              >
                <Settings className="h-5 w-5 mr-3" />
                {!collapsed && <span>Settings</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Settings</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "default"}
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
