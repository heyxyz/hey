import type { StaffPick } from '@hey/types/hey';
import type { FC } from 'react';

import LazyUserProfile from '@components/Shared/LazyUserProfile';
import Loader from '@components/Shared/Loader';
import { SparklesIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import { Button, Card, EmptyState, ErrorMessage, Modal } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Create from './Create';

const List: FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [staffPicks, setStaffPicks] = useState<[] | StaffPick[]>([]);

  const getStaffPicks = async (): Promise<StaffPick[]> => {
    const response = await axios.get(`${HEY_API_URL}/internal/staff-picks/all`);

    const { data } = response;
    setStaffPicks(data?.result || []);

    return data?.result || [];
  };

  const { error, isLoading } = useQuery({
    queryFn: getStaffPicks,
    queryKey: ['getStaffPicks']
  });

  const removeStaffPick = (id: string) => {
    const confirm = window.confirm(
      'Are you sure you want to remove this pick?'
    );

    if (!confirm) {
      return;
    }

    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/staff-picks/remove`,
        { id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: 'Failed to delete staff pick',
        loading: 'Deleting staff pick...',
        success: () => {
          Leafwatch.track(STAFFTOOLS.STAFF_PICKS.DELETE);
          setStaffPicks(staffPicks.filter((staffPick) => staffPick.id !== id));
          return 'Staff pick deleted';
        }
      }
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between space-x-5 p-5">
        <div className="text-lg font-bold">Staff Picks</div>
        <Button onClick={() => setShowAddModal(!showAddModal)}>Add</Button>
      </div>
      <div className="divider" />
      <div className="p-5">
        {isLoading ? (
          <Loader message="Loading staff picks..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load staff picks" />
        ) : !staffPicks.length ? (
          <EmptyState
            hideCard
            icon={<SparklesIcon className="text-brand-500 size-8" />}
            message={<span>No staff picks found</span>}
          />
        ) : (
          <div className="space-y-6">
            {staffPicks?.map((staffPick) => (
              <div
                className="flex items-center justify-between"
                key={staffPick.id}
              >
                <LazyUserProfile id={staffPick.id} />
                <Button
                  icon={<TrashIcon className="size-4" />}
                  onClick={() => removeStaffPick(staffPick.id)}
                  outline
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        onClose={() => setShowAddModal(!showAddModal)}
        show={showAddModal}
        title="Add Staff Pick"
      >
        <Create
          setShowAddModal={setShowAddModal}
          setStaffPicks={setStaffPicks}
          staffPicks={staffPicks}
        />
      </Modal>
    </Card>
  );
};

export default List;
