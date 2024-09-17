import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardHeader, Modal } from "@hey/ui";
import { type FC, useState } from "react";

const ModalDesign: FC = () => {
  const [showXsModal, setShowXsModal] = useState(false);
  const [showSmModal, setShowSmModal] = useState(false);
  const [showMdModal, setShowMdModal] = useState(false);
  const [showLgModal, setShowLgModal] = useState(false);

  const children = (
    <div className="p-5">The quick brown fox jumps over the lazy dog.</div>
  );

  return (
    <Card>
      <CardHeader title="Modal" />
      <Modal
        icon={<ShoppingBagIcon className="size-5" />}
        onClose={() => setShowXsModal(false)}
        show={showXsModal}
        size="xs"
        title="Extra small modal"
      >
        {children}
      </Modal>
      <Modal
        icon={<ShoppingBagIcon className="size-5" />}
        onClose={() => setShowSmModal(false)}
        show={showSmModal}
        size="sm"
        title="Small modal"
      >
        {children}
      </Modal>
      <Modal
        icon={<ShoppingBagIcon className="size-5" />}
        onClose={() => setShowMdModal(false)}
        show={showMdModal}
        size="md"
        title="Medium modal"
      >
        {children}
      </Modal>
      <Modal
        icon={<ShoppingBagIcon className="size-5" />}
        onClose={() => setShowLgModal(false)}
        show={showLgModal}
        size="lg"
        title="Large modal"
      >
        {children}
      </Modal>
      <div className="m-5 flex gap-5">
        <Button onClick={() => setShowXsModal(true)} outline>
          Show extra small modal
        </Button>
        <Button onClick={() => setShowSmModal(true)} outline>
          Show small modal
        </Button>
        <Button onClick={() => setShowMdModal(true)} outline>
          Show medium modal
        </Button>
        <Button onClick={() => setShowLgModal(true)} outline>
          Show large modal
        </Button>
      </div>
    </Card>
  );
};

export default ModalDesign;
