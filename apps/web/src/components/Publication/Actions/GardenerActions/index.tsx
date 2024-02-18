import type { ReportPublicationRequest } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { GARDENER } from '@hey/data/tracking';
import {
  PublicationReportingSpamSubreason,
  useReportPublicationMutation
} from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

interface GardenerActionsProps {
  publicationId: string;
}

const GardenerActions: FC<GardenerActionsProps> = ({ publicationId }) => {
  const setShowGardenerActionsAlert = useGlobalAlertStateStore(
    (state) => state.setShowGardenerActionsAlert
  );
  const [createReport, { loading }] = useReportPublicationMutation();

  const reportPublication = async ({
    subreason,
    type
  }: {
    subreason: string;
    type: string;
  }) => {
    // Variables
    const request: ReportPublicationRequest = {
      for: publicationId,
      reason: {
        [type]: {
          reason: type.replace('Reason', '').toUpperCase(),
          subreason
        }
      }
    };

    return await createReport({
      onCompleted: () => setShowGardenerActionsAlert(false, null),
      variables: { request }
    });
  };

  interface ReportButtonProps {
    config: {
      subreason: string;
      type: string;
    }[];
    icon: ReactNode;
    label: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({ config, icon, label }) => (
    <Button
      disabled={loading}
      icon={icon}
      onClick={() => {
        Leafwatch.track(GARDENER.REPORT, {
          publication_id: publicationId,
          type: label.toLowerCase()
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
            success: 'Publication reported successfully'
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
            subreason: PublicationReportingSpamSubreason.FakeEngagement,
            type: 'spamReason'
          }
        ]}
        icon={<DocumentTextIcon className="size-4" />}
        label="Spam"
      />
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.LowSignal,
            type: 'spamReason'
          }
        ]}
        icon={<BanknotesIcon className="size-4" />}
        label="Un-sponsor"
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
      />
    </span>
  );
};

export default GardenerActions;
