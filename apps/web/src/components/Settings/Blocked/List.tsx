import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from '@hey/lens';
import type { FC } from 'react';

interface ListProps {
  profiles?: Profile[];
}

const List: FC<ListProps> = ({ profiles }) => {
  if (!profiles) {
    return null;
  }

  return (
    <div className="space-y-5 px-5 pb-5">
      {profiles.map((profile) => (
        <div key={profile.id}>
          <UserProfile profile={profile} showFollow />
        </div>
      ))}
    </div>
  );
};

export default List;
