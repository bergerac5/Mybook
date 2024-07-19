import React, { createContext, useContext, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { CustomDarkTheme, CustomDefaultTheme } from '@/components/Theme'; 

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // Default theme is 'light'

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        // Optionally, you can store theme preference in AsyncStorage here
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <PaperProvider theme={theme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
                {children}
            </PaperProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
