import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from '@/hooks/use-color-scheme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleDark: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [theme, setTheme] = useState<ThemeMode>(
    (systemColorScheme === 'dark' ? 'dark' : 'light') as ThemeMode
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleDark: () => setTheme(current => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
