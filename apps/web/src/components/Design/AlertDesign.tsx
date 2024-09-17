import { Alert, Button, Card, CardHeader } from "@hey/ui";
import { type FC, useState } from "react";

const AlertDesign: FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showDestructiveAlert, setShowDestructiveAlert] = useState(false);

  return (
    <Card>
      <CardHeader title="Alert" />
      <Alert
        description="Normal alert"
        onClose={() => setShowAlert(false)}
        show={showAlert}
        title="Normal alert"
      />
      <Alert
        confirmText="Yes"
        description="Destructive alert"
        isDestructive
        onClose={() => setShowDestructiveAlert(false)}
        onConfirm={() => setShowDestructiveAlert(false)}
        show={showDestructiveAlert}
        title="Destructive alert"
      />
      <div className="m-5 flex gap-5">
        <Button onClick={() => setShowAlert(true)} outline>
          Show normal alert
        </Button>
        <Button onClick={() => setShowDestructiveAlert(true)} outline>
          Show destructive alert
        </Button>
      </div>
    </Card>
  );
};

export default AlertDesign;
