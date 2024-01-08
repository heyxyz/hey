import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import ToggleWrapper from '../ToggleWrapper';

interface TrustedProps {
  isTrusted: boolean;
  profileId: string;
}

const Trusted: FC<TrustedProps> = ({ isTrusted: enabled, profileId }) => {
  const [disabled, setDisabled] = useState(false);
  const [isTrusted, setIsTrusted] = useState(false);

  useEffect(() => {
    setIsTrusted(enabled);
  }, [enabled]);

  const updateTrusted = async () => {
    setDisabled(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/trusted/update`,
        { enabled: !isTrusted, id: profileId },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: () => {
          setDisabled(false);
          return 'Error updating trusted status';
        },
        loading: 'Updating trusted status...',
        success: () => {
          setIsTrusted(!isTrusted);
          setDisabled(false);
          return 'Trusted status updated';
        }
      }
    );
  };

  return (
    <ToggleWrapper title="Trusted Profile">
      <Toggle disabled={disabled} on={isTrusted} setOn={updateTrusted} />
    </ToggleWrapper>
  );
};

export default Trusted;
