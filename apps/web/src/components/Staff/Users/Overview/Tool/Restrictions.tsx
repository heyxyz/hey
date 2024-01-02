import type { Preferences } from '@hey/types/hey';

import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { Toggle } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { useUpdateEffect } from 'usehooks-ts';

import ToggleWrapper from './ToggleWrapper';

interface RestrictionsProps {
  id: string;
  restrictions: Preferences['restrictions'];
}

const Restrictions: FC<RestrictionsProps> = ({ id, restrictions }) => {
  const [disabled, setDisabled] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);

  useUpdateEffect(() => {
    if (restrictions) {
      setIsFlagged(restrictions.isFlagged);
      setIsSuspended(restrictions.isSuspended);
    }
  }, [restrictions]);

  const updateRestriction = async (
    isFlagged: boolean,
    isSuspended: boolean
  ) => {
    setDisabled(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/restrictions/update`,
        { id, isFlagged, isSuspended },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: () => {
          setDisabled(false);
          return 'Error updating restriction';
        },
        loading: 'Updating restriction...',
        success: () => {
          setDisabled(false);
          setIsFlagged(isFlagged);
          setIsSuspended(isSuspended);

          return 'Restriction updated';
        }
      }
    );
  };

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <NoSymbolIcon className="size-5" />
        <div className="text-lg font-bold">Restrictions</div>
      </div>
      <div className="mt-3 space-y-2 font-bold">
        <ToggleWrapper title="Is Flagged">
          <Toggle
            disabled={disabled}
            on={isFlagged}
            setOn={() => updateRestriction(!isFlagged, isSuspended)}
          />
        </ToggleWrapper>
        <ToggleWrapper title="Is Suspended">
          <Toggle
            disabled={disabled}
            on={isSuspended}
            setOn={() => updateRestriction(isFlagged, !isSuspended)}
          />
        </ToggleWrapper>
      </div>
    </>
  );
};

export default Restrictions;
