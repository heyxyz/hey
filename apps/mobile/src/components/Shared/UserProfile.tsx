import type { Profile } from '@lenster/lens';
import getAvatar from '@lenster/lib/getAvatar';
import { Image } from 'expo-image';
import type { FC } from 'react';
import { memo } from 'react';
import { Text, View } from 'react-native';

import tw from '~/lib/tailwind';

const styles = {
  name: tw.style('text-white font-bold', {
    fontFamily: 'circular-medium'
  }),
  slug: tw.style('text-white text-xs', {
    fontFamily: 'circular-medium'
  })
};

interface UserProfileProps {
  profile: Profile;
}

const UserProfile: FC<UserProfileProps> = ({ profile }) => {
  return (
    <View style={tw`flex-row items-center gap-x-2`}>
      <Image
        source={{ uri: getAvatar(profile) }}
        style={tw`w-8 h-8 rounded-full`}
      />
      <View>
        <Text style={styles.name}>{profile.name ?? profile.handle}</Text>
        <Text style={styles.slug}>@{profile.handle}</Text>
      </View>
    </View>
  );
};

export default memo(UserProfile);
