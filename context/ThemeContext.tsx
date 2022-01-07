import { useLocalStorage } from "hooks/useSessionStorage";
import React, { useContext, useState, useEffect } from "react";

type ThemeContext = {
  currentTheme?: string;
  setCurrentTheme?: (theme: string) => void;
};

const ThemeContext = React.createContext<ThemeContext>({});

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage(
    "currentTheme",
    "light"
  );

  useEffect(() => {
    document.body.classList.add(currentTheme);

    return () => {
      document.body.classList.remove(currentTheme);
    };
  }, [currentTheme]);

  const value = {
    currentTheme,
    setCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}
