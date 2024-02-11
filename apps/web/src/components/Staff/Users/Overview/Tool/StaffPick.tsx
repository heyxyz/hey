import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { HEY_API_URL } from '@hey/data/constants';
import { StaffPick } from '@hey/types/hey';
import { Select } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import toast from 'react-hot-toast';

interface StaffPickProps {
  profileId: string;
}

const StaffPick: FC<StaffPickProps> = ({ profileId }) => {
  const fetchStaffPicks = async (): Promise<StaffPick[]> => {
    const response: {
      data: { result: StaffPick[] };
    } = await axios.get(`${HEY_API_URL}/staff-picks`, {
      headers: { ...getAuthApiHeaders(), 'X-Skip-Cache': true }
    });

    return response.data.result;
  };

  const {
    data: picks,
    isLoading,
    refetch
  } = useQuery({
    queryFn: fetchStaffPicks,
    queryKey: ['fetchStaffPicks']
  });

  const handleUpdate = async (id: string) => {
    const confirm = window.confirm(
      'Are you sure you want to update this staff pick?'
    );

    if (!confirm) {
      return toast.error('Staff pick update cancelled');
    }

    try {
      await axios.post(
        `${HEY_API_URL}/internal/staff-picks/replace`,
        { id, replace_id: profileId, type: 'PROFILE' },
        { headers: getAuthApiHeaders() }
      );

      await refetch();

      return toast.success('Staff pick updated!');
    } catch {
      return toast.error(Errors.SomethingWentWrong);
    }
  };

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <CursorArrowRaysIcon className="size-5" />
        <div className="text-lg font-bold">Staff Picks</div>
      </div>
      <div className="mt-3">
        <Select
          disabled={isLoading}
          onChange={(e) => {
            handleUpdate(e.target.value);
          }}
          options={[
            {
              disabled: true,
              label: 'Select to replace',
              selected: true,
              value: ''
            },
            ...(picks?.map((pick) => ({
              label: `${pick.id} - ${pick.type} (${pick.score})`,
              value: pick.id
            })) || [])
          ]}
        />
      </div>
    </>
  );
};

export default StaffPick;
