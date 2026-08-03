import { useEffect, useState } from "react";

const THEME_KEY = "haqqi-theme";
const DEFAULT_THEME = "light";
const themes = ["light", "dark"];

function getInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);

  return themes.includes(storedTheme) ? storedTheme : DEFAULT_THEME;
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }, [theme]);

  function setTheme(nextTheme) {
    if (themes.includes(nextTheme)) {
      setThemeState(nextTheme);
    }
  }

  function toggleTheme() {
    setThemeState((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
  };
}
