import type { Profile } from '@hey/lens';

import SmallUserProfile from '@components/Shared/SmallUserProfile';
import UserProfile from '@components/Shared/UserProfile';
import { Card, CardHeader } from '@hey/ui';
import { type FC } from 'react';

const Profiles: FC = () => {
  const profile = {
    handle: { localName: 'yoginth' },
    id: '0x0d',
    metadata: {
      bio: 'creator of @lens/hey 🌸 // $bonsai early supporter // fighting for human privacy 🛡️ // opinions are mine // swiftie // he/him',
      displayName: 'Yoginth',
      picture: {
        optimized: {
          uri: 'https://ik.imagekit.io/lens/media-snapshot/29e4fa02ae65d97c0ff04a023de02a3a4e4cccd7200b5ea3be0503296ebce0ce.png'
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader title="Profiles" />
      <div className="m-5 space-y-5">
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Profile</h2>
          <UserProfile profile={profile as Profile} />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Profile with ID</h2>
          <UserProfile profile={profile as Profile} showId />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Profile with Bio</h2>
          <UserProfile profile={profile as Profile} showBio />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Profile with Timestamp</h2>
          <UserProfile
            profile={profile as Profile}
            timestamp={new Date('2024-06-29T19:16:26.062Z')}
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Big Profile</h2>
          <UserProfile isBig profile={profile as Profile} />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Small Profile</h2>
          <SmallUserProfile profile={profile as Profile} />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Small Profile with Slug</h2>
          <SmallUserProfile hideSlug profile={profile as Profile} />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Small Profile with timestamp</h2>
          <SmallUserProfile
            profile={profile as Profile}
            timestamp={new Date('2024-06-29T19:16:26.062Z')}
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Small Profile with small avatar</h2>
          <SmallUserProfile profile={profile as Profile} smallAvatar />
        </div>
      </div>
    </Card>
  );
};

export default Profiles;
