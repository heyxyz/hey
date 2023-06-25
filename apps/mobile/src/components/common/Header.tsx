import Ionicons from '@expo/vector-icons/Ionicons';
import type { HeaderTitleProps } from '@react-navigation/elements';
import { Image as ExpoImage } from 'expo-image';
import { MotiPressable } from 'moti/interactions';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';
import haptic from '../../helpers/haptic';
import normalizeFont from '../../helpers/normalize-font';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rightView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  forYouText: {
    color: theme.colors.primary,
    fontFamily: 'font-bold',
    fontWeight: '500',
    fontSize: normalizeFont(18)
  }
});

const Header: FC<HeaderTitleProps> = () => {
  const animatePress = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => {
        'worklet';
        return {
          scale: pressed ? 0.9 : 1
        };
      },
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.forYouText}>Gm</Text>
      <View style={styles.rightView}>
        <MotiPressable
          onPress={() => {
            haptic();
          }}
          animate={animatePress}
        >
          <Ionicons
            name="add-circle-outline"
            color={theme.colors.white}
            size={25}
          />
        </MotiPressable>
        <MotiPressable
          onPress={() => {
            haptic();
          }}
          animate={animatePress}
        >
          <Ionicons
            name="notifications-outline"
            color={theme.colors.white}
            size={23}
          />
        </MotiPressable>
        <MotiPressable
          onPress={() => {
            haptic();
          }}
          animate={animatePress}
        >
          <ExpoImage
            source={require('assets/icons/herb.png')}
            contentFit="cover"
            style={{ width: 23, height: 23, borderRadius: 8 }}
          />
        </MotiPressable>
      </View>
    </View>
  );
};

export default Header;
