import { Menu } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/outline';
import { getPrimaryLanguage } from '@lib/i18n';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import type { Publication } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC } from 'react';

interface TranslateProps {
  publication: Publication;
}

const Translate: FC<TranslateProps> = ({ publication }) => {
  const { i18n } = useLingui();

  const getGoogleTranslateUrl = (srcText: string): string => {
    const primaryLocale = getPrimaryLanguage(i18n.locale);
    const locale = primaryLocale === 'zh' ? 'zh-CN' : primaryLocale;
    const srcTextEnc = encodeURIComponent(srcText);
    return `https://translate.google.com/?sl=auto&tl=${locale}&text=${srcTextEnc}&op=translate`;
  };

  return (
    <Menu.Item
      as="a"
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
        <GlobeAltIcon className="h-4 w-4" />
        <div>
          <Trans>Translate</Trans>
        </div>
      </div>
    </Menu.Item>
  );
};

export default Translate;
