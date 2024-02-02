import type { Group } from '@hey/types/hey';
import type { FC } from 'react';

import Favorite from '@components/Shared/Group/Favorite';
import Join from '@components/Shared/Group/Join';
import Leave from '@components/Shared/Group/Leave';
import Unfavorite from '@components/Shared/Group/Unfavorite';
import humanize from '@hey/lib/humanize';
import plur from 'plur';
import { useEffect, useState } from 'react';

interface MembershipProps {
  group: Group;
}

const Membership: FC<MembershipProps> = ({ group }) => {
  const [count, setCount] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);
  const [hasFavorited, setHasFavorited] = useState(false);

  useEffect(() => {
    setCount(group.members);
    setHasJoined(group.isMember);
    setHasFavorited(group.hasFavorited);
  }, [group]);

  return (
    <div className="space-y-5">
      <div className="text-left">
        <div className="text-xl">{humanize(count)}</div>
        <div className="ld-text-gray-500">{plur('Member', count)}</div>
      </div>
      <div className="space-x-3">
        {hasJoined ? (
          <Leave
            group={group}
            onLeave={() => {
              setCount(count - 1);
              setHasJoined(false);
              setHasFavorited(false);
            }}
          />
        ) : (
          <Join
            group={group}
            onJoin={() => {
              setCount(count + 1);
              setHasJoined(true);
            }}
          />
        )}
        {hasJoined ? (
          hasFavorited ? (
            <Unfavorite
              group={group}
              onUnfavorite={() => setHasFavorited(false)}
            />
          ) : (
            <Favorite group={group} onFavorite={() => setHasFavorited(true)} />
          )
        ) : null}
      </div>
    </div>
  );
};

export default Membership;
