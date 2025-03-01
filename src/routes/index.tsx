import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import SalesInterface from "@/components/sales/SalesInterface";
import InventoryManagement from "@/components/inventory/InventoryManagement";
import UserManagement from "@/components/users/UserManagement";
import TransactionHistory from "@/components/transactions/TransactionHistory";
import TransactionDetail from "@/components/transactions/TransactionDetail";
import SubscriptionManager from "@/components/subscription/SubscriptionManager";
import CustomerManagement from "@/components/customers/CustomerManagement";
import CustomerDetail from "@/components/customers/CustomerDetail";
import StoreManagement from "@/components/stores/StoreManagement";
import StoreDetail from "@/components/stores/StoreDetail";
import SettingsPage from "@/components/settings/SettingsPage";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import CompanyList from "@/components/admin/CompanyList";
import CompanyDetail from "@/components/admin/CompanyDetail";
import AdminUserList from "@/components/admin/AdminUserList";
import LoginForm from "@/components/auth/LoginForm";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardContent />,
      },
      {
        path: "sales",
        element: <SalesInterface />,
      },
      {
        path: "inventory",
        element: <InventoryManagement />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "customers",
        element: <CustomerManagement />,
      },
      {
        path: "customers/:id",
        element: <CustomerDetail />,
      },
      {
        path: "stores",
        element: <StoreManagement />,
      },
      {
        path: "stores/:id",
        element: <StoreDetail />,
      },
      {
        path: "transactions",
        element: <TransactionHistory />,
      },
      {
        path: "transactions/:id",
        element: <TransactionDetail />,
      },
      {
        path: "subscription",
        element: <SubscriptionManager />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <OnboardingWizard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "companies",
        element: <CompanyList />,
      },
      {
        path: "companies/:id",
        element: <CompanyDetail />,
      },
      {
        path: "users",
        element: <AdminUserList />,
      },
      {
        path: "settings",
        element: <div>Admin Settings</div>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
