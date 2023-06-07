import { Menu } from '@headlessui/react';
import { AnnotationIcon } from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { type FC } from 'react';

interface DeleteProps {
  publication: Publication;
}

const Quote: FC<DeleteProps> = ({ publication }) => {
  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
        )
      }
      // onClick={}
    >
      <div className="flex items-center space-x-2">
        <AnnotationIcon className="h-4 w-4" />
        <div>
          <Trans>Quote</Trans>
        </div>
      </div>
    </Menu.Item>
  );
};

export default Quote;
