import { Menu } from '@headlessui/react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@lenster/data/tracking';
import type { AnyPublication } from '@lenster/lens';
import { isMirrorPublication } from '@lenster/lib/publicationTypes';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import cn from '@lenster/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import toast from 'react-hot-toast';

interface CopyPostTextProps {
  publication: AnyPublication;
}

const CopyPostText: FC<CopyPostTextProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const publicationType = targetPublication.__typename;

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
          targetPublication?.metadata?.marketplace?.description || ''
        );
        toast.success(t`Copied to clipboard!`);
        Leafwatch.track(PUBLICATION.COPY_TEXT, {
          publication_id: publication.id
        });
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="h-4 w-4" />
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
