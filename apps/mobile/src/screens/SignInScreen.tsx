import { useNavigation } from '@react-navigation/native';
import type { FC } from 'react';
import React from 'react';
import { Button, Text, View } from 'react-native';

const SignInScreen: FC = () => {
  const { goBack } = useNavigation();

  return (
    <View>
      <Text>This is a modal!</Text>
      <Button onPress={() => goBack()} title="Dismiss" />
    </View>
  );
};

export default SignInScreen;
