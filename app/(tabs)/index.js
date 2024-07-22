import React, { useState, useEffect } from 'react';
import Layout from './layout';
import { ThemeProvider } from '@/components/ThemeContent';
import { Provider as PaperProvider, MD3DarkTheme, DefaultTheme } from 'react-native-paper';
import { getDBConnection, createTable } from '@/components/database';

export default function HomeScreen() {
  const [theme, setTheme] = useState('light'); // State to manage theme

  const themeConfig = theme === 'dark' ? MD3DarkTheme : DefaultTheme;

  // useEffect(() => {
  //   const initDB = async () => {
  //       try {
  //           const db = await getDBConnection();
  //           await createTable(db);
  //       } catch (error) {
  //           console.error('Database initialization failed:', error);
  //       }
  //   };

  //   initDB();
  // }, []);

  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}
