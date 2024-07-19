import React, { useState } from 'react';
import Layout from './layout';
import { ThemeProvider } from '@/components/ThemeContent';
import { Provider as PaperProvider, MD3DarkTheme, DefaultTheme } from 'react-native-paper';

export default function HomeScreen() {
  const [theme, setTheme] = useState('light'); // State to manage theme

  const themeConfig = theme === 'dark' ? MD3DarkTheme : DefaultTheme;

  return (
    <ThemeProvider>
    <Layout />
  </ThemeProvider>
  );
}
