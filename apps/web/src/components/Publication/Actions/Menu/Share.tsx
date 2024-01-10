import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Leafwatch } from '@lib/leafwatch';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import toast from 'react-hot-toast';

interface ShareProps {
  publication: AnyPublication;
}

const Share: FC<ShareProps> = ({ publication }) => {
  return (
    <DropdownMenuItem
      className="m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}/posts/${publication?.id}`
        );
        toast.success('Copied to clipboard!');
        Leafwatch.track(PUBLICATION.SHARE, {
          publication_id: publication.id
        });
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="size-4" />
        <div>Share</div>
      </div>
    </DropdownMenuItem>
  );
};

export default Share;
