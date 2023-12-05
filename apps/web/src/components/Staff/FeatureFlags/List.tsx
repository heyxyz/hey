import type { Features } from '@hey/types/hey';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import {
  AdjustmentsHorizontalIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import getAllFeatureFlags from '@hey/lib/api/getAllFeatureFlags';
import { Button, Card, EmptyState, ErrorMessage, Modal } from '@hey/ui';
import { formatDate } from '@lib/formatTime';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Create from './Create';

const List: FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [flags, setFlags] = useState<[] | Features[]>([]);

  const { error, isLoading } = useQuery({
    queryFn: () =>
      getAllFeatureFlags(getAuthWorkerHeaders(), (flags) => setFlags(flags)),
    queryKey: ['getAllFeatureFlags']
  });

  const deleteFeatureFlag = async (id: string) => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/feature/delete`,
        { id },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: 'Failed to delete feature flag',
        loading: 'Deleting feature flag...',
        success: () => {
          setFlags(flags.filter((flag) => flag.id !== id));
          return 'Feature flag deleted';
        }
      }
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <div className="text-lg font-bold">Feature Flags</div>
        <Button onClick={() => setShowCreateModal(!showCreateModal)}>
          Create
        </Button>
      </div>
      <div className="divider" />
      <div className="p-5">
        {isLoading ? (
          <Loader message="Loading feature flags..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load feature flags" />
        ) : !flags.length ? (
          <EmptyState
            hideCard
            icon={
              <AdjustmentsHorizontalIcon className="text-brand-500 h-8 w-8" />
            }
            message={<span>No feature flags found</span>}
          />
        ) : (
          <div className="space-y-5">
            {flags?.map((flag) => (
              <div className="flex items-center justify-between" key={flag.id}>
                <ToggleWithHelper
                  description={`Created on ${formatDate(
                    flag.createdAt
                  )} with priority ${flag.priority}`}
                  heading={flag.key}
                  on={flag.enabled}
                  setOn={() => {}}
                />
                {flag.priority === 0 && (
                  <Button
                    icon={<TrashIcon className="h-4 w-4" />}
                    onClick={() => deleteFeatureFlag(flag.id)}
                    outline
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        onClose={() => setShowCreateModal(!showCreateModal)}
        show={showCreateModal}
        title="Create feature flag"
      >
        <Create
          flags={flags}
          setFlags={setFlags}
          setShowCreateModal={setShowCreateModal}
        />
      </Modal>
    </Card>
  );
};

export default List;
