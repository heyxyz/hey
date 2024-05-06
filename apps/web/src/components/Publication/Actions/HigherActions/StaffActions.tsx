import type { MirrorablePublication } from '@hey/lens';

import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { Leafwatch } from '@helpers/leafwatch';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button } from '@hey/ui';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';

interface StaffActionsProps {
  publication: MirrorablePublication;
}

const StaffActions: FC<StaffActionsProps> = ({ publication }) => {
  const [updating, setUpdating] = useState(false);

  const updateFeatureFlag = (id: string) => {
    setUpdating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/assign`,
        { enabled: true, id, profile_id: publication.by.id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Failed to suspend profile';
        },
        loading: 'Suspending profile...',
        success: () => {
          Leafwatch.track(STAFFTOOLS.USERS.ASSIGN_FEATURE_FLAG, {
            feature: 'suspended',
            profile_id: publication.by.id
          });
          setUpdating(false);
          return 'Profile suspended';
        }
      }
    );
  };

  return (
    <span
      className="mt-3 flex flex-wrap items-center gap-3 text-sm"
      onClick={stopEventPropagation}
    >
      <Button
        disabled={updating}
        icon={<NoSymbolIcon className="size-4" />}
        onClick={() =>
          updateFeatureFlag('8ed8b26a-279d-4111-9d39-a40164b273a0')
        }
        outline
        size="sm"
        variant="danger"
      >
        Suspend
      </Button>
    </span>
  );
};

export default StaffActions;
