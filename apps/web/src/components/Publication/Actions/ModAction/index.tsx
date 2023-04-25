import { CashIcon, StatusOfflineIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { Publication } from 'lens';
import { PublicationReportingSpamSubreason, useReportPublicationMutation } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/alerts';
import { MOD } from 'src/tracking';
import { Button } from 'ui';

interface ModActionProps {
  publication: Publication;
  className?: string;
}

const ModAction: FC<ModActionProps> = ({ publication, className = '' }) => {
  const setShowModActionAlert = useGlobalAlertStateStore((state) => state.setShowModActionAlert);
  const [createReport, { loading }] = useReportPublicationMutation();

  const reportPublication = async ({ type, subreason }: { type: string; subreason: string }) => {
    return await createReport({
      variables: {
        request: {
          publicationId: publication?.id,
          reason: { [type]: { reason: type.replace('Reason', '').toUpperCase(), subreason } }
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
      onClick={() => {
        reportPublication({ type, subreason });
        Mixpanel.track(MOD.REPORT, {
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
        subreason={PublicationReportingSpamSubreason.SomethingElse}
        icon={<CashIcon className="h-4 w-4" />}
        label={t`Relayer spam`}
      />
      <ReportButton
        type="spamReason"
        subreason={PublicationReportingSpamSubreason.LowSignal}
        icon={<StatusOfflineIcon className="h-4 w-4" />}
        label={t`Low signal spam`}
      />
    </span>
  );
};

export default ModAction;
