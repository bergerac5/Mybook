import React from 'react';
import { View } from 'react-native';
import { Switch, Text as PaperText } from 'react-native-paper';
import { useTheme } from '@/components/ThemeContent'; // Adjust the import path accordingly

const SettingsScreen = () => {
    const { theme, toggleTheme } = useTheme(); // Access theme and toggleTheme function

    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: theme === 'dark' ? 'black' : 'white'  }}>
            <PaperText style={{ flex: 1, color: theme === 'dark' ? 'white' : 'black',  }}>Theme</PaperText>
            <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                color="#6200EE" // Customize the color of the switch
            />
        </View>
    );
};

export default SettingsScreen;
