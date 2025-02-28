import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children?: ReactNode;
  sidebarCollapsed?: boolean;
  currentStore?: string;
  stores?: Array<{ id: string; name: string }>;
  userName?: string;
  userAvatar?: string;
  notifications?: Array<{
    id: string;
    title: string;
    description: string;
    read: boolean;
    time: string;
  }>;
  onStoreChange?: (storeId: string) => void;
  onMenuToggle?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarCollapsed = false,
  currentStore = "store1",
  stores = [
    { id: "store1", name: "Main Store" },
    { id: "store2", name: "Downtown Branch" },
    { id: "store3", name: "Mall Kiosk" },
  ],
  userName = "John Doe",
  userAvatar = "",
  notifications = [
    {
      id: "n1",
      title: "Low Stock Alert",
      description: "5 products are running low on stock",
      read: false,
      time: "5 min ago",
    },
    {
      id: "n2",
      title: "New Order",
      description: "Order #1234 has been placed",
      read: false,
      time: "10 min ago",
    },
    {
      id: "n3",
      title: "Payment Received",
      description: "Payment for order #1230 received",
      read: true,
      time: "1 hour ago",
    },
  ],
  onStoreChange = () => {},
  onMenuToggle = () => {},
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const handleMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
    onMenuToggle();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar - hidden on mobile by default */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          stores={stores}
          currentStoreId={currentStore}
          onStoreChange={onStoreChange}
          className="h-full"
        />
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header
          userName={userName}
          userAvatar={userAvatar}
          stores={stores}
          currentStore={currentStore}
          onStoreChange={onStoreChange}
          notifications={notifications}
          onMenuToggle={handleMenuToggle}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
