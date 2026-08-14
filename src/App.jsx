import { useTheme } from "./hooks/useTheme";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AuthLayout from "./components/auth/AuthLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AppLayout from "./layouts/AppLayout";
import ComplaintWorkspacePage from "./pages/ComplaintWorkspacePage";
import MyComplaintsPage from "./pages/MyComplaintsPage";
import MyPlanPage from "./pages/MyPlanPage";
import NewComplaintPage from "./pages/NewComplaintPage";
import RouterProvider from "./router/RouterProvider";
import { useRouter } from "./router/useRouter";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth";

function getComplaintRouteId(pathname) {
  const match = pathname.match(/^\/complaints\/([^/]+)$/);

  return match?.[1] ?? null;
}

function ProtectedAppRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { navigate } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbf7f5] px-4 py-10 text-sm font-semibold text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300">
        {t("app.common.loading")}
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const { location } = useRouter();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isVerifyEmail = location.pathname === "/verify-email";
  const complaintId = getComplaintRouteId(location.pathname);

  if (isLogin || isRegister || isVerifyEmail) {
    const mode = isRegister ? "register" : "login";

    return (
      <AuthLayout mode={mode}>
        {isLogin ? <LoginPage /> : null}
        {isRegister ? <RegisterPage /> : null}
        {isVerifyEmail ? <VerifyEmailPage /> : null}
      </AuthLayout>
    );
  }

  if (location.pathname === "/complaints") {
    return (
      <ProtectedAppRoute>
        <MyComplaintsPage />
      </ProtectedAppRoute>
    );
  }

  if (location.pathname === "/complaints/new") {
    return (
      <ProtectedAppRoute>
        <NewComplaintPage />
      </ProtectedAppRoute>
    );
  }

  if (complaintId) {
    return (
      <ProtectedAppRoute>
        <ComplaintWorkspacePage complaintId={complaintId} />
      </ProtectedAppRoute>
    );
  }

  if (location.pathname === "/plan") {
    return (
      <ProtectedAppRoute>
        <MyPlanPage />
      </ProtectedAppRoute>
    );
  }

  return <LandingPage />;
}

function App() {
  useTheme();

  return (
    <AuthProvider>
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </AuthProvider>
  );
}

export default App;
