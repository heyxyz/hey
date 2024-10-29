import ToggleWrapper from "@components/Staff/Users/Overview/Tool/ToggleWrapper";
import errorToast from "@helpers/errorToast";
import {
  getAuthApiHeaders,
  getAuthApiHeadersWithAccessToken
} from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Permission, PermissionId } from "@hey/data/permissions";
import getInternalProfile, {
  GET_INTERNAL_PROFILE_QUERY_KEY
} from "@hey/helpers/api/getInternalProfile";
import { PublicationReportingSpamSubreason } from "@hey/lens";
import { Toggle } from "@hey/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import toast from "react-hot-toast";

interface SuspendProps {
  id: string;
}

const Suspend: FC<SuspendProps> = ({ id }) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryFn: () => getInternalProfile(id, getAuthApiHeaders()),
    queryKey: [GET_INTERNAL_PROFILE_QUERY_KEY, id || ""]
  });

  const suspendProfile = async () => {
    try {
      await Promise.all([
        axios.post(
          `${HEY_API_URL}/internal/permissions/assign`,
          { enabled: true, id: PermissionId.Suspended, profile_id: id },
          { headers: getAuthApiHeaders() }
        ),
        axios.post(
          `${HEY_API_URL}/internal/profile/report`,
          {
            id,
            subreasons: [
              PublicationReportingSpamSubreason.FakeEngagement,
              PublicationReportingSpamSubreason.LowSignal,
              PublicationReportingSpamSubreason.Misleading
            ]
          },
          { headers: getAuthApiHeadersWithAccessToken() }
        )
      ]);

      queryClient.invalidateQueries({
        queryKey: [GET_INTERNAL_PROFILE_QUERY_KEY, id]
      });
      toast.success("Profile suspended");
    } catch (error) {
      errorToast(error);
    }
  };

  const isSuspended =
    profile?.permissions.includes(Permission.Suspended) || false;

  return (
    <div className="text-red-500">
      <ToggleWrapper title="Suspend and Report Profile">
        <Toggle disabled={isLoading} on={isSuspended} setOn={suspendProfile} />
      </ToggleWrapper>
    </div>
  );
};

export default Suspend;
