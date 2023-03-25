import { Menu } from '@headlessui/react';
import { CodeIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';
import { stopEventPropagation } from 'utils/stopEventPropagation';

interface EmbedProps {
  publication: Publication;
}

const Embed: FC<EmbedProps> = ({ publication }) => {
  return (
    <Menu.Item
      as="a"
      className={({ active }) =>
        clsx({ 'dropdown-active': active }, 'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm')
      }
      onClick={(event) => {
        stopEventPropagation(event);
        Mixpanel.track(PUBLICATION.EMBED);
      }}
      href={`https://embed.withlens.app/?url=${publication?.id}`}
      target="_blank"
    >
      <div className="flex items-center space-x-2">
        <CodeIcon className="h-4 w-4" />
        <div>Embed</div>
      </div>
    </Menu.Item>
  );
};

export default Embed;
