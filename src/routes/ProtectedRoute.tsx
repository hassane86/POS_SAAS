import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, loading, needsOnboarding } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOnboardingRoute = location.pathname === "/onboarding";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is Admin and belongs to system company for admin routes
  if (
    isAdminRoute &&
    (user.role !== "admin" ||
      user.company_id !== "00000000-0000-0000-0000-000000000000")
  ) {
    console.log(
      "Access denied: User role is",
      user.role,
      "and company_id is",
      user.company_id,
      "but admin role and system company are required",
    );
    return <Navigate to="/" replace />;
  }

  // Redirect to onboarding if needed
  if (needsOnboarding && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  // Prevent accessing onboarding if not needed
  if (!needsOnboarding && isOnboardingRoute) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
