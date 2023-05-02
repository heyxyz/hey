import { Menu } from '@headlessui/react';
import { TranslateIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Publication } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import Link from 'next/link';
import type { FC } from 'react';

interface TranslateProps {
  publication: Publication;
}

const Translate: FC<TranslateProps> = ({ publication }) => {
  const getGoogleTranslateUrl = (text: string): string => {
    return encodeURI(
      `https://translate.google.com/#auto|en|${encodeURIComponent(text)}`
    );
  };

  return (
    <Menu.Item
      as={Link}
      className={({ active }) =>
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
        )
      }
      href={getGoogleTranslateUrl(publication?.metadata?.content)}
      onClick={(event) => {
        stopEventPropagation(event);
      }}
      target="_blank"
    >
      <div className="flex items-center space-x-2">
        <TranslateIcon className="h-4 w-4" />
        <div>
          <Trans>Translate</Trans>
        </div>
      </div>
    </Menu.Item>
  );
};

export default Translate;
