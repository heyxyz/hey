import type { FC } from 'react';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Button, Card, CardHeader } from '@hey/ui';

const Buttons: FC = () => {
  const ButtonVariants: FC<{
    outline: boolean;
  }> = ({ outline }) => {
    return (
      <div className="flex flex-wrap gap-5">
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-dashed border-purple-500 p-5">
          <Button
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="sm"
          >
            Button
          </Button>
          <Button
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="sm"
          >
            Button
          </Button>
          <Button
            disabled
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="sm"
          >
            Button
          </Button>
        </div>
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-dashed border-purple-500 p-5">
          <Button icon={<PlusIcon className="size-5" />} outline={outline}>
            Button
          </Button>
          <Button icon={<PlusIcon className="size-5" />} outline={outline}>
            Button
          </Button>
          <Button
            disabled
            icon={<PlusIcon className="size-5" />}
            outline={outline}
          >
            Button
          </Button>
        </div>
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-dashed border-purple-500 p-5">
          <Button
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="lg"
          >
            Button
          </Button>
          <Button
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="lg"
          >
            Button
          </Button>
          <Button
            disabled
            icon={<PlusIcon className="size-5" />}
            outline={outline}
            size="lg"
          >
            Button
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader title="Buttons" />
      <ButtonVariants outline={false} />\
      <ButtonVariants outline={true} />
    </Card>
  );
};

export default Buttons;
