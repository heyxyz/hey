import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { Button } from '@hey/ui';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

interface SuspendButtonProps {
  onClick?: () => void;
  publication: MirrorablePublication;
  title?: string;
}

const SuspendButton: FC<SuspendButtonProps> = ({
  onClick,
  publication,
  title = 'Suspend'
}) => {
  const { staffMode } = useFeatureFlagsStore();

  if (!staffMode) {
    return null;
  }

  const updateFeatureFlag = (id: string) => {
    onClick?.();
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/assign`,
        { enabled: true, id, profile_id: publication.by.id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: 'Error suspending profile',
        loading: 'Suspending profile...',
        success: 'Profile suspended'
      }
    );
  };

  return (
    <Button
      className="flex justify-center"
      icon={<NoSymbolIcon className="size-4" />}
      onClick={() => updateFeatureFlag('8ed8b26a-279d-4111-9d39-a40164b273a0')}
      outline
      size="sm"
      variant="danger"
    >
      {title}
    </Button>
  );
};

export default SuspendButton;
