import type {
  MirrorablePublication,
  ReportPublicationRequest
} from '@hey/lens';
import type { FC, ReactNode } from 'react';

import getAuthApiHeaders from '@helpers/getAuthApiHeaders';
import { Leafwatch } from '@helpers/leafwatch';
import {
  BanknotesIcon,
  DocumentTextIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { GARDENER } from '@hey/data/tracking';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import {
  PublicationReportingReason,
  PublicationReportingSpamSubreason,
  useReportPublicationMutation
} from '@hey/lens';
import { useApolloClient } from '@hey/lens/apollo';
import { Button } from '@hey/ui';
import { useToggle } from '@uidotdev/usehooks';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

interface GardenerActionsProps {
  publication: MirrorablePublication;
}

const GardenerActions: FC<GardenerActionsProps> = ({ publication }) => {
  const { pathname } = useRouter();
  const { staffMode } = useFeatureFlagsStore();
  const { setShowGardenerActionsAlert } = useGlobalAlertStateStore();
  const [hasReported, toggletHasReported] = useToggle(
    publication.operations?.hasReported
  );
  const [createReport, { loading }] = useReportPublicationMutation();
  const { cache } = useApolloClient();

  const reportPublication = async ({
    subreason,
    suspended
  }: {
    subreason: PublicationReportingSpamSubreason;
    suspended?: boolean;
  }) => {
    if (pathname === '/mod') {
      cache.evict({ id: cache.identify(publication) });
    }

    // Variables
    const request: ReportPublicationRequest = {
      for: publication.id,
      ...(suspended && { additionalComments: `Suspended on ${APP_NAME}` }),
      reason: {
        spamReason: { reason: PublicationReportingReason.Spam, subreason }
      }
    };

    return await createReport({
      onCompleted: () => setShowGardenerActionsAlert(false, null),
      variables: { request }
    });
  };

  const updateFeatureFlag = (id: string) => {
    toast.promise(
      axios.post(
        `${HEY_API_URL}/internal/features/assign`,
        { enabled: true, id, profile_id: publication.by.id },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: 'Error suspending profile',
        loading: 'Suspending profile...',
        success: 'Profile suspended'
      }
    );
  };

  interface ReportButtonProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    subreasons: PublicationReportingSpamSubreason[];
    type: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({
    icon,
    label,
    onClick,
    subreasons,
    type
  }) => (
    <Button
      disabled={loading || hasReported}
      icon={icon}
      onClick={() => {
        Leafwatch.track(GARDENER.REPORT, {
          publication_id: publication.id,
          type
        });
        onClick?.();
        toast.promise(
          Promise.all(
            subreasons.map(async (subreason) => {
              await reportPublication({
                subreason,
                suspended:
                  type === 'suspend' &&
                  subreason === PublicationReportingSpamSubreason.Misleading
              });
            })
          ),
          {
            error: 'Error reporting publication',
            loading: 'Reporting publication...',
            success: () => {
              toggletHasReported();
              return 'Publication reported successfully';
            }
          }
        );
      }}
      outline
      size="sm"
      variant={type === 'suspend' ? 'danger' : 'warning'}
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
      {staffMode && (
        <ReportButton
          icon={<NoSymbolIcon className="size-4" />}
          label="Suspend"
          onClick={() =>
            updateFeatureFlag('8ed8b26a-279d-4111-9d39-a40164b273a0')
          }
          subreasons={[
            PublicationReportingSpamSubreason.FakeEngagement,
            PublicationReportingSpamSubreason.LowSignal,
            PublicationReportingSpamSubreason.Misleading
          ]}
          type="suspend"
        />
      )}
    </span>
  );
};

export default GardenerActions;
