import type { AnyPublication } from '@hey/lens';

import { Button, Input } from '@hey/ui';
import { type FC, useRef, useState } from 'react';
import usePreventScrollOnNumberInput from 'src/hooks/usePreventScrollOnNumberInput';

interface ActionProps {
  publication: AnyPublication;
  triggerConfetti: () => void;
}

const Action: FC<ActionProps> = ({ publication, triggerConfetti }) => {
  const [amount, setAmount] = useState(50);
  const [other, setOther] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  const onSetAmount = (amount: number) => {
    setAmount(amount);
    setOther(false);
  };

  const onOtherAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value as unknown as number);
  };

  return (
    <div className="space-y-3">
      <div className="ld-text-gray-500 text-right text-xs">
        Allowance: 1000 BONSAI
      </div>
      <div className="space-x-3">
        <Button onClick={() => setAmount(50)} outline={amount !== 50} size="sm">
          50
        </Button>
        <Button
          onClick={() => onSetAmount(100)}
          outline={amount !== 100}
          size="sm"
        >
          100
        </Button>
        <Button
          onClick={() => onSetAmount(200)}
          outline={amount !== 200}
          size="sm"
        >
          200
        </Button>
        <Button
          onClick={() => {
            onSetAmount(other ? 50 : 300);
            setOther(!other);
          }}
          outline={!other}
          size="sm"
        >
          Other
        </Button>
      </div>
      {other ? (
        <div>
          <Input
            className="no-spinner"
            // Max to allowance
            max="1000"
            min="1"
            onChange={onOtherAmount}
            placeholder="300"
            ref={inputRef}
            type="number"
            value={amount}
          />
        </div>
      ) : null}
      <Button
        className="w-full"
        disabled={amount <= 0}
        onClick={triggerConfetti}
      >
        Tip {amount} BONSAI
      </Button>
    </div>
  );
};

export default Action;
