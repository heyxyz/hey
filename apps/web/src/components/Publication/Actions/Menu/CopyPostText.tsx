import { Menu } from '@headlessui/react';
import { ClipboardCopyIcon } from '@heroicons/react/outline';
import { PUBLICATION } from '@lenster/data/tracking';
import type { Publication } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import toast from 'react-hot-toast';

interface CopyPostTextProps {
  publication: Publication;
}

const CopyPostText: FC<CopyPostTextProps> = ({ publication }) => {
  const isMirror = publication.__typename === 'Mirror';
  const publicationType = isMirror
    ? publication.mirrorOf.__typename
    : publication.__typename;

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          publication?.metadata?.content || ''
        );
        toast.success(t`Copied to clipboard!`);
        Leafwatch.track(PUBLICATION.COPY_TEXT, {
          publication_id: publication.id
        });
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardCopyIcon className="h-4 w-4" />
        <div>
          {publicationType === 'Comment' ? (
            <Trans>Copy comment text</Trans>
          ) : (
            <Trans>Copy post text</Trans>
          )}
        </div>
      </div>
    </Menu.Item>
  );
};

export default CopyPostText;
