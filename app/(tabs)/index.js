import React, { useState, useEffect } from 'react';
import Layout from './layout';
import { ThemeProvider } from '@/components/ThemeContent';
import { Provider as PaperProvider, MD3DarkTheme, DefaultTheme } from 'react-native-paper';
import { Provider as ReduxProvider } from "react-redux";
import store from "@/components/redux/store"
import LightControl from './lightControl'
import MotionDetector from './motionDetector'

export default function HomeScreen() {
  const [theme, setTheme] = useState('light'); // State to manage theme

  const themeConfig = theme === 'dark' ? MD3DarkTheme : DefaultTheme;


  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <Layout />
         <LightControl /> 
        <MotionDetector/>
      </ThemeProvider>
    </ReduxProvider>
  );
}
