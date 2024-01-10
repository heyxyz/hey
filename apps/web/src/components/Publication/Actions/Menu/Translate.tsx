import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { LanguageIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Leafwatch } from '@lib/leafwatch';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import urlcat from 'urlcat';

interface TranslateProps {
  publication: AnyPublication;
}

const Translate: FC<TranslateProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const filteredContent =
    getPublicationData(targetPublication.metadata)?.content || '';

  if (filteredContent.length < 1) {
    return null;
  }

  const getGoogleTranslateUrl = (text: string): string => {
    return encodeURI(
      urlcat('https://translate.google.com/#auto|en|:text', { text })
    );
  };

  return (
    <DropdownMenuItem
      className="m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
      onClick={(event) => {
        stopEventPropagation(event);
        Leafwatch.track(PUBLICATION.TRANSLATE, {
          publication_id: publication.id
        });
      }}
    >
      <Link href={getGoogleTranslateUrl(filteredContent || '')} target="_blank">
        <div className="flex items-center space-x-2">
          <LanguageIcon className="size-4" />
          <div>Translate</div>
        </div>
      </Link>
    </DropdownMenuItem>
  );
};

export default Translate;
