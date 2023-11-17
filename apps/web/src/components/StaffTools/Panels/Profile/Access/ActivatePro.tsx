import { HEY_API_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import { Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import ToggleWrapper from '../ToggleWrapper';

interface ActivateProProps {
  profile: Profile;
}

const ActivatePro: FC<ActivateProProps> = ({ profile }) => {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProEnabled = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/pro/getProEnabled`, {
        params: { id: profile.id }
      });
      const { data } = response;
      setIsPro(data?.enabled || false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useQuery({
    queryKey: ['fetchProEnabled', profile.id || ''],
    queryFn: fetchProEnabled
  });

  const updatePro = async () => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/pro/activateLifetimePro`,
        { id: profile.id, enabled: !isPro },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        loading: 'Updating pro status...',
        success: () => {
          setIsPro(!isPro);
          return 'Pro status updated';
        },
        error: 'Error updating pro status'
      }
    );
  };

  return (
    <ToggleWrapper title="Activate Pro">
      <Toggle setOn={updatePro} on={isPro} />
    </ToggleWrapper>
  );
};

export default ActivatePro;
