import { getAuthApiHeadersWithAccessToken } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { BanknotesIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { GARDENER } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MirrorablePublication } from "@hey/lens";
import { PublicationReportingSpamSubreason } from "@hey/lens";
import { useApolloClient } from "@hey/lens/apollo";
import { Button } from "@hey/ui";
import axios from "axios";
import { useRouter } from "next/router";
import { type FC, type ReactNode, useState } from "react";
import { toast } from "react-hot-toast";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import StaffActions from "./StaffActions";

interface GardenerActionsProps {
  publication: MirrorablePublication;
}

const GardenerActions: FC<GardenerActionsProps> = ({ publication }) => {
  const { pathname } = useRouter();
  const { setShowGardenerActionsAlert } = useGlobalAlertStateStore();
  const [loading, setLoading] = useState(false);
  const { cache } = useApolloClient();

  const reportPublicationOnLens = async (
    subreasons: PublicationReportingSpamSubreason[]
  ) => {
    if (pathname === "/mod") {
      cache.evict({ id: cache.identify(publication) });
    }

    setLoading(true);
    try {
      await axios.post(
        `${HEY_API_URL}/internal/gardener/report`,
        { id: publication.id, subreasons },
        { headers: getAuthApiHeadersWithAccessToken() }
      );
    } finally {
      setLoading(false);
      setShowGardenerActionsAlert(false, null);
    }
  };

  const reportPublication = ({
    subreasons,
    type
  }: {
    subreasons: PublicationReportingSpamSubreason[];
    type: string;
  }) => {
    Leafwatch.track(GARDENER.REPORT, {
      publication_id: publication.id,
      type
    });
    toast.promise(reportPublicationOnLens(subreasons), {
      error: "Error reporting publication",
      loading: "Reporting publication...",
      success: "Publication reported successfully"
    });
  };

  interface ReportButtonProps {
    icon: ReactNode;
    label: string;
    subreasons: PublicationReportingSpamSubreason[];
    type: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({
    icon,
    label,
    subreasons,
    type
  }) => (
    <Button
      disabled={loading}
      icon={icon}
      onClick={() => reportPublication({ subreasons, type })}
      outline
      size="sm"
    >
      {label}
    </Button>
  );

  return (
    <span
      className="flex flex-wrap items-center gap-3 text-sm"
      onClick={stopEventPropagation}
    >
      <ReportButton
        icon={<DocumentTextIcon className="size-4" />}
        label="Spam"
        subreasons={[PublicationReportingSpamSubreason.LowSignal]}
        type="spam"
      />
      <ReportButton
        icon={<BanknotesIcon className="size-4" />}
        label="Un-sponsor"
        subreasons={[PublicationReportingSpamSubreason.FakeEngagement]}
        type="un-sponsor"
      />
      <ReportButton
        icon={<BanknotesIcon className="size-4" />}
        label="Both"
        subreasons={[
          PublicationReportingSpamSubreason.FakeEngagement,
          PublicationReportingSpamSubreason.LowSignal
        ]}
        type="both"
      />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <StaffActions
          onClick={() => {
            reportPublication({
              subreasons: [
                PublicationReportingSpamSubreason.FakeEngagement,
                PublicationReportingSpamSubreason.LowSignal,
                PublicationReportingSpamSubreason.Misleading
              ],
              type: "suspend"
            });
          }}
          publication={publication}
        />
      </div>
    </span>
  );
};

export default GardenerActions;
