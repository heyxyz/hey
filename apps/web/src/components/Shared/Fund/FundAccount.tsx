import errorToast from "@helpers/errorToast";
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Button, Card, Image, Input, Spinner } from "@hey/ui";
import {
  type ChangeEvent,
  type FC,
  type RefObject,
  useRef,
  useState
} from "react";
import toast from "react-hot-toast";
import usePreventScrollOnNumberInput from "src/hooks/usePreventScrollOnNumberInput";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { type Address, formatUnits, parseEther } from "viem";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import Loader from "../Loader";

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

const FundAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const [amount, setAmount] = useState(2);
  const [other, setOther] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);
  const { address } = useAccount();

  const { data: accountBalanceData, isLoading: accountBalanceLoading } =
    useBalance({
      address: currentAccount?.address,
      token: DEFAULT_COLLECT_TOKEN as Address,
      query: { refetchInterval: 2000 }
    });

  const { data: walletBalanceData, isLoading: walletBalanceLoading } =
    useBalance({
      address,
      token: DEFAULT_COLLECT_TOKEN as Address,
      query: { refetchInterval: 2000 }
    });

  const { writeContractAsync, isPending } = useWriteContract();

  if (accountBalanceLoading || walletBalanceLoading) {
    return <Loader message="Loading balance..." className="my-10" />;
  }

  const accountBalance = accountBalanceData
    ? Number.parseFloat(formatUnits(accountBalanceData.value, 18)).toFixed(2)
    : 0;

  const walletBalance = walletBalanceData
    ? Number.parseFloat(formatUnits(walletBalanceData.value, 18)).toFixed(2)
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
        args: [currentAccount?.address, parseEther(amount.toString())]
      });

      return toast.success("Funded account successfully");
    } catch (error) {
      return errorToast(error);
    }
  };

  return (
    <div className="m-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          className="size-12 rounded-full"
          src={`${STATIC_IMAGES_URL}/tokens/gho.svg`}
          alt="GHO"
        />
        <div className="font-bold text-2xl">{accountBalance} GHO</div>
        <div className="ld-text-gray-500 text-sm">
          GHO enables various on-chain and Hey-specific actions.
        </div>
      </div>
      <Card className="mt-5">
        <div className="mx-5 my-3">
          <b>Purchase</b>
        </div>
        <div className="divider" />
        <div className="space-y-5 p-5">
          <div className="flex space-x-4">
            <Button
              className="w-full"
              onClick={() => handleSetAmount(2)}
              outline={amount !== 2}
            >
              2 GHO
            </Button>
            <Button
              className="w-full"
              onClick={() => handleSetAmount(5)}
              outline={amount !== 5}
            >
              5 GHO
            </Button>
            <Button
              className="w-full"
              onClick={() => handleSetAmount(10)}
              outline={amount !== 10}
            >
              10 GHO
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
                placeholder="300"
                ref={inputRef}
                type="number"
                value={amount}
              />
            </div>
          ) : null}
          {isPending ? (
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
              <b>Fund {amount} GHO</b>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FundAccount;
