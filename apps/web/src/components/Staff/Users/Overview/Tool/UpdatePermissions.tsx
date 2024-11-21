import Loader from "@components/Shared/Loader";
import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { HEY_API_URL } from "@hey/data/constants";
import { STAFFTOOLS } from "@hey/data/tracking";
import getAllPermissions, {
  GET_ALL_PERMISSIONS_QUERY_KEY
} from "@hey/helpers/api/getAllPermissions";
import type { Permission } from "@hey/types/hey";
import { Toggle } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Dispatch, FC, SetStateAction } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import ToggleWrapper from "./ToggleWrapper";

interface UpdatePermissionsProps {
  permissions: string[];
  accountId: string;
  setPermissions: Dispatch<SetStateAction<string[]>>;
}

const UpdatePermissions: FC<UpdatePermissionsProps> = ({
  permissions,
  accountId,
  setPermissions
}) => {
  const [updating, setUpdating] = useState(false);

  const { data: allPermissions, isLoading } = useQuery({
    queryFn: () => getAllPermissions(getAuthApiHeaders()),
    queryKey: [GET_ALL_PERMISSIONS_QUERY_KEY]
  });

  if (isLoading) {
    return <Loader className="my-5" message="Loading permissions" />;
  }

  const availablePermissions = allPermissions || [];
  const enabledFlags = permissions;

  const updatePermission = async (permission: Permission) => {
    const { id, key } = permission;
    const enabled = !enabledFlags.includes(key);

    setUpdating(true);
    try {
      await axios.post(
        `${HEY_API_URL}/internal/permissions/assign`,
        { enabled, id, accountId },
        { headers: getAuthApiHeaders() }
      );

      setPermissions(
        enabled ? [...enabledFlags, key] : enabledFlags.filter((f) => f !== key)
      );
      toast.success("Permission updated");
      Leafwatch.track(STAFFTOOLS.USERS.ASSIGN_PERMISSION, {
        permission: key,
        accountId
      });
    } catch (error) {
      errorToast(error);
    } finally {
      setUpdating(false);
    }
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
