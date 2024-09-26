import ToggleWrapper from "@components/Staff/Users/Overview/Tool/ToggleWrapper";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { HEY_API_URL } from "@hey/data/constants";
import { Permission } from "@hey/data/permissions";
import { CREATORTOOLS } from "@hey/data/tracking";
import {
  STAFF_PICK_PERMISSION_ID,
  VERIFIED_PERMISSION_ID
} from "@hey/db/constants";
import getInternalPreferences from "@hey/helpers/api/getInternalPreferences";
import type { Profile } from "@hey/lens";
import { Toggle } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CreatorToolProps {
  profile: Profile;
}

const CreatorTool: FC<CreatorToolProps> = ({ profile }) => {
  const [updating, setUpdating] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  const allowedPermissions = [
    { id: VERIFIED_PERMISSION_ID, key: Permission.Verified },
    { id: STAFF_PICK_PERMISSION_ID, key: Permission.StaffPick }
  ];

  const { data: preferences, isLoading } = useQuery({
    queryFn: () => getInternalPreferences(profile.id, getAuthApiHeaders()),
    queryKey: ["getInternalPreferences", profile.id]
  });

  useEffect(() => {
    if (preferences) {
      setPermissions(preferences.permissions || []);
    }
  }, [preferences]);

  const updatePermissions = async (permission: { id: string; key: string }) => {
    const { id, key } = permission;
    const enabled = !permissions.includes(key);

    setUpdating(true);
    try {
      await toast.promise(
        axios.post(
          `${HEY_API_URL}/internal/creator-tools/assign`,
          { enabled, id, profile_id: profile.id },
          { headers: getAuthApiHeaders() }
        ),
        {
          error: "Failed to update permission",
          loading: "Updating the permission...",
          success: "Permission updated"
        }
      );

      Leafwatch.track(CREATORTOOLS.ASSIGN_PERMISSION, {
        permission: key,
        profile_id: profile.id
      });

      setPermissions((prev) =>
        enabled ? [...prev, key] : prev.filter((f) => f !== key)
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="font-bold">Creator Tool</div>
      <div className="space-y-2 pt-2 font-bold">
        {allowedPermissions.map((permission) => (
          <ToggleWrapper key={permission.id} title={permission.key}>
            <Toggle
              disabled={updating || isLoading}
              on={permissions.includes(permission.key)}
              setOn={() => updatePermissions(permission)}
            />
          </ToggleWrapper>
        ))}
      </div>
    </div>
  );
};

export default CreatorTool;
