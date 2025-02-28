import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, X, HelpCircle } from "lucide-react";

interface Feature {
  name: string;
  free: boolean;
  premium: boolean;
  gold: boolean;
  tooltip?: string;
}

interface PlanDetails {
  name: string;
  price: string;
  description: string;
  features: string[];
  limitations: {
    users: number;
    products: number;
    stores: number;
  };
  buttonText: string;
  recommended?: boolean;
}

interface PlanComparisonProps {
  features?: Feature[];
  plans?: PlanDetails[];
  currentPlan?: string;
  onPlanSelect?: (plan: string) => void;
}

const PlanComparison: React.FC<PlanComparisonProps> = ({
  features = [
    { name: "Point of Sale", free: true, premium: true, gold: true },
    {
      name: "Basic Inventory Management",
      free: true,
      premium: true,
      gold: true,
    },
    { name: "Single Store", free: true, premium: true, gold: true },
    { name: "Basic Reports", free: true, premium: true, gold: true },
    { name: "Email Support", free: false, premium: true, gold: true },
    {
      name: "Multi-Store Management",
      free: false,
      premium: true,
      gold: true,
      tooltip: "Manage inventory across multiple store locations",
    },
    { name: "Advanced Inventory", free: false, premium: true, gold: true },
    {
      name: "Customer Loyalty Program",
      free: false,
      premium: false,
      gold: true,
    },
    {
      name: "Advanced Analytics",
      free: false,
      premium: false,
      gold: true,
      tooltip: "Detailed sales and inventory analytics with forecasting",
    },
    { name: "Priority Support", free: false, premium: false, gold: true },
    { name: "API Access", free: false, premium: false, gold: true },
  ],
  plans = [
    {
      name: "Free",
      price: "$0",
      description:
        "Basic POS functionality for small businesses just getting started",
      features: ["Basic POS", "Limited inventory", "Single store"],
      limitations: {
        users: 2,
        products: 100,
        stores: 1,
      },
      buttonText: "Current Plan",
    },
    {
      name: "Premium",
      price: "$49",
      description:
        "Advanced features for growing businesses with multiple locations",
      features: ["Multi-store support", "Advanced inventory", "Email support"],
      limitations: {
        users: 10,
        products: 1000,
        stores: 3,
      },
      buttonText: "Upgrade",
      recommended: true,
    },
    {
      name: "Gold",
      price: "$99",
      description:
        "Enterprise-level solution with all features and priority support",
      features: [
        "All Premium features",
        "Customer loyalty",
        "Advanced analytics",
      ],
      limitations: {
        users: 50,
        products: 10000,
        stores: 10,
      },
      buttonText: "Upgrade",
    },
  ],
  currentPlan = "Free",
  onPlanSelect = () => {},
}) => {
  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Subscription Plans
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${plan.recommended ? "border-primary border-2" : ""}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-tl-none rounded-br-none bg-primary text-primary-foreground">
                    Recommended
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground"> /month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Features</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Limitations</h4>
                    <ul className="space-y-2">
                      <li className="text-sm">
                        Up to {plan.limitations.users} users
                      </li>
                      <li className="text-sm">
                        Up to {plan.limitations.products.toLocaleString()}{" "}
                        products
                      </li>
                      <li className="text-sm">
                        Up to {plan.limitations.stores} store
                        {plan.limitations.stores > 1 ? "s" : ""}
                      </li>
                    </ul>
                  </div>
                  <Button
                    className="w-full mt-4"
                    variant={currentPlan === plan.name ? "outline" : "default"}
                    disabled={currentPlan === plan.name}
                    onClick={() => onPlanSelect(plan.name)}
                  >
                    {currentPlan === plan.name
                      ? "Current Plan"
                      : plan.buttonText}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="overflow-x-auto mt-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-medium">Features</th>
                <th className="text-center py-4 px-4 font-medium">Free</th>
                <th className="text-center py-4 px-4 font-medium">Premium</th>
                <th className="text-center py-4 px-4 font-medium">Gold</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center">
                      {feature.name}
                      {feature.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feature.free ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feature.premium ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {feature.gold ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanComparison;
