import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

const ThemeContext = createContext<{
    isDark: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemScheme = useSystemColorScheme();
    const [theme, setTheme] = useState<ThemeMode>('light');

    useEffect(() => {
        AsyncStorage.getItem('@nuur_theme').then(saved => {
            if (saved === 'light' || saved === 'dark') setTheme(saved);
        });
    }, []);

    const isDark = theme === 'system' ? systemScheme === 'dark' : theme === 'dark';
    const colors = isDark ? Colors.dark : Colors.light;

    const toggleTheme = () => {
        const next = isDark ? 'light' : 'dark';
        setTheme(next);
        AsyncStorage.setItem('@nuur_theme', next);
    };

    return (
        <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};
