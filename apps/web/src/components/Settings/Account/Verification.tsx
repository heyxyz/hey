import type { FC } from 'react';

import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import getNumberOfDaysFromDate from '@hey/lib/datetime/getNumberOfDaysFromDate';
import { Button, Card } from '@hey/ui';
import { Crisp } from 'crisp-sdk-web';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { hydrateVerifiedMembers } from 'src/store/persisted/useVerifiedMembersStore';

const Verification: FC = () => {
  const { currentProfile } = useProfileStore();
  const { verifiedMembers } = hydrateVerifiedMembers();

  if (!currentProfile) {
    return null;
  }

  const hasMetFollowersRequirement =
    (currentProfile.stats.followers || 0) >= 3000;
  const hasMetPublicationsRequirement =
    (currentProfile.stats.publications || 0) >= 50;
  const hasMetTimeRequirement =
    30 < -getNumberOfDaysFromDate(currentProfile?.createdAt);

  const hasAllRequirements =
    hasMetFollowersRequirement &&
    hasMetPublicationsRequirement &&
    hasMetTimeRequirement;

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Verified</div>
      {verifiedMembers.includes(currentProfile?.id) ? (
        <div className="flex items-center space-x-1.5">
          <span>Believe it. Yes, you're really verified.</span>
          <CheckBadgeIcon className="text-brand-500 size-5" />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5">
            {hasMetFollowersRequirement ? (
              <CheckCircleIcon className="size-5" />
            ) : (
              <MinusCircleIcon className="size-5" />
            )}
            <div>
              You have {hasMetFollowersRequirement ? 'met' : 'not met'} the{' '}
              <b>3000 followers</b> requirement.
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            {hasMetPublicationsRequirement ? (
              <CheckCircleIcon className="size-5" />
            ) : (
              <MinusCircleIcon className="size-5" />
            )}
            <div>
              You have {hasMetPublicationsRequirement ? 'met' : 'not met'} the{' '}
              <b>50 publications</b> requirement.
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            {hasMetTimeRequirement ? (
              <CheckCircleIcon className="size-5" />
            ) : (
              <MinusCircleIcon className="size-5" />
            )}
            <div>
              You have {hasMetTimeRequirement ? 'met' : 'not met'} the{' '}
              <b>30 days</b> requirement.
            </div>
          </div>
          <Button
            className="!mt-4"
            disabled={!hasAllRequirements}
            onClick={() => {
              Crisp.chat.show();
              Crisp.message.show('picker', {
                choices: [
                  { label: 'Creator', selected: false, value: 'creator' },
                  {
                    label: 'Journalist',
                    selected: false,
                    value: 'journalist'
                  },
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
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Verification;
