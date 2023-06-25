import React from 'react';
import { View } from 'react-native';

import tw from '../../helpers/tailwind';

const Divider = () => {
  return <View style={tw`border-b border-gray-800`} />;
};

export default Divider;
