import Reports from "@components/Mod/ReportsFeed/Reports";
import { Button, Modal } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";

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
        onClose={() => setShowReportsModal(false)}
        show={showReportsModal}
        size="md"
        title="Reports"
      >
        <Reports accountId={id} />
      </Modal>
    </>
  );
};

export default ViewReports;
