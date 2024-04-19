import { Errors } from '@hey/data';
import { Button, Input } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { type FC, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import usePreventScrollOnNumberInput from 'src/hooks/usePreventScrollOnNumberInput';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface ActionProps {
  closePopover: () => void;
  triggerConfetti: () => void;
}

const Action: FC<ActionProps> = ({ closePopover, triggerConfetti }) => {
  const { currentProfile } = useProfileStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(50);
  const [other, setOther] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  const { isSuspended } = useProfileRestriction();

  const onSetAmount = (amount: number) => {
    setAmount(amount);
    setOther(false);
  };

  const onOtherAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(value);
  };

  const handleTip = () => {
    if (!currentProfile) {
      closePopover();
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      alert('Coming soon!');
      closePopover();
      triggerConfetti();
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-5 space-y-3">
      {true ? (
        <div className="ld-text-gray-500 ml-auto text-xs">Balance: 1 MATIC</div>
      ) : null}
      <div className="space-x-2">
        <Button
          disabled={!currentProfile}
          onClick={() => onSetAmount(50)}
          outline={amount !== 50}
          size="sm"
        >
          50
        </Button>
        <Button
          disabled={!currentProfile}
          onClick={() => onSetAmount(100)}
          outline={amount !== 100}
          size="sm"
        >
          100
        </Button>
        <Button
          disabled={!currentProfile}
          onClick={() => onSetAmount(200)}
          outline={amount !== 200}
          size="sm"
        >
          200
        </Button>
        <Button
          disabled={!currentProfile}
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
            max={1000 || 0}
            min={1}
            onChange={onOtherAmount}
            placeholder="300"
            ref={inputRef}
            type="number"
            value={amount}
          />
        </div>
      ) : null}
      {currentProfile ? (
        <Button
          className="w-full"
          disabled={amount < 1 || isLoading}
          onClick={handleTip}
        >
          Tip {amount} MATIC
        </Button>
      ) : (
        <Button className="w-full" onClick={handleTip}>
          Log in to tip
        </Button>
      )}
    </div>
  );
};

export default Action;
