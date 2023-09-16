import humanize from '@lenster/lib/humanize';
import type { Channel } from '@lenster/types/lenster';
import { Plural } from '@lingui/macro';
import type { FC } from 'react';

interface MembersProps {
  channel: Channel;
}

const Members: FC<MembersProps> = ({ channel }) => {
  const count = channel?.members[0]?.count;

  return (
    <div className="text-left">
      <div className="text-xl">{humanize(count)}</div>
      <div className="lt-text-gray-500">
        <Plural value={count} zero="Member" one="Member" other="Members" />
      </div>
    </div>
  );
};

export default Members;
