import type { MirrorablePublication } from '@good/lens';
import type { FC } from 'react';

import { GOOD_API_URL } from '@good/data/constants';
import { PUBLICATION } from '@good/data/tracking';
import stopEventPropagation from '@good/helpers/stopEventPropagation';
import cn from '@good/ui/cn';
import { MenuItem } from '@headlessui/react';
import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { Leafwatch } from '@helpers/leafwatch';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useProfileDetailsStore } from 'src/store/non-persisted/useProfileDetailsStore';

interface PinProps {
  publication: MirrorablePublication;
}

const Pin: FC<PinProps> = ({ publication }) => {
  const { pinnedPublication, setPinnedPublication } = useProfileDetailsStore();
  const isPinned = pinnedPublication === publication.id;

  const pinPublication = async (id: string) => {
    toast.promise(
      axios.post(
        `${GOOD_API_URL}/publications/pin`,
        { id, pin: !isPinned },
        { headers: await getAuthApiHeaders() }
      ),
      {
        error: 'Error pinning publication',
        loading: 'Pinning publication...',
        success: () => {
          Leafwatch.track(isPinned ? PUBLICATION.PIN : PUBLICATION.UNPIN, {
            publication_id: id
          });
          setPinnedPublication(isPinned ? null : id);

          return 'Publication pinned successfully';
        }
      }
    );
  };

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { 'dropdown-active': focus },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        pinPublication(publication.id);
      }}
    >
      <div className="flex items-center space-x-2">
        <PaperAirplaneIcon className="size-4" />
        <div>
          {isPinned ? 'Unpin' : 'Pin'} {publication.__typename}
        </div>
      </div>
    </MenuItem>
  );
};

export default Pin;
