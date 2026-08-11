import { useTheme } from "./hooks/useTheme";
import AuthLayout from "./components/auth/AuthLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RouterProvider from "./router/RouterProvider";
import { useRouter } from "./router/useRouter";
import { AuthProvider } from "./context/AuthContext.jsx";

function AppRoutes() {
  const { location } = useRouter();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  if (isLogin || isRegister) {
    const mode = isLogin ? "login" : "register";

    return (
      <AuthLayout mode={mode}>
        {isLogin ? <LoginPage /> : <RegisterPage />}
      </AuthLayout>
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
