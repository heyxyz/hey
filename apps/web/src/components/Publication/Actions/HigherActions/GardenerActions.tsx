import type {
  MirrorablePublication,
  ReportPublicationRequest
} from '@hey/lens';
import type { FC, ReactNode } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
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
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

import SuspendButton from './SuspendButton';

interface GardenerActionsProps {
  publication: MirrorablePublication;
}

const GardenerActions: FC<GardenerActionsProps> = ({ publication }) => {
  const { pathname } = useRouter();
  const { setShowGardenerActionsAlert } = useGlobalAlertStateStore();
  const [hasReported, toggletHasReported] = useToggle(
    publication.operations?.hasReported
  );
  const [createReport, { loading }] = useReportPublicationMutation();
  const { cache } = useApolloClient();

  const reportPublicationOnLens = async ({
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
    toast.promise(
      Promise.all(
        subreasons.map(async (subreason) => {
          await reportPublicationOnLens({
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
      disabled={loading || hasReported}
      icon={icon}
      onClick={() => reportPublication({ subreasons, type })}
      outline
      size="sm"
      variant="warning"
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
      <SuspendButton
        onClick={() => {
          reportPublication({
            subreasons: [
              PublicationReportingSpamSubreason.FakeEngagement,
              PublicationReportingSpamSubreason.LowSignal,
              PublicationReportingSpamSubreason.Misleading
            ],
            type: 'suspend'
          });
        }}
        publication={publication}
      />
    </span>
  );
};

export default GardenerActions;
