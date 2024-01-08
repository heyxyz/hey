import { HEY_API_URL } from '@hey/data/constants';
import {
  PublicationReportingFraudSubreason,
  PublicationReportingIllegalSubreason,
  PublicationReportingSensitiveSubreason,
  PublicationReportingSpamSubreason
} from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import { type FC, useState } from 'react';
import { toast } from 'react-hot-toast';

interface TrustedProfilesActionsProps {
  className?: string;
  publicationId: string;
}

const TrustedProfilesActions: FC<TrustedProfilesActionsProps> = ({
  className = '',
  publicationId
}) => {
  const [disabled, setDisabled] = useState(false);

  const reportPublication = async (reason: string) => {
    try {
      setDisabled(true);
      return await axios.post(
        `${HEY_API_URL}/trusted/report`,
        { id: publicationId, reason },
        { headers: getAuthWorkerHeaders() }
      );
    } finally {
      setDisabled(false);
    }
  };

  interface ReportButtonProps {
    reason: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({ reason }) => (
    <Button
      disabled={disabled}
      onClick={() => {
        toast.promise(reportPublication(reason), {
          error: 'Error reporting publication',
          loading: 'Reporting publication...',
          success: 'Publication reported successfully'
        });
      }}
      outline
      size="sm"
      variant="warning"
    >
      {reason.toLowerCase().replaceAll('_', ' ')}
    </Button>
  );

  return (
    <span className={className} onClick={stopEventPropagation}>
      <div className="mt-3 space-y-2 text-sm">
        <b>Fraud reasons</b>
        <div className="flex flex-wrap items-center gap-3">
          {Object.values(PublicationReportingFraudSubreason).map((reason) => (
            <ReportButton key={reason} reason={reason} />
          ))}
        </div>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <b>Illegal reasons</b>
        <div className="flex flex-wrap items-center gap-3">
          {Object.values(PublicationReportingIllegalSubreason).map((reason) => (
            <ReportButton key={reason} reason={reason} />
          ))}
        </div>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <b>Sensitive reasons</b>
        <div className="flex flex-wrap items-center gap-3">
          {Object.values(PublicationReportingSensitiveSubreason).map(
            (reason) => (
              <ReportButton key={reason} reason={reason} />
            )
          )}
        </div>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <b>Spam reasons</b>
        <div className="flex flex-wrap items-center gap-3">
          {Object.values(PublicationReportingSpamSubreason).map((reason) => (
            <ReportButton key={reason} reason={reason} />
          ))}
        </div>
      </div>
    </span>
  );
};

export default TrustedProfilesActions;
