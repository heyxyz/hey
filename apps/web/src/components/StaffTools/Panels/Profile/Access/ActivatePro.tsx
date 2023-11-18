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
      setLoading(true);
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

export default ActivatePro;
