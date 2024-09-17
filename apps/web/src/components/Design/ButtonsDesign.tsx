import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardHeader } from "@hey/ui";
import type { FC } from "react";

const ButtonsDesign: FC = () => {
  const ButtonVariants: FC<{
    outline: boolean;
  }> = ({ outline }) => {
    return (
      <div className="flex flex-wrap gap-5">
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-purple-500 border-dashed p-5">
          <Button
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="sm"
          >
            Active
          </Button>
          <Button
            disabled
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="sm"
          >
            Disabled
          </Button>
        </div>
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-purple-500 border-dashed p-5">
          <Button icon={<PlusIcon className="size-5" />} outline={outline}>
            Active
          </Button>
          <Button
            disabled
            icon={<PlusIcon className="size-5" />}
            outline={outline}
          >
            Disabled
          </Button>
        </div>
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-purple-500 border-dashed p-5">
          <Button
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="lg"
          >
            Active
          </Button>
          <Button
            disabled
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="lg"
          >
            Disabled
          </Button>
        </div>
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-purple-500 border-dashed p-5">
          <Button
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="lg"
            variant="danger"
          >
            Active
          </Button>
          <Button
            disabled
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="lg"
            variant="danger"
          >
            Disabled
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader title="Button" />
      <ButtonVariants outline={false} />
      <ButtonVariants outline={true} />
    </Card>
  );
};

export default ButtonsDesign;
