import { useNavigation } from '@react-navigation/native';
import type { FC } from 'react';
import React from 'react';
import { Button, Text, View } from 'react-native';

const SignInScreen: FC = () => {
  const { goBack } = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => goBack()} title="Dismiss" />
    </View>
  );
};

export default SignInScreen;
