import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { Menu } from '@headlessui/react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import toast from 'react-hot-toast';

interface CopyPostTextProps {
  publication: AnyPublication;
}

const CopyPostText: FC<CopyPostTextProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const publicationType = targetPublication.__typename;
  const filteredContent =
    getPublicationData(targetPublication.metadata)?.content || '';

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
        await navigator.clipboard.writeText(filteredContent || '');
        toast.success('Copied to clipboard!');
        Leafwatch.track(PUBLICATION.COPY_TEXT, {
          publication_id: publication.id
        });
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="size-4" />
        <div>
          {publicationType === 'Comment'
            ? 'Copy comment text'
            : 'Copy post text'}
        </div>
      </div>
    </Menu.Item>
  );
};

export default CopyPostText;
