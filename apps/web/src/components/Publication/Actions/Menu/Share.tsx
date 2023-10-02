import { Menu } from '@headlessui/react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import type { Publication } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import toast from 'react-hot-toast';

interface ShareProps {
  publication: Publication;
}

const Share: FC<ShareProps> = ({ publication }) => {
  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}/posts/${publication?.id}`
        );
        toast.success(t`Copied to clipboard!`);
        Leafwatch.track(PUBLICATION.SHARE, {
          publication_id: publication.id
        });
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="h-4 w-4" />
        <div>
          <Trans>Share</Trans>
        </div>
      </div>
    </Menu.Item>
  );
};

export default Share;
