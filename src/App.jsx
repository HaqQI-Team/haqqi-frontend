import { useTheme } from "./hooks/useTheme";
import LandingPage from "./pages/LandingPage";

function App() {
  useTheme();

  return <LandingPage />;
}

export default App;
