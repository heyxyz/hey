import { useApolloClient } from "@apollo/client";
import { getAuthApiHeadersWithAccessToken } from "@helpers/getAuthApiHeaders";
import { BanknotesIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { type Post, PostReportReason } from "@hey/indexer";
import { Button } from "@hey/ui";
import axios from "axios";
import { useRouter } from "next/router";
import { type FC, type ReactNode, useState } from "react";
import { toast } from "react-hot-toast";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import StaffActions from "./StaffActions";

interface GardenerActionsProps {
  post: Post;
}

const GardenerActions: FC<GardenerActionsProps> = ({ post }) => {
  const { pathname } = useRouter();
  const { setShowGardenerActionsAlert } = useGlobalAlertStateStore();
  const [loading, setLoading] = useState(false);
  const { cache } = useApolloClient();

  const reportPostOnLens = async (reasons: PostReportReason[]) => {
    if (pathname === "/mod") {
      cache.evict({ id: cache.identify(post) });
    }

    setLoading(true);
    try {
      await axios.post(
        `${HEY_API_URL}/internal/gardener/report`,
        { id: post.id, reasons },
        { headers: getAuthApiHeadersWithAccessToken() }
      );
    } finally {
      setLoading(false);
      setShowGardenerActionsAlert(false, null);
    }
  };

  const handleReportPost = ({
    reasons
  }: {
    reasons: PostReportReason[];
  }) => {
    toast.promise(reportPostOnLens(reasons), {
      error: "Error reporting post",
      loading: "Reporting post...",
      success: "Post reported"
    });
  };

  interface ReportButtonProps {
    icon: ReactNode;
    label: string;
    reasons: PostReportReason[];
    type: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({ icon, label, reasons }) => (
    <Button
      disabled={loading}
      icon={icon}
      onClick={() => handleReportPost({ reasons })}
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
        reasons={[PostReportReason.Unrelated]}
        type="spam"
      />
      <ReportButton
        icon={<BanknotesIcon className="size-4" />}
        label="Un-sponsor"
        reasons={[PostReportReason.FakeEngagement]}
        type="un-sponsor"
      />
      <ReportButton
        icon={<BanknotesIcon className="size-4" />}
        label="Both"
        reasons={[PostReportReason.FakeEngagement, PostReportReason.Unrelated]}
        type="both"
      />
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <StaffActions
          onClick={() => {
            handleReportPost({
              reasons: [
                PostReportReason.FakeEngagement,
                PostReportReason.Unrelated,
                PostReportReason.Misleading
              ]
            });
          }}
          post={post}
        />
      </div>
    </span>
  );
};

export default GardenerActions;
