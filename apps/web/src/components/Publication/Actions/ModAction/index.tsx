import type { AnyPublication, ReportPublicationRequest } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { GARDENER } from '@hey/data/tracking';
import {
  PublicationReportingSpamSubreason,
  useReportPublicationMutation
} from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

interface ModActionProps {
  className?: string;
  publication: AnyPublication;
}

const ModAction: FC<ModActionProps> = ({ className = '', publication }) => {
  const setShowModActionAlert = useGlobalAlertStateStore(
    (state) => state.setShowModActionAlert
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
      for: publication?.id,
      reason: {
        [type]: {
          reason: type.replace('Reason', '').toUpperCase(),
          subreason
        }
      }
    };

    return await createReport({
      onCompleted: () => {
        setShowModActionAlert(false, null);
      },
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
        toast.promise(
          Promise.all(
            config.map(async ({ subreason, type }) => {
              await reportPublication({ subreason, type });
              Leafwatch.track(GARDENER.REPORT, {
                report_publication_id: publication?.id,
                report_reason: type,
                report_subreason: subreason
              });
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
      className={cn('flex flex-wrap items-center gap-3 text-sm', className)}
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
        label="Poor content"
      />
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.LowSignal,
            type: 'spamReason'
          }
        ]}
        icon={<BanknotesIcon className="size-4" />}
        label="Stop Sponsor"
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
        label="Poor content & Stop Sponsor"
      />
    </span>
  );
};

export default ModAction;
