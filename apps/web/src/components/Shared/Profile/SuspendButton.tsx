import {
  getAuthApiHeaders,
  getAuthApiHeadersWithAccessToken
} from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { Permission, PermissionId } from "@hey/data/permissions";
import getInternalProfile from "@hey/helpers/api/getInternalProfile";
import { PublicationReportingSpamSubreason } from "@hey/lens";
import { Button } from "@hey/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFlag } from "@unleash/proxy-client-react";
import axios from "axios";
import type { FC } from "react";
import toast from "react-hot-toast";

interface SuspendButtonProps {
  id: string;
}

const SuspendButton: FC<SuspendButtonProps> = ({ id }) => {
  const isStaff = useFlag(FeatureFlag.Staff);
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryFn: () => getInternalProfile(id, getAuthApiHeaders()),
    queryKey: ["getInternalProfile", id || ""],
    enabled: isStaff
  });

  if (!isStaff) {
    return null;
  }

  const suspendProfile = () => {
    toast.promise(
      Promise.all([
        axios.post(
          `${HEY_API_URL}/internal/permissions/assign`,
          { enabled: true, id: PermissionId.Suspended, profile_id: id },
          { headers: getAuthApiHeaders() }
        ),
        axios.post(
          `${HEY_API_URL}/internal/gardener/report`,
          {
            id: `${id}-0x01`,
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

  const isSuspended = profile?.permissions.includes(Permission.Suspended);

  return (
    <Button
      onClick={suspendProfile}
      size="sm"
      variant="danger"
      disabled={isSuspended}
      outline
    >
      {isSuspended ? "Suspended" : "Suspend"}
    </Button>
  );
};

export default SuspendButton;
