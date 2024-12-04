import errorToast from "@helpers/errorToast";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ADDRESS_PLACEHOLDER,
  DEFAULT_COLLECT_TOKEN,
  STATIC_IMAGES_URL
} from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import {
  Button,
  Card,
  CardHeader,
  Form,
  Input,
  Select,
  useZodForm
} from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useAllowedTokensStore } from "src/store/persisted/useAllowedTokensStore";
import { object, string } from "zod";

const newSuperFollowSchema = object({
  amount: string().min(1, { message: "Invalid amount" }),
  recipient: string()
    .max(42, { message: "Ethereum address should be within 42 characters" })
    .regex(Regex.ethereumAddress, { message: "Invalid Ethereum address" })
});

const SuperFollow: FC = () => {
  const { currentAccount } = useAccountStore();
  const { allowedTokens } = useAllowedTokensStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    DEFAULT_COLLECT_TOKEN
  );

  const form = useZodForm({
    defaultValues: {
      amount:
        currentAccount?.followModule?.__typename === "FeeFollowModuleSettings"
          ? currentAccount?.followModule?.amount.value
          : "",
      recipient: currentAccount?.owner
    },
    schema: newSuperFollowSchema
  });

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const handleSetSuperFollow = async (
    amount: null | string,
    recipient: null | string
  ) => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      return await createSetFollowModuleTypedData({
        variables: {
          request: {
            followModule: amount
              ? {
                  feeFollowModule: {
                    amount: { currency: selectedCurrency, value: amount },
                    recipient
                  }
                }
              : { freeFollowModule: true }
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const followType = currentAccount?.followModule?.type;

  return (
    <Card>
      <CardHeader
        body="Setting Super follow makes users spend crypto to follow you, and it's
        a good way to earn it, you can change the amount and currency or
        disable/enable it anytime."
        title="Set Super follow"
      />
      <Form
        className="m-5 space-y-4"
        form={form}
        onSubmit={async ({ amount, recipient }) => {
          await handleSetSuperFollow(amount, recipient);
        }}
      >
        <div>
          <div className="label">Select currency</div>
          <Select
            defaultValue={
              currentAccount?.followModule?.__typename ===
              "FeeFollowModuleSettings"
                ? currentAccount?.followModule?.amount.asset.contract.address
                : undefined
            }
            iconClassName="size-4"
            onChange={(value) => setSelectedCurrency(value)}
            options={allowedTokens?.map((token) => ({
              icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
              label: token.name,
              selected: token.contractAddress === selectedCurrency,
              value: token.contractAddress
            }))}
          />
        </div>
        <Input
          label="Follow amount"
          max="100000"
          min="0"
          placeholder="5"
          step="0.0001"
          type="number"
          {...form.register("amount")}
        />
        <Input
          label="Funds recipient"
          placeholder={ADDRESS_PLACEHOLDER}
          type="text"
          {...form.register("recipient")}
        />
        <div className="ml-auto">
          <div className="block space-x-0 space-y-2 sm:flex sm:space-x-2 sm:space-y-0">
            {followType === FollowModuleType.FeeFollowModule ? (
              <Button
                disabled={isLoading}
                icon={<XMarkIcon className="size-4" />}
                onClick={() => handleSetSuperFollow(null, null)}
                outline
                type="button"
                variant="danger"
              >
                Disable Super follow
              </Button>
            ) : null}
            <Button
              disabled={isLoading}
              icon={<StarIcon className="size-4" />}
              type="submit"
            >
              {followType === FollowModuleType.FeeFollowModule
                ? "Update Super follow"
                : "Set Super follow"}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default SuperFollow;
