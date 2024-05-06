import type { MirrorablePublication, ModReport, Profile } from '@hey/lens';
import type { FC } from 'react';

import Reports from '@components/Mod/ReportsFeed/Reports';
import SuspendButton from '@components/Publication/Actions/HigherActions/SuspendButton';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import {
  ChatBubbleOvalLeftEllipsisIcon,
  EyeIcon,
  FlagIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import formatDate from '@hey/helpers/datetime/formatDate';
import { Button, Modal } from '@hey/ui';
import { useState } from 'react';

import Dispute from './Dispute';

interface ReportDetailsProps {
  hideViewReportsButton?: boolean;
  report: ModReport;
}

const ReportDetails: FC<ReportDetailsProps> = ({
  hideViewReportsButton = false,
  report
}) => {
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  return (
    <div className="m-5 flex flex-wrap items-center justify-between gap-y-3">
      <div className="max-w-md">
        <div>
          <b>Reason:</b> {report.reason}
        </div>
        <div>
          <b>Subreason:</b> {report.subreason}
        </div>
        {report.additionalInfo ? (
          <div className="line-clamp-1" title={report.additionalInfo}>
            <b>Additional info:</b> {report.additionalInfo}
          </div>
        ) : null}
        <div>
          <b>Reported at:</b>{' '}
          {formatDate(report.createdAt, 'MMM D, YYYY - hh:mm:ss A')}
        </div>
        <div className="mt-2">
          <SmallUserProfile profile={report.reporter as Profile} />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        {!hideViewReportsButton ? (
          <Button
            icon={<EyeIcon className="size-4" />}
            onClick={() => setShowReportsModal(true)}
            outline
            size="sm"
          >
            View other reports
          </Button>
        ) : null}
        <Modal
          icon={<FlagIcon className="size-5 text-red-500" />}
          onClose={() => setShowReportsModal(false)}
          show={showReportsModal}
          size="md"
          title="Reports"
        >
          <Reports publicationId={report.reportedPublication?.id} />
        </Modal>
        <Button
          icon={<HandRaisedIcon className="size-4 text-red-500" />}
          onClick={() => setShowDisputeModal(true)}
          outline
          size="sm"
          variant="danger"
        >
          Dispute this report
        </Button>
        <Modal
          icon={<ChatBubbleOvalLeftEllipsisIcon className="size-5" />}
          onClose={() => setShowDisputeModal(false)}
          show={showDisputeModal}
          title="Dispute this report"
        >
          <Dispute report={report} setShowDisputeModal={setShowDisputeModal} />
        </Modal>
        <SuspendButton
          publication={report.reportedPublication as MirrorablePublication}
          title="Suspend the profile"
        />
      </div>
    </div>
  );
};

export default ReportDetails;
