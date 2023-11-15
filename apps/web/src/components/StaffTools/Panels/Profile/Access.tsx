import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { INTERNAL_WORKER_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import { Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { verifiedMembers } from 'src/store/useAppStore';

const Wrapper = ({
  children,
  title
}: {
  children: ReactNode;
  title: ReactNode;
}) => (
  <span className="flex items-center space-x-2 text-sm">
    <span>{children}</span>
    <span>{title}</span>
  </span>
);

interface RankProps {
  profile: Profile;
}

const Access: FC<RankProps> = ({ profile }) => {
  const [isVerified, setIsVerified] = useState(
    verifiedMembers().includes(profile.id)
  );

  const updateVerified = async () => {
    toast.promise(
      axios.post(
        `${INTERNAL_WORKER_URL}/verified/updateVerified`,
        { enabled: !isVerified },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Updating verified status...',
        success: () => {
          setIsVerified(!isVerified);
          return 'Verified!';
        },
        error: 'Error updating verified status'
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
        <Wrapper title="Verified member">
          <Toggle setOn={updateVerified} on={isVerified} />
        </Wrapper>
      </div>
    </>
  );
};

export default Access;
