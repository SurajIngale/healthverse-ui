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
  background: ['#1a1a1a', '#252525', '#303030'],
  containerBg: '#1a1a1a',
  cardBg: 'rgba(40, 40, 40, 0.8)',
  cardBorder: 'rgba(100, 100, 100, 0.2)',
  text: '#f5f5f5',
  textSecondary: '#d4d4d4',
  textTertiary: '#a3a3a3',
  iconButton: 'rgba(40, 40, 40, 0.8)',
  iconButtonBorder: 'rgba(115, 115, 115, 0.3)',
  navBg: 'rgba(40, 40, 40, 0.95)',
  navInactive: 'rgba(60, 60, 60, 0.8)',
};
