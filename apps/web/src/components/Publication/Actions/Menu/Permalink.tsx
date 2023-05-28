import { Menu } from '@headlessui/react';
import { ClipboardCopyIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { Publication } from 'lens';
import stopEventPropagation from 'lib/stopEventPropagation';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { PUBLICATION } from 'src/tracking';

interface PermalinkProps {
  publication: Publication;
}

const Permalink: FC<PermalinkProps> = ({ publication }) => {
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
        Mixpanel.track(PUBLICATION.PERMALINK);
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardCopyIcon className="h-4 w-4" />
        <div>Permalink</div>
      </div>
    </Menu.Item>
  );
};

export default Permalink;
