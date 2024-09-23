import { Card, CardHeader, ErrorMessage } from "@hey/ui";
import type { FC } from "react";

const ErrorMessageDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Error Message" />
      <div className="m-5 flex items-center gap-5">
        <ErrorMessage
          error={{
            message: "Simple error message",
            name: "Error"
          }}
          title="Title"
        />
        <ErrorMessage
          className="rounded-none"
          error={{
            message: "Eror message with custom class",
            name: "Error"
          }}
          title="Title"
        />
      </div>
    </Card>
  );
};

export default ErrorMessageDesign;
