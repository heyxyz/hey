import Ionicons from '@expo/vector-icons/Ionicons';
import type { HeaderTitleProps } from '@react-navigation/elements';
import { MotiPressable } from 'moti/interactions';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import haptic from '../../helpers/haptic';
import tw from '../../helpers/tailwind';

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
    <View style={tw`flex flex-row justify-between w-full items-center`}>
      <Text style={tw`text-white font-bold text-2xl`}>Gm</Text>
      <View style={tw`flex flex-row items-center gap-x-5`}>
        <MotiPressable
          onPress={() => {
            haptic();
          }}
          animate={animatePress}
        >
          <Ionicons
            name="add-circle-outline"
            style={tw`text-white`}
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
            style={tw`text-white`}
            size={23}
          />
        </MotiPressable>
      </View>
    </View>
  );
};

export default Header;
