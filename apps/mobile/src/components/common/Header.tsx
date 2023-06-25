import Ionicons from '@expo/vector-icons/Ionicons';
import type { HeaderTitleProps } from '@react-navigation/elements';
import { MotiPressable } from 'moti/interactions';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import tailwind from 'twrnc';

import haptic from '../../helpers/haptic';

const Header: FC<HeaderTitleProps> = () => {
  const animatePress = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => {
        'worklet';
        return { scale: pressed ? 0.9 : 1 };
      },
    []
  );

  return (
    <View style={tailwind`flex flex-row justify-between w-full items-center`}>
      <Text style={tailwind`text-white font-bold text-2xl`}>Gm</Text>
      <View style={tailwind`flex flex-row items-center gap-x-5`}>
        <MotiPressable
          onPress={() => {
            haptic();
          }}
          animate={animatePress}
        >
          <Ionicons
            name="add-circle-outline"
            style={tailwind`text-white`}
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
            style={tailwind`text-white`}
            size={23}
          />
        </MotiPressable>
      </View>
    </View>
  );
};

export default Header;
