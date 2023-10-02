import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { GARDENER } from '@hey/data/tracking';
import type { Publication } from '@hey/lens';
import {
  PublicationReportingSpamSubreason,
  useReportPublicationMutation
} from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { FC, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/alerts';

interface ModActionProps {
  publication: Publication;
  className?: string;
}

const ModAction: FC<ModActionProps> = ({ publication, className = '' }) => {
  const setShowModActionAlert = useGlobalAlertStateStore(
    (state) => state.setShowModActionAlert
  );
  const [createReport, { loading }] = useReportPublicationMutation();

  const reportPublication = async ({
    type,
    subreason
  }: {
    type: string;
    subreason: string;
  }) => {
    return await createReport({
      variables: {
        request: {
          publicationId: publication?.id,
          reason: {
            [type]: {
              reason: type.replace('Reason', '').toUpperCase(),
              subreason
            }
          }
        }
      },
      onCompleted: () => {
        setShowModActionAlert(false, null);
      }
    });
  };

  interface ReportButtonProps {
    config: {
      type: string;
      subreason: string;
    }[];
    icon: ReactNode;
    label: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({ config, icon, label }) => (
    <Button
      disabled={loading}
      variant="warning"
      size="sm"
      outline
      icon={icon}
      onClick={() => {
        toast.promise(
          Promise.all(
            config.map(async ({ type, subreason }) => {
              await reportPublication({ type, subreason });
              Leafwatch.track(GARDENER.REPORT, {
                report_reason: type,
                report_subreason: subreason,
                report_publication_id: publication?.id
              });
            })
          ),
          {
            loading: t`Reporting publication...`,
            success: t`Publication reported successfully`,
            error: t`Error reporting publication`
          }
        );
      }}
    >
      {label}
    </Button>
  );

  return (
    <span
      className={cn('flex flex-wrap items-center gap-3 text-sm', className)}
      onClick={stopEventPropagation}
      aria-hidden="true"
    >
      <ReportButton
        config={[
          {
            type: 'spamReason',
            subreason: PublicationReportingSpamSubreason.FakeEngagement
          }
        ]}
        icon={<DocumentTextIcon className="h-4 w-4" />}
        label={t`Poor content`}
      />
      <ReportButton
        config={[
          {
            type: 'spamReason',
            subreason: PublicationReportingSpamSubreason.LowSignal
          }
        ]}
        icon={<BanknotesIcon className="h-4 w-4" />}
        label={t`Stop Sponsor`}
      />
      <ReportButton
        config={[
          {
            type: 'spamReason',
            subreason: PublicationReportingSpamSubreason.FakeEngagement
          },
          {
            type: 'spamReason',
            subreason: PublicationReportingSpamSubreason.LowSignal
          }
        ]}
        icon={<BanknotesIcon className="h-4 w-4" />}
        label={t`Poor content & Stop Sponsor`}
      />
    </span>
  );
};

export default ModAction;
