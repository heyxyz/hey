import Loader from '@components/Shared/Loader';
import Slug from '@components/Shared/Slug';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useOwnedHandlesQuery } from '@hey/lens';
import { Button, Spinner } from '@hey/ui';
import type { FC } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

const LinkHandle: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const { data, loading } = useOwnedHandlesQuery({
    variables: { request: { for: currentProfile?.ownedBy.address } }
  });

  if (loading) {
    return <Loader />;
  }

  const ownedHandles = data?.ownedHandles.items;

  return (
    <div className="space-y-6">
      {ownedHandles?.map((handle) => (
        <div
          key={handle.fullHandle}
          className="flex items-center justify-between"
        >
          <Slug slug={handle.fullHandle} />
          <Button
            icon={
              false ? (
                <Spinner size="xs" />
              ) : handle.linkedTo ? (
                <MinusCircleIcon className="h-4 w-4" />
              ) : (
                <PlusCircleIcon className="h-4 w-4" />
              )
            }
            onClick={() => {}}
            disabled={false}
            outline
          >
            {handle.linkedTo ? 'Unlink' : 'Link'}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default LinkHandle;
