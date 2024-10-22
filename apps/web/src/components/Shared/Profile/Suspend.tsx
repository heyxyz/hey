import ToggleWrapper from "@components/Staff/Users/Overview/Tool/ToggleWrapper";
import {
  getAuthApiHeaders,
  getAuthApiHeadersWithAccessToken
} from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Permission, PermissionId } from "@hey/data/permissions";
import getInternalProfile from "@hey/helpers/api/getInternalProfile";
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
    queryKey: ["getInternalProfile", id || ""]
  });

  const suspendProfile = () => {
    toast.promise(
      Promise.all([
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
      ]),
      {
        error: "Error suspending profile",
        loading: "Suspending profile...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: ["getInternalProfile", id]
          });
          return "Profile suspended";
        }
      }
    );
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
