import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeMode;
    toggleTheme: () => void;
    colors: typeof lightColors;
}

const lightColors = {
    primary: '#FAF8F5',
    white: '#fff',
    lightWhite: '#EBEBEB80',
    brown: '#3cb371',
    blue: '#284CFF',
    lightBlue: '#284CFF1A',
    lightgray: '#A09CAB',
    blueAccent: '#448AFF',
    black: '#000',
    gray: '#9e9e9e',
    green: '#22C55E',
    red: '#F04438',
    orange: '#F97316',
    purple: '#8B5CF6',
    lightGreen: '#22C55E1A',
    lightOrange: '#F973161A',
    lightPurple: '#8B5CF61A',
    lightRed: '#F044381A',
    gradientStart: '#3cb371',
    gradientEnd: '#2d9d5f',
    gradientColors: ['#3cb371', 'rgba(60, 179, 113, 0.9)', 'rgba(60, 179, 113, 0.7)'],
    drawerGradient: ['#c6f6d5', '#d4f5e0', '#e8f5ec'],
};

const darkColors = {
    primary: '#1a1a1a',
    white: '#ffffff',
    lightWhite: '#EBEBEB40',
    brown: '#3a9d66',
    blue: '#284CFF',
    lightBlue: '#284CFF1A',
    lightgray: '#A09CAB',
    blueAccent: '#448AFF',
    black: '#ffffff',
    gray: '#9e9e9e',
    green: '#22C55E',
    red: '#F04438',
    orange: '#F97316',
    purple: '#8B5CF6',
    lightGreen: '#22C55E1A',
    lightOrange: '#F973161A',
    lightPurple: '#8B5CF61A',
    lightRed: '#F044381A',
    gradientStart: 'rgba(58, 157, 102, 0.9)',
    gradientEnd: 'rgba(6, 78, 59, 0.8)',
    gradientColors: ['rgba(58, 157, 102, 0.9)', 'rgba(58, 157, 102, 0.7)', 'rgba(6, 78, 59, 0.8)'],
    drawerGradient: ['#064e3b', 'rgba(6, 78, 59, 0.9)', 'rgba(6, 78, 59, 0.7)'],
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeMode>('light');

    useEffect(() => {
        // Load theme from storage on mount
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setTheme(savedTheme);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const colors = theme === 'light' ? lightColors : darkColors;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

