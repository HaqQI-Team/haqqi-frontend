import { useTheme } from "./hooks/useTheme";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AuthLayout from "./components/auth/AuthLayout";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminComplaintsPage from "./pages/AdminComplaintsPage";
import AdminDocumentsPage from "./pages/AdminDocumentsPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AppLayout from "./layouts/AppLayout";
import ComplaintWorkspacePage from "./pages/ComplaintWorkspacePage";
import MyComplaintsPage from "./pages/MyComplaintsPage";
import MyPlanPage from "./pages/MyPlanPage";
import NewComplaintPage from "./pages/NewComplaintPage";
import NotFoundPage from "./pages/NotFoundPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PlansPage from "./pages/PlansPage";
import RouterProvider from "./router/RouterProvider";
import { useRouter } from "./router/useRouter";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth";

const complaintIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getComplaintRouteId(pathname) {
  const match = pathname.match(/^\/complaints\/([^/]+)$/);
  const complaintId = match?.[1] ?? "";

  return complaintIdPattern.test(complaintId) ? complaintId : null;
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

function ProtectedAdminRoute({ children }) {
  const { isAdmin, isAuthenticated, isLoading, logout } = useAuth();
  const { navigate } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin/login");
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

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#fbf7f5] px-4 py-10 text-neutral-950 dark:bg-neutral-950 dark:text-white">
        <section className="mx-auto max-w-xl rounded-md border border-red-900/10 bg-white p-6 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
          <h1 className="text-2xl font-extrabold">
            {t("admin.auth.accessDeniedTitle")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {t("admin.auth.permissionDenied")}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-200 px-4 text-sm font-extrabold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
            >
              {t("app.nav.home")}
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/admin/login");
              }}
              className="inline-flex h-11 items-center justify-center rounded-md bg-red-900 px-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600"
            >
              {t("admin.signOut")}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return children;
}

function AppRoutes() {
  const { location } = useRouter();
  const isAdminLogin = location.pathname === "/admin/login";
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isVerifyEmail = location.pathname === "/verify-email";
  const complaintId = getComplaintRouteId(location.pathname);

  if (location.pathname === "/") {
    return <LandingPage />;
  }

  if (isAdminLogin) {
    return <AdminLoginPage />;
  }

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

  if (location.pathname === "/plans") {
    return (
      <ProtectedAppRoute>
        <PlansPage />
      </ProtectedAppRoute>
    );
  }

  if (location.pathname === "/payment/success") {
    return (
      <ProtectedAppRoute>
        <PaymentSuccessPage />
      </ProtectedAppRoute>
    );
  }

  if (location.pathname === "/payment/cancel") {
    return (
      <ProtectedAppRoute>
        <PaymentCancelPage />
      </ProtectedAppRoute>
    );
  }

  if (location.pathname === "/admin/dashboard") {
    return (
      <ProtectedAdminRoute>
        <AdminDashboardPage />
      </ProtectedAdminRoute>
    );
  }

  if (location.pathname === "/admin/complaints") {
    return (
      <ProtectedAdminRoute>
        <AdminComplaintsPage />
      </ProtectedAdminRoute>
    );
  }

  if (location.pathname === "/admin/documents") {
    return (
      <ProtectedAdminRoute>
        <AdminDocumentsPage />
      </ProtectedAdminRoute>
    );
  }

  if (location.pathname === "/admin") {
    return (
      <ProtectedAdminRoute>
        <AdminPage />
      </ProtectedAdminRoute>
    );
  }

  return <NotFoundPage />;
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
