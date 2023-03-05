import { Menu } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/outline';
import { publicationKeyFields } from '@lib/keyFields';
import { Mixpanel } from '@lib/mixpanel';
import { stopEventPropagation } from '@lib/stopEventPropagation';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { Publication } from 'lens';
import { useHidePublicationMutation } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import { PUBLICATION } from 'src/tracking';

interface Props {
  publication: Publication;
  forceReloadOnDelete?: boolean;
}

const Delete: FC<Props> = ({ publication, forceReloadOnDelete = false }) => {
  const { push } = useRouter();

  const [hidePost] = useHidePublicationMutation({
    onCompleted: () => {
      Mixpanel.track(PUBLICATION.DELETE);
      if (forceReloadOnDelete) {
        push('/');
      }
      toast.success(t`Publication deleted successfully`);
    },
    update: (cache) => {
      cache.evict({ id: publicationKeyFields(publication) });
    }
  });

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm text-red-500'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        if (confirm('Are you sure you want to delete?')) {
          hidePost({
            variables: { request: { publicationId: publication?.id } }
          });
        }
      }}
    >
      <div className="flex items-center space-x-2">
        <TrashIcon className="h-4 w-4" />
        <div>Delete</div>
      </div>
    </Menu.Item>
  );
};

export default Delete;
