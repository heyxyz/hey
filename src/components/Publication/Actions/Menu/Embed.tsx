import { LensterPublication } from '@generated/lenstertypes';
import { Menu } from '@headlessui/react';
import { CodeBracketSquareIcon } from '@heroicons/react/24/outline';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import React, { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: LensterPublication;
}

const Embed: FC<Props> = ({ publication }) => {
  return (
    <Menu.Item
      as="a"
      className={({ active }: { active: boolean }) =>
        clsx({ 'dropdown-active': active }, 'block px-4 py-1.5 text-sm m-2 rounded-lg cursor-pointer')
      }
      onClick={() => {
        Mixpanel.track(PUBLICATION.EMBED);
      }}
      href={`https://embed.withlens.app/?url=${publication?.id}`}
      target="_blank"
    >
      <div className="flex items-center space-x-2">
        <CodeBracketSquareIcon className="w-4 h-4" />
        <div>Embed</div>
      </div>
    </Menu.Item>
  );
};

export default Embed;
