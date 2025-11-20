import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const lightTheme = {
  background: ['#E0F2FF', '#F0F9FF', '#FFFFFF'],
  containerBg: '#E0F2FF',
  cardBg: 'rgba(255, 255, 255, 0.7)',
  cardBorder: 'rgba(59, 130, 246, 0.1)',
  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  iconButton: 'rgba(255, 255, 255, 0.7)',
  iconButtonBorder: 'rgba(59, 130, 246, 0.2)',
  navBg: 'rgba(255, 255, 255, 0.95)',
  navInactive: 'rgba(241, 245, 249, 0.8)',
};

export const darkTheme = {
  background: ['#1a1f2e', '#252d3d', '#2d3748'],
  containerBg: '#1a1f2e',
  cardBg: 'rgba(22, 27, 34, 0.9)',
  cardBorder: 'rgba(48, 161, 224, 0.25)',
  text: '#ffffff',
  textSecondary: '#e6edf3',
  textTertiary: '#8b949e',
  iconButton: 'rgba(30, 161, 224, 0.15)',
  iconButtonBorder: 'rgba(48, 161, 224, 0.3)',
  navBg: 'rgba(22, 27, 34, 0.95)',
  navInactive: 'rgba(39, 47, 57, 0.8)',
};
