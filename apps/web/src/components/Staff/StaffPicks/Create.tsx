import type { StaffPick } from '@hey/types/hey';
import type { FC } from 'react';

import SearchProfiles from '@components/Shared/SearchProfiles';
import { HEY_API_URL } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CreateProps {
  setShowAddModal: (show: boolean) => void;
  setStaffPicks: (staffPicks: any) => void;
  staffPicks: StaffPick[];
}

const Create: FC<CreateProps> = ({
  setShowAddModal,
  setStaffPicks,
  staffPicks
}) => {
  const [value, setValue] = useState('');
  const [creating, setCreating] = useState(false);
  const [profileSelected, setProfileSelected] = useState(false);

  const add = () => {
    setCreating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/staff-picks/create`,
        { id: value },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setCreating(false);
          return 'Failed to add profile';
        },
        loading: 'Adding profile...',
        success: ({ data }) => {
          Leafwatch.track(STAFFTOOLS.STAFF_PICKS.CREATE);
          setStaffPicks([...staffPicks, data?.result]);
          setCreating(false);
          setShowAddModal(false);
          return 'Profile added';
        }
      }
    );
  };

  return (
    <div className="m-5 space-y-4">
      <SearchProfiles
        hideDropdown={profileSelected}
        onChange={(event) => {
          setProfileSelected(false);
          setValue(event.target.value);
        }}
        onProfileSelected={(profile) => {
          setValue(profile.id);
          setProfileSelected(true);
        }}
        placeholder="Search profiles..."
        value={value}
      />
      <Button className="w-full" disabled={creating} onClick={add}>
        Add
      </Button>
    </div>
  );
};

export default Create;
