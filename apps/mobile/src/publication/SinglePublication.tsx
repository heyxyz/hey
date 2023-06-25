import type { Publication } from '@lenster/lens';
import type { FC } from 'react';
import { Text, View } from 'react-native';
import tailwind from 'twrnc';
import type { ClassInput } from 'twrnc/dist/esm/types';

interface SinglePublicationProps {
  publication: Publication;
  style?: ClassInput;
}

const SinglePublication: FC<SinglePublicationProps> = ({
  publication,
  style = ''
}) => {
  const { metadata } = publication;
  return (
    <View>
      <View style={tailwind.style('py-1', style)}>
        <Text style={tailwind`text-white font-bold`}>{metadata.content}</Text>
      </View>
    </View>
  );
};

export default SinglePublication;
