import { DefaultTheme as PaperDefaultTheme } from 'react-native-paper';

const PaperDarkTheme = {
    ...PaperDefaultTheme,
    dark: true,
    colors: {
        ...PaperDefaultTheme.colors,
        primary: '#bb86fc',
        background: '#121212',
        surface: '#121212',
        accent: '#03dac6',
        error: '#cf6679',
        text: '#ffffff',
        onSurface: '#ffffff',
        disabled: 'rgba(255, 255, 255, 0.38)',
        placeholder: 'rgba(255, 255, 255, 0.38)',
        backdrop: 'rgba(255, 255, 255, 0.5)',
    },
};

const CustomDarkTheme = {
    ...PaperDarkTheme,
    colors: {
        ...PaperDarkTheme.colors,
        background: '#000000',
        text: '#ffffff',
    },
};

const CustomDefaultTheme = {
    ...PaperDefaultTheme,
    colors: {
        ...PaperDefaultTheme.colors,
        background: '#ffffff',
        text: '#000000',
    },
};

export { CustomDarkTheme, CustomDefaultTheme };
