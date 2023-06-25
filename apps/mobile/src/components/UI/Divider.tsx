import React from 'react';
import { View } from 'react-native';

import tw from '~/lib/tailwind';

const Divider = () => {
  return <View style={tw`border-b border-gray-800`} />;
};

export default Divider;
