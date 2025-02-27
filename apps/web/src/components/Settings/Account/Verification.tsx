import isVerified from "@helpers/isVerified";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Button, Card, H5, Modal } from "@hey/ui";
import { type FC, useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const Verification: FC = () => {
  const { currentAccount } = useAccountStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <Card className="space-y-2 p-5">
      <H5>Verified</H5>
      {isVerified(currentAccount?.address) ? (
        <div className="flex items-center space-x-1.5">
          <span>Believe it. Yes, you're really verified.</span>
          <CheckBadgeIcon className="size-5 text-brand-500" />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            We're here to assist you in getting verified. Please complete the
            form below, and we will respond promptly. Please note that we might
            take some time.
          </div>
          <Button onClick={() => setShowModal(true)}>Fill out the form</Button>
        </div>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Verification Form"
        size="lg"
      >
        <iframe
          title="Verification Form"
          src="https://yoginth.notion.site/ebd/1a0191ff51ed801faf66e1eabf0bf691"
          width="100%"
          height="600"
        />
      </Modal>
    </Card>
  );
};

export default Verification;
