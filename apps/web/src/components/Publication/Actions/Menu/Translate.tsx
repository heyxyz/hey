import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { Menu } from '@headlessui/react';
import { LanguageIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
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
  const getGoogleTranslateUrl = (text: string): string => {
    return encodeURI(
      urlcat('https://translate.google.com/#auto|en|:text', { text })
    );
  };

  return (
    <Menu.Item
      as={Link}
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
      href={getGoogleTranslateUrl(filteredContent || '')}
      onClick={(event) => {
        stopEventPropagation(event);
        Leafwatch.track(PUBLICATION.TRANSLATE, {
          publication_id: publication.id
        });
      }}
      target="_blank"
    >
      <div className="flex items-center space-x-2">
        <LanguageIcon className="size-4" />
        <div>Translate</div>
      </div>
    </Menu.Item>
  );
};

export default Translate;
