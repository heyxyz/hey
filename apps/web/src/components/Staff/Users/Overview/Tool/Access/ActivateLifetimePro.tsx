import { HEY_API_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import { Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUpdateEffect } from 'usehooks-ts';

import ToggleWrapper from '../ToggleWrapper';

interface ActivateLifetimeProProps {
  profile: Profile;
  isPro: boolean;
}

const ActivateLifetimePro: FC<ActivateLifetimeProProps> = ({
  profile,
  isPro: enabled
}) => {
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useUpdateEffect(() => {
    setIsPro(enabled);
  }, [enabled]);

  const updatePro = async () => {
    setLoading(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/pro/activatePro`,
        { id: profile.id, enabled: !isPro, trial: false },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Updating pro status...',
        success: () => {
          setIsPro(!isPro);
          setLoading(false);
          return 'Pro status updated';
        },
        error: () => {
          setLoading(false);
          return 'Error updating pro status';
        }
      }
    );
  };

  return (
    <ToggleWrapper title="Activate Lifetime Pro">
      <Toggle setOn={updatePro} on={isPro} disabled={loading} />
    </ToggleWrapper>
  );
};

export default ActivateLifetimePro;
