import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend: number;
  icon: React.ReactNode;
  trendLabel?: string;
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  description = "No data available",
  trend = 0,
  icon = <DollarSign className="h-4 w-4" />,
  trendLabel = "vs. last period",
}: MetricCardProps) => {
  const isTrendPositive = trend >= 0;

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-muted rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <div className="flex items-center mt-4">
          <span
            className={`flex items-center text-xs ${isTrendPositive ? "text-green-600" : "text-red-600"}`}
          >
            {isTrendPositive ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            {trendLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricsOverviewProps {
  metrics?: {
    totalSales: string;
    salesTrend: number;
    totalOrders: string;
    ordersTrend: number;
    lowStock: string;
    lowStockTrend: number;
    activeUsers: string;
    usersTrend: number;
  };
}

const MetricsOverview = ({
  metrics = {
    totalSales: "$12,345",
    salesTrend: 12.5,
    totalOrders: "156",
    ordersTrend: 8.2,
    lowStock: "24",
    lowStockTrend: -5.3,
    activeUsers: "42",
    usersTrend: 3.7,
  },
}: MetricsOverviewProps) => {
  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Business Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales}
          description="Total sales this period"
          trend={metrics.salesTrend}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <MetricCard
          title="Orders"
          value={metrics.totalOrders}
          description="Total orders processed"
          trend={metrics.ordersTrend}
          icon={<Package className="h-4 w-4" />}
        />

        <MetricCard
          title="Low Stock Items"
          value={metrics.lowStock}
          description="Products that need reordering"
          trend={metrics.lowStockTrend}
          icon={<AlertTriangle className="h-4 w-4" />}
        />

        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          description="Users active today"
          trend={metrics.usersTrend}
          icon={<Users className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default MetricsOverview;
