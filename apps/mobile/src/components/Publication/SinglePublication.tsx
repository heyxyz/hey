import UserProfile from '@components/Shared/UserProfile';
import type { Publication } from '@lenster/lens';
import tw from '@lib/tailwind';
import type { FC } from 'react';
import { Text, View } from 'react-native';
import type { ClassInput } from 'twrnc/dist/esm/types';

const styles = {
  content: tw.style('text-white font-bold text-md leading-6', {
    fontFamily: 'circular-medium'
  })
};

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
    <View style={tw.style('py-1 gap-y-3', style)}>
      <UserProfile profile={publication.profile} />
      <Text style={styles.content}>{metadata.content}</Text>
    </View>
  );
};

export default SinglePublication;
