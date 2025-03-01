import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Building2, Users, CreditCard, ShoppingCart } from "lucide-react";

interface DashboardStats {
  totalCompanies: number;
  totalUsers: number;
  activeSubscriptions: number;
  totalTransactions: number;
  recentCompanies: any[];
  subscriptionTiers: {
    free: number;
    premium: number;
    gold: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
    totalTransactions: 0,
    recentCompanies: [],
    subscriptionTiers: {
      free: 0,
      premium: 0,
      gold: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      // Get total companies
      const { count: totalCompanies } = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true });

      // Get total users
      const { count: totalUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // Get active subscriptions
      const { count: activeSubscriptions } = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true })
        .eq("subscription_status", "active");

      // Get total transactions
      const { count: totalTransactions } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true });

      // Get recent companies
      const { data: recentCompanies } = await supabase
        .from("companies")
        .select("id, name, subscription_tier, subscription_status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      // Get subscription tiers breakdown
      const { data: subscriptionData } = await supabase
        .from("companies")
        .select("subscription_tier");

      const subscriptionTiers = {
        free: 0,
        premium: 0,
        gold: 0,
      };

      if (subscriptionData) {
        subscriptionData.forEach((item) => {
          if (item.subscription_tier === "free") subscriptionTiers.free++;
          else if (item.subscription_tier === "premium")
            subscriptionTiers.premium++;
          else if (item.subscription_tier === "gold") subscriptionTiers.gold++;
        });
      }

      setStats({
        totalCompanies: totalCompanies || 0,
        totalUsers: totalUsers || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalTransactions: totalTransactions || 0,
        recentCompanies: recentCompanies || [],
        subscriptionTiers,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => fetchDashboardStats()}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Companies
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubscriptions} with active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Across all companies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Subscription Tiers
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.subscriptionTiers.premium + stats.subscriptionTiers.gold}
            </div>
            <p className="text-xs text-muted-foreground">Paid subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Processed through the platform
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="companies" className="w-full">
        <TabsList>
          <TabsTrigger value="companies">Recent Companies</TabsTrigger>
          <TabsTrigger value="subscriptions">
            Subscription Breakdown
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Recently Created Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentCompanies.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">
                          Company Name
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Subscription
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentCompanies.map((company) => (
                        <tr
                          key={company.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-3 px-4 font-medium">
                            {company.name}
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize">
                              {company.subscription_tier}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${company.subscription_status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                            >
                              {company.subscription_status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(company.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No companies found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Subscription Tier Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                      <span>Free</span>
                    </div>
                    <span className="font-medium">
                      {stats.subscriptionTiers.free}
                    </span>
                  </div>
                  <Progress
                    value={
                      stats.totalCompanies
                        ? (stats.subscriptionTiers.free /
                            stats.totalCompanies) *
                          100
                        : 0
                    }
                    className="h-2 bg-blue-100"
                    indicatorClassName="bg-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
                      <span>Premium</span>
                    </div>
                    <span className="font-medium">
                      {stats.subscriptionTiers.premium}
                    </span>
                  </div>
                  <Progress
                    value={
                      stats.totalCompanies
                        ? (stats.subscriptionTiers.premium /
                            stats.totalCompanies) *
                          100
                        : 0
                    }
                    className="h-2 bg-purple-100"
                    indicatorClassName="bg-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
                      <span>Gold</span>
                    </div>
                    <span className="font-medium">
                      {stats.subscriptionTiers.gold}
                    </span>
                  </div>
                  <Progress
                    value={
                      stats.totalCompanies
                        ? (stats.subscriptionTiers.gold /
                            stats.totalCompanies) *
                          100
                        : 0
                    }
                    className="h-2 bg-amber-100"
                    indicatorClassName="bg-amber-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
