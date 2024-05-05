import type {
  MirrorablePublication,
  ReportPublicationRequest
} from '@hey/lens';

import { Leafwatch } from '@helpers/leafwatch';
import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { GARDENER } from '@hey/data/tracking';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import {
  PublicationReportingSpamSubreason,
  useReportPublicationMutation
} from '@hey/lens';
import { useApolloClient } from '@hey/lens/apollo';
import { Button } from '@hey/ui';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/router';
import { type FC, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

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

  const reportPublication = async ({
    subreason,
    type
  }: {
    subreason: string;
    type: string;
  }) => {
    if (pathname === '/mod') {
      cache.evict({ id: cache.identify(publication) });
    }

    // Variables
    const request: ReportPublicationRequest = {
      for: publication.id,
      reason: {
        [type]: { reason: type.replace('Reason', '').toUpperCase(), subreason }
      }
    };

    return await createReport({
      onCompleted: () => setShowGardenerActionsAlert(false, null),
      variables: { request }
    });
  };

  interface ReportButtonProps {
    config: { subreason: string; type: string }[];
    icon: ReactNode;
    label: string;
    type: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({
    config,
    icon,
    label,
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

        toast.promise(
          Promise.all(
            config.map(async ({ subreason, type }) => {
              await reportPublication({ subreason, type });
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
        config={[
          {
            subreason: PublicationReportingSpamSubreason.LowSignal,
            type: 'spamReason'
          }
        ]}
        icon={<DocumentTextIcon className="size-4" />}
        label="Spam"
        type="spam"
      />
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.FakeEngagement,
            type: 'spamReason'
          }
        ]}
        icon={<BanknotesIcon className="size-4" />}
        label="Un-sponsor"
        type="un-sponsor"
      />
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.FakeEngagement,
            type: 'spamReason'
          },
          {
            subreason: PublicationReportingSpamSubreason.LowSignal,
            type: 'spamReason'
          }
        ]}
        icon={<BanknotesIcon className="size-4" />}
        label="Both"
        type="both"
      />
    </span>
  );
};

export default GardenerActions;
