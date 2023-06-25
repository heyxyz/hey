import { LinearGradient } from 'expo-linear-gradient';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';

import tw from '~/lib/tailwind';
import useMobileStore from '~/store/useMobileStore';

const styles = StyleSheet.create({
  background: tw`flex-1`
});

const Container: FC<PropsWithChildren> = ({ children }) => {
  const setHomeGradientColor = useMobileStore(
    (state) => state.setHomeGradientColor
  );

  const getHeaderColor = () => {
    let hexColorRep = '#000000';
    setHomeGradientColor(hexColorRep);
    return (hexColorRep += '35');
  };

  return (
    <LinearGradient
      colors={[getHeaderColor(), 'transparent']}
      style={styles.background}
      locations={[0, 0.9]}
    >
      {children}
    </LinearGradient>
  );
};

export default Container;
