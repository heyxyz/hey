import type { Feature } from '@hey/types/hey';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { FeatureFlag } from '@hey/data/feature-flags';
import { STAFFTOOLS } from '@hey/data/tracking';
import getAllFeatureFlags from '@hey/lib/api/getAllFeatureFlags';
import formatDate from '@hey/lib/datetime/formatDate';
import { Badge, Button, Card, EmptyState, ErrorMessage, Modal } from '@hey/ui';
import cn from '@hey/ui/cn';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Assign from './Assign';
import Create from './Create';

const List: FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [features, setFeatures] = useState<[] | Feature[]>([]);
  const [killing, setKilling] = useState(false);

  const { error, isLoading } = useQuery({
    queryFn: () =>
      getAllFeatureFlags(getAuthApiHeaders(), (features) =>
        setFeatures(features)
      ),
    queryKey: ['getAllFeatureFlags']
  });

  const killFeatureFlag = (id: string, enabled: boolean) => {
    setKilling(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/toggle`,
        { enabled, id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setKilling(false);
          return 'Failed to kill feature flag';
        },
        loading: 'Killing feature flag...',
        success: () => {
          Leafwatch.track(STAFFTOOLS.FEATURE_FLAGS.KILL);
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

  const deleteFeatureFlag = (id: string) => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/delete`,
        { id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: 'Failed to delete feature flag',
        loading: 'Deleting feature flag...',
        success: () => {
          Leafwatch.track(STAFFTOOLS.FEATURE_FLAGS.DELETE);
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
      <div className="m-5">
        {isLoading ? (
          <Loader className="my-5" message="Loading feature flags..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load feature flags" />
        ) : !features.length ? (
          <EmptyState
            hideCard
            icon={<AdjustmentsHorizontalIcon className="size-8" />}
            message={<span>No feature flags found</span>}
          />
        ) : (
          <div className="space-y-5">
            {features?.map((feature) => (
              <div key={feature.id}>
                <ToggleWithHelper
                  description={`Created on ${formatDate(feature.createdAt)}`}
                  disabled={killing}
                  heading={
                    <div className="flex items-center space-x-2">
                      <b
                        className={cn(
                          (feature.key === FeatureFlag.Suspended ||
                            feature.key === FeatureFlag.Flagged) &&
                            'text-red-500'
                        )}
                      >
                        {feature.key}
                      </b>
                      <Badge variant="secondary">{feature.type}</Badge>
                    </div>
                  }
                  on={feature.enabled}
                  setOn={() => killFeatureFlag(feature.id, !feature.enabled)}
                />
                <div className="mt-2 space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedFeature(feature);
                      setShowAssignModal(!showAssignModal);
                    }}
                    outline
                    size="sm"
                    variant="secondary"
                  >
                    Assign
                  </Button>
                  {feature.type === 'FEATURE' && (
                    <Button
                      onClick={() => deleteFeatureFlag(feature.id)}
                      outline
                      size="sm"
                      variant="danger"
                    >
                      Delete
                    </Button>
                  )}
                </div>
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
      <Modal
        onClose={() => setShowAssignModal(!showAssignModal)}
        show={showAssignModal}
        title={`Assign feature flag - ${selectedFeature?.key}`}
      >
        {selectedFeature ? (
          <Assign
            feature={selectedFeature}
            setShowAssignModal={setShowAssignModal}
          />
        ) : null}
      </Modal>
    </Card>
  );
};

export default List;
