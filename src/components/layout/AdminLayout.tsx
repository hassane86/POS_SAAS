import React, { ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  useEffect(() => {
    // Check if user is Admin and belongs to system company
    if (
      user &&
      (user.role !== "admin" ||
        user.company_id !== "00000000-0000-0000-0000-000000000000")
    ) {
      console.log(
        "Redirecting: User does not have admin role or does not belong to system company",
      );
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800"
              onClick={() => navigate("/admin")}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800"
              onClick={() => navigate("/admin/companies")}
            >
              <Building2 className="mr-3 h-5 w-5" />
              Companies
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800"
              onClick={() => navigate("/admin/users")}
            >
              <Users className="mr-3 h-5 w-5" />
              Users
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800"
              onClick={() => navigate("/admin/settings")}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Button>
          </div>

          <div className="absolute bottom-4 left-0 w-full px-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              Go to POS
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
