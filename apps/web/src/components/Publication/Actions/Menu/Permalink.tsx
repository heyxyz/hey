import { Menu } from '@headlessui/react';
import { ClipboardCopyIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: Publication;
}

const Permalink: FC<Props> = ({ publication }) => {
  return (
    <CopyToClipboard
      text={`${location.origin}/posts/${publication?.id}`}
      onCopy={() => {
        toast.success(t`Copied to clipboard!`);
        Analytics.track(PUBLICATION.PERMALINK);
      }}
    >
      <Menu.Item
        as="div"
        className={({ active }) =>
          clsx({ 'dropdown-active': active }, 'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm')
        }
      >
        <div className="flex items-center space-x-2">
          <ClipboardCopyIcon className="h-4 w-4" />
          <div>Permalink</div>
        </div>
      </Menu.Item>
    </CopyToClipboard>
  );
};

export default Permalink;
