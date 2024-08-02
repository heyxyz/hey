import type { FC } from 'react';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Button, Card, CardHeader, Tooltip } from '@hey/ui';

const Buttons: FC = () => {
  const ButtonVariants: FC<{
    outline: boolean;
  }> = ({ outline }) => {
    return (
      <div className="flex flex-wrap gap-5">
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-dashed border-purple-500 p-5">
          <Tooltip
            content={`Normal small ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              icon={<PlusIcon className="size-5" />}
              outline={outline}
              size="sm"
            >
              Button
            </Button>
          </Tooltip>
          <Tooltip
            content={`Hover small ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              icon={<PlusIcon className="size-5" />}
              outline={outline}
              size="sm"
            >
              Button
            </Button>
          </Tooltip>
          <Tooltip
            content={`Disabled small ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              disabled
              icon={<PlusIcon className="size-5" />}
              outline={outline}
              size="sm"
            >
              Button
            </Button>
          </Tooltip>
        </div>
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-dashed border-purple-500 p-5">
          <Tooltip
            content={`Normal medium ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button icon={<PlusIcon className="size-5" />} outline={outline}>
              Button
            </Button>
          </Tooltip>
          <Tooltip
            content={`Hover medium ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button icon={<PlusIcon className="size-5" />} outline={outline}>
              Button
            </Button>
          </Tooltip>
          <Tooltip
            content={`Disabled medium ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              disabled
              icon={<PlusIcon className="size-5" />}
              outline={outline}
            >
              Button
            </Button>
          </Tooltip>
        </div>
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-dashed border-purple-500 p-5">
          <Tooltip
            content={`Normal large ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              icon={<PlusIcon className="size-5" />}
              outline={outline}
              size="lg"
            >
              Button
            </Button>
          </Tooltip>
          <Tooltip
            content={`Hover large ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              icon={<PlusIcon className="size-5" />}
              outline={outline}
              size="lg"
            >
              Button
            </Button>
          </Tooltip>
          <Tooltip
            content={`Disabled large ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              disabled
              icon={<PlusIcon className="size-5" />}
              outline={outline}
              size="lg"
            >
              Button
            </Button>
          </Tooltip>
        </div>
        <div className="m-5 flex size-fit flex-col gap-y-5 rounded-xl border-2 border-dashed border-purple-500 p-5">
          <Tooltip
            content={`Secondary large ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              icon={<PlusIcon className="size-5" />}
              outline={outline}
              size="lg"
              variant="secondary"
            >
              Button
            </Button>
          </Tooltip>
          <Tooltip
            content={`Warning large ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              icon={<PlusIcon className="size-5" />}
              outline={outline}
              size="lg"
              variant="warning"
            >
              Button
            </Button>
          </Tooltip>
          <Tooltip
            content={`Danger large ${outline ? 'outline' : 'solid'} button`}
            placement="top"
          >
            <Button
              icon={<PlusIcon className="size-5" />}
              outline={outline}
              size="lg"
              variant="danger"
            >
              Button
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader title="Buttons" />
      <ButtonVariants outline={false} />
      <ButtonVariants outline={true} />
    </Card>
  );
};

export default Buttons;
