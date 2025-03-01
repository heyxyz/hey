import errorToast from "@helpers/errorToast";
import { DEFAULT_COLLECT_TOKEN } from "@hey/data/constants";
import { Button, Card, Input, Spinner } from "@hey/ui";
import {
  type ChangeEvent,
  type FC,
  type RefObject,
  useRef,
  useState
} from "react";
import toast from "react-hot-toast";
import usePreventScrollOnNumberInput from "src/hooks/usePreventScrollOnNumberInput";
import { type Address, formatUnits, parseEther } from "viem";
import { useAccount, useBalance, useWriteContract } from "wagmi";

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

interface FundProps {
  recipient: Address;
  isHeyTip?: boolean;
  onSuccess?: () => void;
}

const Fund: FC<FundProps> = ({ recipient, isHeyTip, onSuccess }) => {
  const [amount, setAmount] = useState(2);
  const [other, setOther] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);
  const { address } = useAccount();

  const { data, isLoading } = useBalance({
    address,
    token: DEFAULT_COLLECT_TOKEN as Address,
    query: { refetchInterval: 2000 }
  });

  const { writeContractAsync, isPending } = useWriteContract();

  const walletBalance = data
    ? Number.parseFloat(formatUnits(data.value, 18)).toFixed(2)
    : 0;

  const onOtherAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(value);
  };

  const handleSetAmount = (amount: number) => {
    setAmount(amount);
    setOther(false);
  };

  const handleFund = async () => {
    try {
      await writeContractAsync({
        abi: ABI,
        functionName: "transfer",
        address: DEFAULT_COLLECT_TOKEN as Address,
        args: [recipient, parseEther(amount.toString())]
      });

      onSuccess?.();

      return toast.success(
        isHeyTip ? "Thank you for your support!" : "Funded account successfully"
      );
    } catch (error) {
      return errorToast(error);
    }
  };

  return (
    <Card className="mt-5">
      <div className="mx-5 my-3 flex items-center justify-between">
        <b>{isHeyTip ? "Tip" : "Purchase"}</b>
        {isLoading ? (
          <span className="shimmer h-2.5 w-20 rounded-full" />
        ) : (
          <span className="ld-text-gray-500 text-sm">
            Balance: {walletBalance} wGHO
          </span>
        )}
      </div>
      <div className="divider" />
      <div className="space-y-5 p-5">
        <div className="flex space-x-4 text-sm">
          <Button
            className="w-full"
            onClick={() => handleSetAmount(2)}
            outline={amount !== 2}
          >
            2 wGHO
          </Button>
          <Button
            className="w-full"
            onClick={() => handleSetAmount(5)}
            outline={amount !== 5}
          >
            5 wGHO
          </Button>
          <Button
            className="w-full"
            onClick={() => handleSetAmount(10)}
            outline={amount !== 10}
          >
            10 wGHO
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              handleSetAmount(other ? 2 : 20);
              setOther(!other);
            }}
            outline={!other}
          >
            Other
          </Button>
        </div>
        {other ? (
          <div>
            <Input
              className="no-spinner"
              max={1000}
              onChange={onOtherAmount}
              prefix="wGHO"
              placeholder="300"
              ref={inputRef}
              type="number"
              value={amount}
            />
          </div>
        ) : null}
        {isLoading || isPending ? (
          <Button
            className="flex w-full justify-center"
            disabled
            icon={<Spinner className="my-1" size="xs" />}
          />
        ) : Number(walletBalance) < amount ? (
          <Button disabled className="w-full">
            <b>Insufficient balance</b>
          </Button>
        ) : (
          <Button disabled={!amount} className="w-full" onClick={handleFund}>
            <b>
              {isHeyTip ? "Tip" : "Purchase"} {amount} wGHO
            </b>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Fund;
