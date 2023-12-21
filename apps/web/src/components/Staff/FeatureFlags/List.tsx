import type { Feature } from '@hey/types/hey';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import {
  AdjustmentsHorizontalIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import getAllFeatureFlags from '@hey/lib/api/getAllFeatureFlags';
import formatDate from '@hey/lib/datetime/formatDate';
import { Badge, Button, Card, EmptyState, ErrorMessage, Modal } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Create from './Create';

const List: FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [features, setFeatures] = useState<[] | Feature[]>([]);
  const [killing, setKilling] = useState(false);

  const { error, isLoading } = useQuery({
    queryFn: () =>
      getAllFeatureFlags(getAuthWorkerHeaders(), (features) =>
        setFeatures(features)
      ),
    queryKey: ['getAllFeatureFlags']
  });

  const killFeatureFlag = async (id: string, enabled: boolean) => {
    setKilling(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/feature/kill`,
        { enabled, id },
        { headers: getAuthWorkerHeaders() }
      ),
      {
        error: () => {
          setKilling(false);
          return 'Failed to kill feature flag';
        },
        loading: 'Killing feature flag...',
        success: () => {
          setKilling(false);
          setFeatures(
            features.map((feature) =>
              feature.id === id ? { ...feature, enabled } : feature
            )
          );
          return 'Feature flag killed';
        }
      }
    );
  };

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
          setFeatures(features.filter((feature) => feature.id !== id));
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
        ) : !features.length ? (
          <EmptyState
            hideCard
            icon={
              <AdjustmentsHorizontalIcon className="text-brand-500 size-8" />
            }
            message={<span>No feature flags found</span>}
          />
        ) : (
          <div className="space-y-5">
            {features?.map((feature) => (
              <div
                className="flex items-center justify-between"
                key={feature.id}
              >
                <ToggleWithHelper
                  description={`Created on ${formatDate(
                    feature.createdAt
                  )} with priority ${feature.priority}`}
                  disabled={killing}
                  heading={
                    <div className="flex items-center space-x-2">
                      <b>{feature.key}</b>
                      <Badge variant="secondary">{feature.type}</Badge>
                    </div>
                  }
                  on={feature.enabled}
                  setOn={() => killFeatureFlag(feature.id, !feature.enabled)}
                />
                {feature.type === 'FEATURE' && (
                  <Button
                    icon={<TrashIcon className="size-4" />}
                    onClick={() => deleteFeatureFlag(feature.id)}
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
          features={features}
          setFeatures={setFeatures}
          setShowCreateModal={setShowCreateModal}
        />
      </Modal>
    </Card>
  );
};

export default List;
