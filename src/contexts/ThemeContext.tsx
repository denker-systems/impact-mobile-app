import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>((colorScheme as ThemeMode) || 'light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        let savedMode: string | null = null;
        if (Platform.OS === 'web') {
          savedMode = localStorage.getItem('app_theme_mode');
        } else {
          savedMode = await SecureStore.getItemAsync('app_theme_mode');
        }

        if (savedMode === 'light' || savedMode === 'dark') {
          setModeState(savedMode);
          setColorScheme(savedMode);
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      }
    };
    loadTheme();
  }, [setColorScheme]);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    setColorScheme(newMode);
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('app_theme_mode', newMode);
      } else {
        await SecureStore.setItemAsync('app_theme_mode', newMode);
      }
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
