import React from "react";
import MetricsOverview from "./MetricsOverview";
import RecentTransactions from "./RecentTransactions";
import QuickActions from "./QuickActions";

interface DashboardContentProps {
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
  transactions?: Array<{
    id: string;
    date: string;
    customer: string;
    amount: number;
    items: number;
    status: "completed" | "pending" | "failed";
  }>;
  quickActions?: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }>;
}

const DashboardContent = ({
  metrics,
  transactions,
  quickActions,
}: DashboardContentProps) => {
  return (
    <div className="w-full h-full bg-gray-100 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your business performance and recent activity.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <select className="bg-white border rounded-md px-3 py-2 text-sm">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Metrics Overview Section */}
        <section>
          <MetricsOverview metrics={metrics} />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions Section - Takes up 2/3 of the grid on large screens */}
          <div className="lg:col-span-2">
            <RecentTransactions transactions={transactions} />
          </div>

          {/* Quick Actions Section - Takes up 1/3 of the grid on large screens */}
          <div>
            <QuickActions actions={quickActions} />
          </div>
        </div>

        {/* Additional Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales Trends Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Sales Trends</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded border">
              <p className="text-muted-foreground">
                Sales chart will be displayed here
              </p>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                    <div>
                      <p className="font-medium">Product {item}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU-{1000 + item}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(Math.random() * 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 50)} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
