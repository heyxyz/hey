import { Menu } from '@headlessui/react';
import { ClipboardCopyIcon } from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { PUBLICATION } from 'src/tracking';

interface ShareProps {
  publication: Publication;
}

const Share: FC<ShareProps> = ({ publication }) => {
  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
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
        <ClipboardCopyIcon className="h-4 w-4" />
        <div>
          <Trans>Share</Trans>
        </div>
      </div>
    </Menu.Item>
  );
};

export default Share;
