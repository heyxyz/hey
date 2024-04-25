import type { FC } from 'react';

import Reports from '@components/Mod/ReportsFeed/Reports';
import { FlagIcon } from '@heroicons/react/24/outline';
import { Button, Modal } from '@hey/ui';
import { useState } from 'react';

interface ViewReportsProps {
  id: string;
}

const ViewReports: FC<ViewReportsProps> = ({ id }) => {
  const [showReportsModal, setShowReportsModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowReportsModal(true)} outline size="sm">
        View reports
      </Button>
      <Modal
        icon={<FlagIcon className="size-5 text-red-500" />}
        onClose={() => setShowReportsModal(false)}
        show={showReportsModal}
        size="md"
        title="Reports"
      >
        <Reports profileId={id} />
      </Modal>
    </>
  );
};

export default ViewReports;
