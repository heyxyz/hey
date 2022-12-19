import type { LensterPublication } from '@generated/types';
import { Menu } from '@headlessui/react';
import { CodeIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import clsx from 'clsx';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: LensterPublication;
}

const Embed: FC<Props> = ({ publication }) => {
  return (
    <Menu.Item
      as="a"
      className={({ active }) =>
        clsx({ 'dropdown-active': active }, 'block px-4 py-1.5 text-sm m-2 rounded-lg cursor-pointer')
      }
      onClick={() => {
        Analytics.track(PUBLICATION.EMBED);
      }}
      href={`https://embed.withlens.app/?url=${publication?.id}`}
      target="_blank"
    >
      <div className="flex items-center space-x-2">
        <CodeIcon className="w-4 h-4" />
        <div>Embed</div>
      </div>
    </Menu.Item>
  );
};

export default Embed;
