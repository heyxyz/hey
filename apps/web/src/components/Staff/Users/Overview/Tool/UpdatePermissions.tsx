import type { Permission } from '@hey/types/hey';
import type { Dispatch, FC, SetStateAction } from 'react';

import Loader from '@components/Shared/Loader';
import { getAuthApiHeaders } from '@helpers/getAuthApiHeaders';
import { Leafwatch } from '@helpers/leafwatch';
import { HEY_API_URL } from '@hey/data/constants';
import { STAFFTOOLS } from '@hey/data/tracking';
import getAllPermissions from '@hey/helpers/api/getAllPermissions';
import { Toggle } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import ToggleWrapper from './ToggleWrapper';

interface UpdatePermissionsProps {
  permissions: string[];
  profileId: string;
  setPermissions: Dispatch<SetStateAction<string[]>>;
}

const UpdatePermissions: FC<UpdatePermissionsProps> = ({
  permissions,
  profileId,
  setPermissions
}) => {
  const [updating, setUpdating] = useState(false);

  const { data: allPermissions, isLoading } = useQuery({
    queryFn: () => getAllPermissions(getAuthApiHeaders()),
    queryKey: ['getAllPermissions']
  });

  if (isLoading) {
    return <Loader className="my-5" message="Loading permissions" />;
  }

  const availablePermissions = allPermissions || [];
  const enabledFlags = permissions;

  const updatePermission = (permission: Permission) => {
    const { id, key } = permission;
    const enabled = !enabledFlags.includes(key);

    setUpdating(true);
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/permissions/assign`,
        { enabled, id, profile_id: profileId },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setUpdating(false);
          return 'Failed to update permission';
        },
        loading: 'Updating permission...',
        success: () => {
          Leafwatch.track(STAFFTOOLS.USERS.ASSIGN_PERMISSION, {
            permission: key,
            profile_id: profileId
          });
          setUpdating(false);
          setPermissions(
            enabled
              ? [...enabledFlags, key]
              : enabledFlags.filter((f) => f !== key)
          );
          return 'Permission updated';
        }
      }
    );
  };

  return (
    <div className="space-y-2 font-bold">
      {availablePermissions.map((permission) => (
        <ToggleWrapper key={permission.id} title={permission.key}>
          <Toggle
            disabled={updating}
            on={enabledFlags.includes(permission.key)}
            setOn={() => updatePermission(permission)}
          />
        </ToggleWrapper>
      ))}
    </div>
  );
};

export default UpdatePermissions;
