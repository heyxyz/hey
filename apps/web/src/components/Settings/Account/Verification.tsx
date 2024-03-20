import type { FC } from 'react';

import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { Card } from '@hey/ui';
import { Crisp } from 'crisp-sdk-web';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { hydrateVerifiedMembers } from 'src/store/persisted/useVerifiedMembersStore';

const Verification: FC = () => {
  const { currentProfile } = useProfileStore();
  const { verifiedMembers } = hydrateVerifiedMembers();

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Verified</div>
      {verifiedMembers.includes(currentProfile?.id) ? (
        <div className="flex items-center space-x-1.5">
          <span>Believe it. Yes, you're really verified.</span>
          <CheckBadgeIcon className="text-brand-500 size-5" />
        </div>
      ) : (
        <div className="linkify-button">
          <span>No. </span>
          <button
            onClick={() => {
              Crisp.chat.show();
              Crisp.message.show('picker', {
                choices: [
                  { label: 'Creator', selected: false, value: 'creator' },
                  { label: 'Journalist', selected: false, value: 'journalist' },
                  {
                    label: 'Public Figure',
                    selected: false,
                    value: 'public-figure'
                  },
                  { label: 'Other', selected: false, value: 'other' }
                ],
                id: 'verification-request',
                text: 'Hi, why do you think you should be verified? And tell us more about yourself.'
              });
            }}
          >
            Request for profile verification
          </button>
        </div>
      )}
    </Card>
  );
};

export default Verification;
