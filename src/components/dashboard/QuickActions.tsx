import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";

interface QuickActionProps {
  actions?: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }>;
}

const QuickActions = ({ actions = [] }: QuickActionProps) => {
  // Default actions if none provided
  const defaultActions = [
    {
      title: "New Sale",
      description: "Create a new sales transaction",
      icon: <ShoppingCart className="h-6 w-6" />,
      onClick: () => console.log("New sale clicked"),
    },
    {
      title: "Add Product",
      description: "Add a new product to inventory",
      icon: <Package className="h-6 w-6" />,
      onClick: () => console.log("Add product clicked"),
    },
    {
      title: "Add User",
      description: "Create a new user account",
      icon: <Users className="h-6 w-6" />,
      onClick: () => console.log("Add user clicked"),
    },
    {
      title: "Sales Report",
      description: "View today's sales summary",
      icon: <BarChart3 className="h-6 w-6" />,
      onClick: () => console.log("Sales report clicked"),
    },
    {
      title: "Settings",
      description: "Configure store settings",
      icon: <Settings className="h-6 w-6" />,
      onClick: () => console.log("Settings clicked"),
    },
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  return (
    <Card className="w-full h-full bg-white overflow-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        <CardDescription>Frequently used actions and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {displayActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex justify-start items-center gap-3 h-16 p-4 hover:bg-slate-50"
            onClick={action.onClick}
          >
            <div className="flex-shrink-0 p-2 rounded-full bg-primary/10 text-primary">
              {action.icon}
            </div>
            <div className="text-left">
              <h3 className="font-medium">{action.title}</h3>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
          </Button>
        ))}

        <Button
          variant="ghost"
          className="mt-2 flex items-center justify-center gap-2"
          onClick={() => console.log("Add more actions")}
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Action</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
