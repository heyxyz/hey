import { CashIcon, DocumentTextIcon } from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import {
  PublicationReportingSpamSubreason,
  useReportPublicationMutation
} from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Button } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/alerts';
import { MOD } from 'src/tracking';

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
        toast.success(t`Publication reported successfully`);
        setShowModActionAlert(false, null);
      }
    });
  };

  const ReportButton = ({
    type,
    subreason,
    icon,
    label
  }: {
    type: string;
    subreason: string;
    icon: ReactNode;
    label: string;
  }) => (
    <Button
      disabled={loading}
      variant="warning"
      size="sm"
      outline
      icon={icon}
      onClick={async () => {
        await reportPublication({ type, subreason });
        Leafwatch.track(MOD.REPORT, {
          report_reason: type,
          report_subreason: subreason,
          report_publication_id: publication?.id
        });
      }}
    >
      {label}
    </Button>
  );

  return (
    <span
      className={clsx('flex flex-wrap items-center gap-3 text-sm', className)}
      onClick={stopEventPropagation}
      aria-hidden="true"
    >
      <ReportButton
        type="spamReason"
        subreason={PublicationReportingSpamSubreason.FakeEngagement}
        icon={<DocumentTextIcon className="h-4 w-4" />}
        label={t`Poor content`}
      />
      <ReportButton
        type="spamReason"
        subreason={PublicationReportingSpamSubreason.LowSignal}
        icon={<CashIcon className="h-4 w-4" />}
        label={t`Stop Sponsor`}
      />
    </span>
  );
};

export default ModAction;
