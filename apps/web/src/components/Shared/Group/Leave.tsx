import type { Group } from '@hey/types/hey';
import type { FC } from 'react';

import { MinusIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { HEY_API_URL } from '@hey/data/constants';
import { GROUP } from '@hey/data/tracking';
import { Button, Spinner } from '@hey/ui';
import errorToast from '@lib/errorToast';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface LeaveProps {
  group: Group;
  onLeave?: () => void;
}

const Leave: FC<LeaveProps> = ({ group, onLeave }) => {
  const { pathname } = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { isSuspended } = useProfileRestriction();
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const [isLoading, setIsLoading] = useState(false);

  const onCompleted = () => {
    onLeave?.();
    setIsLoading(false);
    toast.success('Left successfully');
    Leafwatch.track(GROUP.LEAVE, { path: pathname, target: group.id });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const leaveGroup = async () => {
    if (!currentProfile) {
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${HEY_API_URL}/groups/leave`,
        { id: group.id },
        { headers: getAuthApiHeaders() }
      );

      if (data.success) {
        return onCompleted();
      }

      return toast.error(Errors.SomethingWentWrong);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Button
      aria-label="Leave"
      className="!px-3 !py-1.5 text-sm"
      disabled={isLoading}
      icon={
        isLoading ? <Spinner size="xs" /> : <MinusIcon className="size-4" />
      }
      onClick={leaveGroup}
      outline
    >
      Leave
    </Button>
  );
};

export default Leave;
