import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { hydrateVerifiedMembers } from 'src/store/persisted/useVerifiedMembersStore';

import ToggleWrapper from '../ToggleWrapper';

interface VerifyProps {
  profile: Profile;
}

const Verify: FC<VerifyProps> = ({ profile }) => {
  const { verifiedMembers } = hydrateVerifiedMembers();
  const [isVerified, setIsVerified] = useState(
    verifiedMembers.includes(profile.id)
  );

  const updateVerified = async () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/verified/updateVerified`,
        { enabled: !isVerified, id: profile.id },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: 'Error updating verified status',
        loading: 'Updating verified status...',
        success: () => {
          setIsVerified(!isVerified);
          return 'Verified status updated';
        }
      }
    );
  };

  return (
    <ToggleWrapper title="Verified member">
      <Toggle on={isVerified} setOn={updateVerified} />
    </ToggleWrapper>
  );
};

export default Verify;
