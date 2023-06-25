import { LinearGradient } from 'expo-linear-gradient';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '../../constants/theme';
import useMobileStore from '../../store';

const styles = StyleSheet.create({
  background: {
    flex: 1
  }
});

const hexCharacters = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  'A',
  'B',
  'C',
  'D',
  'E',
  'F'
];

const Container: FC<PropsWithChildren> = ({ children }) => {
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor);
  const setHomeGradientColor = useMobileStore(
    (state) => state.setHomeGradientColor
  );

  const generateJustOneColor = () => {
    if (homeGradientColor !== theme.colors.black) {
      return `${homeGradientColor}35`;
    }
    let hexColorRep = '#';
    for (let index = 0; index < 6; index++) {
      const randomPosition = Math.floor(Math.random() * hexCharacters.length);
      hexColorRep += hexCharacters[randomPosition];
    }
    setHomeGradientColor(hexColorRep);
    return (hexColorRep += '35');
  };

  return (
    <LinearGradient
      colors={[generateJustOneColor(), 'transparent']}
      // start={{ x: 1, y: 0.2 }}
      style={styles.background}
      locations={[0, 0.9]}
    >
      {children}
    </LinearGradient>
  );
};

export default Container;
