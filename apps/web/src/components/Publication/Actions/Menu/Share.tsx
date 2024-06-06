import type { MirrorablePublication } from '@good/lens';
import type { FC } from 'react';

import { PUBLICATION } from '@good/data/tracking';
import stopEventPropagation from '@good/helpers/stopEventPropagation';
import cn from '@good/ui/cn';
import { MenuItem } from '@headlessui/react';
import { Leafwatch } from '@helpers/leafwatch';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ShareProps {
  publication: MirrorablePublication;
}

const Share: FC<ShareProps> = ({ publication }) => {
  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { 'dropdown-active': focus },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}/posts/${publication?.id}`
        );
        toast.success('Copied to clipboard!');
        Leafwatch.track(PUBLICATION.SHARE, { publication_id: publication.id });
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="size-4" />
        <div>Share</div>
      </div>
    </MenuItem>
  );
};

export default Share;
