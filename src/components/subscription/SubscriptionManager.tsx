import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Calendar,
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Settings,
} from "lucide-react";
import PlanComparison from "./PlanComparison";

interface SubscriptionData {
  plan: string;
  status: "active" | "trialing" | "past_due" | "canceled";
  currentPeriod: {
    start: string;
    end: string;
  };
  usageStats: {
    users: {
      used: number;
      limit: number;
    };
    products: {
      used: number;
      limit: number;
    };
    stores: {
      used: number;
      limit: number;
    };
  };
  paymentMethod?: {
    type: string;
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: "paid" | "open" | "overdue";
  }>;
}

interface SubscriptionManagerProps {
  subscription?: SubscriptionData;
  onUpgrade?: (plan: string) => void;
  onCancelSubscription?: () => void;
  onUpdatePaymentMethod?: () => void;
  onDownloadInvoice?: (invoiceId: string) => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  subscription = {
    plan: "Free",
    status: "active",
    currentPeriod: {
      start: "2023-06-01",
      end: "2023-07-01",
    },
    usageStats: {
      users: {
        used: 2,
        limit: 2,
      },
      products: {
        used: 75,
        limit: 100,
      },
      stores: {
        used: 1,
        limit: 1,
      },
    },
    invoices: [
      {
        id: "INV-001",
        date: "2023-06-01",
        amount: 0,
        status: "paid",
      },
    ],
  },
  onUpgrade = () => {},
  onCancelSubscription = () => {},
  onUpdatePaymentMethod = () => {},
  onDownloadInvoice = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const getStatusBadge = (status: SubscriptionData["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "trialing":
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case "past_due":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>
        );
      case "canceled":
        return <Badge className="bg-gray-100 text-gray-800">Canceled</Badge>;
      default:
        return null;
    }
  };

  const getInvoiceStatusBadge = (status: "paid" | "open" | "overdue") => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "open":
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateUsagePercentage = (used: number, limit: number) => {
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
            <p className="text-muted-foreground">
              Manage your subscription plan and billing information
            </p>
          </div>
          {subscription.plan !== "Gold" && (
            <Button
              className="mt-4 md:mt-0"
              onClick={() => onUpgrade("Premium")}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Current Plan Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">
                        {subscription.plan}
                      </h2>
                      {getStatusBadge(subscription.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current period:{" "}
                      {formatDate(subscription.currentPeriod.start)} -{" "}
                      {formatDate(subscription.currentPeriod.end)}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2">
                    {subscription.plan !== "Free" && (
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelDialog(true)}
                      >
                        Cancel Subscription
                      </Button>
                    )}
                    {subscription.plan !== "Gold" && (
                      <Button onClick={() => setActiveTab("plans")}>
                        View Plans
                      </Button>
                    )}
                  </div>
                </div>

                {subscription.status === "past_due" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Payment Failed</AlertTitle>
                    <AlertDescription>
                      Your last payment failed. Please update your payment
                      method to avoid service interruption.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Users</span>
                    <span className="text-sm text-muted-foreground">
                      {subscription.usageStats.users.used} of{" "}
                      {subscription.usageStats.users.limit} users
                    </span>
                  </div>
                  <Progress
                    value={calculateUsagePercentage(
                      subscription.usageStats.users.used,
                      subscription.usageStats.users.limit,
                    )}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Products</span>
                    <span className="text-sm text-muted-foreground">
                      {subscription.usageStats.products.used} of{" "}
                      {subscription.usageStats.products.limit} products
                    </span>
                  </div>
                  <Progress
                    value={calculateUsagePercentage(
                      subscription.usageStats.products.used,
                      subscription.usageStats.products.limit,
                    )}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Stores</span>
                    <span className="text-sm text-muted-foreground">
                      {subscription.usageStats.stores.used} of{" "}
                      {subscription.usageStats.stores.limit} stores
                    </span>
                  </div>
                  <Progress
                    value={calculateUsagePercentage(
                      subscription.usageStats.stores.used,
                      subscription.usageStats.stores.limit,
                    )}
                    className="h-2"
                  />
                </div>

                {(calculateUsagePercentage(
                  subscription.usageStats.users.used,
                  subscription.usageStats.users.limit,
                ) >= 80 ||
                  calculateUsagePercentage(
                    subscription.usageStats.products.used,
                    subscription.usageStats.products.limit,
                  ) >= 80 ||
                  calculateUsagePercentage(
                    subscription.usageStats.stores.used,
                    subscription.usageStats.stores.limit,
                  ) >= 80) && (
                  <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">
                      Approaching Limits
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      You're approaching your plan limits. Consider upgrading to
                      a higher plan to avoid restrictions.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans">
            <PlanComparison
              currentPlan={subscription.plan}
              onPlanSelect={onUpgrade}
            />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            {/* Payment Method */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                {subscription.paymentMethod ? (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {subscription.paymentMethod.type}{" "}
                          {subscription.paymentMethod.last4 && (
                            <span>
                              ending in {subscription.paymentMethod.last4}
                            </span>
                          )}
                        </p>
                        {subscription.paymentMethod.expiryMonth &&
                          subscription.paymentMethod.expiryYear && (
                            <p className="text-sm text-muted-foreground">
                              Expires {subscription.paymentMethod.expiryMonth}/
                              {subscription.paymentMethod.expiryYear}
                            </p>
                          )}
                      </div>
                    </div>
                    <Button variant="outline" onClick={onUpdatePaymentMethod}>
                      Update
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <CreditCard className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-1">
                      No payment method
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add a payment method to upgrade to a paid plan
                    </p>
                    <Button onClick={onUpdatePaymentMethod}>
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                {subscription.invoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">
                            Invoice
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Amount
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Status
                          </th>
                          <th className="text-right py-3 px-4 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscription.invoices.map((invoice) => (
                          <tr
                            key={invoice.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">{invoice.id}</td>
                            <td className="py-3 px-4">
                              {formatDate(invoice.date)}
                            </td>
                            <td className="py-3 px-4">
                              ${invoice.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              {getInvoiceStatusBadge(invoice.status)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDownloadInvoice(invoice.id)}
                              >
                                <Download className="h-4 w-4 mr-1" /> Download
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <FileText className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium mb-1">
                      No invoices yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your billing history will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Settings */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Billing Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Billing Cycle</p>
                      <p className="text-sm text-muted-foreground">
                        Your billing cycle starts on the 1st of each month
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Settings className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Billing Preferences</p>
                      <p className="text-sm text-muted-foreground">
                        Manage your billing notifications and preferences
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll lose
              access to premium features at the end of your current billing
              period.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 my-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Important Note</h4>
                <ul className="text-sm text-yellow-700 list-disc pl-5 mt-2 space-y-1">
                  <li>
                    Your subscription will remain active until the end of the
                    current billing period.
                  </li>
                  <li>
                    You'll be downgraded to the Free plan after that date.
                  </li>
                  <li>
                    Any data exceeding Free plan limits may become inaccessible.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={onCancelSubscription}>
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManager;
