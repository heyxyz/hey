import { UsersIcon } from '@heroicons/react/outline';
import humanize from '@lenster/lib/humanize';
import type { Community } from '@lenster/types/communities';
import { Modal } from '@lenster/ui';
import { Plural, t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';

import MembersList from './List';

interface MembersProps {
  community: Community;
}

const Members: FC<MembersProps> = ({ community }) => {
  const [showMembersModal, setShowMembersModal] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="text-left"
        onClick={() => {
          setShowMembersModal(!showMembersModal);
        }}
      >
        <div className="text-xl">
          {humanize(community?.members_count as number)}
        </div>
        <div className="lt-text-gray-500">
          <Plural
            value={community?.members_count as number}
            zero="Member"
            one="Member"
            other="Members"
          />
        </div>
      </button>
      <Modal
        title={t`Members`}
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showMembersModal}
        onClose={() => setShowMembersModal(false)}
      >
        <MembersList community={community} />
      </Modal>
    </div>
  );
};

export default Members;
