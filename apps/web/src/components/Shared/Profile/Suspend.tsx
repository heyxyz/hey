import ToggleWrapper from "@components/Staff/Users/Overview/Tool/ToggleWrapper";
import errorToast from "@helpers/errorToast";
import {
  getAuthApiHeaders,
  getAuthApiHeadersWithAccessToken
} from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import { Permission, PermissionId } from "@hey/data/permissions";
import getInternalAccount, {
  GET_INTERNAL_ACCOUNT_QUERY_KEY
} from "@hey/helpers/api/getInternalAccount";
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

  const { data: account, isLoading } = useQuery({
    queryFn: () => getInternalAccount(id, getAuthApiHeaders()),
    queryKey: [GET_INTERNAL_ACCOUNT_QUERY_KEY, id || ""]
  });

  const suspendAccount = async () => {
    try {
      await Promise.all([
        axios.post(
          `${HEY_API_URL}/internal/permissions/assign`,
          { enabled: true, id: PermissionId.Suspended, accountId: id },
          { headers: getAuthApiHeaders() }
        ),
        axios.post(
          `${HEY_API_URL}/internal/account/report`,
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
        queryKey: [GET_INTERNAL_ACCOUNT_QUERY_KEY, id]
      });
      toast.success("Account suspended");
    } catch (error) {
      errorToast(error);
    }
  };

  const isSuspended =
    account?.permissions.includes(Permission.Suspended) || false;

  return (
    <div className="text-red-500">
      <ToggleWrapper title="Suspend and Report Account">
        <Toggle disabled={isLoading} on={isSuspended} setOn={suspendAccount} />
      </ToggleWrapper>
    </div>
  );
};

export default Suspend;
