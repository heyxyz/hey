import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { PREFERENCES_WORKER_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import { Spinner, Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import ToggleWrapper from './ToggleWrapper';

enum Type {
  VERIFIED = 'VERIFIED',
  STAFF = 'STAFF',
  GARDENER = 'GARDENER',
  TUSTED_MEMBER = 'TUSTED_MEMBER'
}

type AccessType = keyof typeof Type;

interface RankProps {
  profile: Profile;
}

const Access: FC<RankProps> = ({ profile }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isGardener, setIsGardener] = useState(false);
  const [isLensMember, setIsLensMember] = useState(false);

  const getPreferences = async () => {
    try {
      const response = await axios.get(
        `${PREFERENCES_WORKER_URL}/getPreferences`,
        { params: { id: profile.id } }
      );
      const { data } = response;

      setIsVerified(data.result?.is_verified || false);
      setIsStaff(data.result?.is_staff || false);
      setIsGardener(data.result?.is_gardener || false);
      setIsLensMember(data.result?.is_lens_member || false);

      return data.success;
    } catch (error) {
      return false;
    }
  };

  const { data: preferences } = useQuery({
    queryKey: ['getPreferences', profile.id],
    queryFn: getPreferences,
    enabled: Boolean(profile.id)
  });

  const staffUpdatePreferences = async (type: AccessType) => {
    toast.promise(
      axios.post(
        `${PREFERENCES_WORKER_URL}/updatePreferences`,
        {
          ...(type === Type.VERIFIED && { isVerified: !isVerified }),
          ...(type === Type.STAFF && { isStaff: !isStaff }),
          ...(type === Type.GARDENER && { isGardener: !isGardener }),
          ...(type === Type.TUSTED_MEMBER && {
            isLensMember: !isLensMember
          }),
          updateByAdmin: true
        },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Updating access...',
        success: () => {
          if (type === Type.VERIFIED) {
            setIsVerified(!isVerified);
          } else if (type === Type.STAFF) {
            setIsStaff(!isStaff);
          } else if (type === Type.GARDENER) {
            setIsGardener(!isGardener);
          } else if (type === Type.TUSTED_MEMBER) {
            setIsLensMember(!isLensMember);
          }

          return 'Access updated';
        },
        error: 'Error updating access'
      }
    );
  };

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <AdjustmentsVerticalIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Access</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        {preferences ? (
          <ToggleWrapper title="Verified member">
            <Toggle
              setOn={() => staffUpdatePreferences(Type.VERIFIED)}
              on={isVerified}
            />
          </ToggleWrapper>
        ) : (
          <ToggleWrapper title="Verified member">
            <Spinner size="xs" />
          </ToggleWrapper>
        )}
        {preferences ? (
          <ToggleWrapper title="Staff member">
            <Toggle
              setOn={() => staffUpdatePreferences(Type.STAFF)}
              on={isStaff}
            />
          </ToggleWrapper>
        ) : (
          <ToggleWrapper title="Staff member">
            <Spinner size="xs" />
          </ToggleWrapper>
        )}
        {preferences ? (
          <ToggleWrapper title="Gardener member">
            <Toggle
              setOn={() => staffUpdatePreferences(Type.GARDENER)}
              on={isGardener}
            />
          </ToggleWrapper>
        ) : (
          <ToggleWrapper title="Gardener member">
            <Spinner size="xs" />
          </ToggleWrapper>
        )}
        {preferences ? (
          <ToggleWrapper title="Lens Team member">
            <Toggle
              setOn={() => staffUpdatePreferences(Type.TUSTED_MEMBER)}
              on={isLensMember}
            />
          </ToggleWrapper>
        ) : (
          <ToggleWrapper title="Trusted member">
            <Spinner size="xs" />
          </ToggleWrapper>
        )}
      </div>
    </>
  );
};

export default Access;
