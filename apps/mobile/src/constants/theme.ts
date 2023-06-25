import type { Theme } from '@react-navigation/native';

const commonColors = {
  primary: '#ffffff',
  secondary: '#ffffff90',
  background: '#000000',
  border: '#000',
  card: '#fff',
  notification: '#000',
  black: '#000000',
  white: '#fff'
};

export const theme = {
  colors: commonColors,
  shadows: {
    inputShadow: {
      shadowOffset: { width: 0, height: 2 },
      shadowColor: commonColors.primary,
      shadowOpacity: 0.16,
      elevation: 3
    }
  }
};

export const navigationTheme: Theme = {
  colors: {
    background: '#000000',
    border: '#000000',
    card: '#111827',
    notification: 'red',
    primary: '#fff',
    text: '#fff'
  },
  dark: true
};
