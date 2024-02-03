import type { Feature } from '@hey/types/hey';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import getAllKillSwitches from '@hey/lib/api/getAllKillSwitches';
import formatDate from '@hey/lib/datetime/formatDate';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const List: FC = () => {
  const [switches, setSwitches] = useState<[] | Feature[]>([]);
  const [killing, setKilling] = useState(false);

  const { error, isLoading } = useQuery({
    queryFn: () =>
      getAllKillSwitches(getAuthApiHeaders(), (features) =>
        setSwitches(features)
      ),
    queryKey: ['getAllKillSwitches']
  });

  const killSwitch = async (id: string, enabled: boolean) => {
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
          return 'Failed to toggled a feature';
        },
        loading: 'Feature is being toggled...',
        success: () => {
          setKilling(false);
          setSwitches(
            switches.map((feature) =>
              feature.id === id ? { ...feature, enabled } : feature
            )
          );
          return 'Feature has been toggled successfully';
        }
      }
    );
  };

  return (
    <Card>
      <div className="p-5 text-lg font-bold">Kill Switches</div>
      <div className="divider" />
      <div className="p-5">
        {isLoading ? (
          <Loader message="Loading kill switches..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load kill switches" />
        ) : !switches.length ? (
          <EmptyState
            hideCard
            icon={
              <AdjustmentsHorizontalIcon className="text-brand-500 size-8" />
            }
            message={<span>No kill switches found</span>}
          />
        ) : (
          <div className="space-y-5">
            {switches?.map((feature) => (
              <div key={feature.id}>
                <ToggleWithHelper
                  description={`Created on ${formatDate(feature.createdAt)}`}
                  disabled={killing}
                  heading={<b>{feature.key}</b>}
                  on={feature.enabled}
                  setOn={() => killSwitch(feature.id, !feature.enabled)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default List;
