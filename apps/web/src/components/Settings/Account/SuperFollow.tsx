import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LensHub } from "@hey/abis";
import {
  ADDRESS_PLACEHOLDER,
  DEFAULT_COLLECT_TOKEN,
  LENS_HUB,
  STATIC_IMAGES_URL
} from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import { SETTINGS } from "@hey/data/tracking";
import checkDispatcherPermissions from "@hey/helpers/checkDispatcherPermissions";
import getSignature from "@hey/helpers/getSignature";
import {
  FollowModuleType,
  useBroadcastOnchainMutation,
  useCreateSetFollowModuleTypedDataMutation
} from "@hey/lens";
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
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useNonceStore } from "src/store/non-persisted/useNonceStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useAllowedTokensStore } from "src/store/persisted/useAllowedTokensStore";
import { useSignTypedData, useWriteContract } from "wagmi";
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
  const {
    decrementLensHubOnchainSigNonce,
    incrementLensHubOnchainSigNonce,
    lensHubOnchainSigNonce
  } = useNonceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    DEFAULT_COLLECT_TOKEN
  );
  const handleWrongNetwork = useHandleWrongNetwork();
  const { canBroadcast } = checkDispatcherPermissions(currentAccount);

  const form = useZodForm({
    defaultValues: {
      amount:
        currentAccount?.followModule?.__typename === "FeeFollowModuleSettings"
          ? currentAccount?.followModule?.amount.value
          : "",
      recipient: currentAccount?.ownedBy.address
    },
    schema: newSuperFollowSchema
  });

  const onCompleted = (__typename?: "RelayError" | "RelaySuccess") => {
    if (__typename === "RelayError") {
      return;
    }

    setIsLoading(false);
    toast.success("Super follow updated");
    Leafwatch.track(SETTINGS.ACCOUNT.SET_SUPER_FOLLOW);
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        onError(error);
        decrementLensHubOnchainSigNonce();
      },
      onSuccess: () => {
        onCompleted();
        incrementLensHubOnchainSigNonce();
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: "setFollowModule"
    });
  };

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createSetFollowModuleTypedData] =
    useCreateSetFollowModuleTypedDataMutation({
      onCompleted: async ({ createSetFollowModuleTypedData }) => {
        const { id, typedData } = createSetFollowModuleTypedData;
        const { followModule, followModuleInitData, profileId } =
          typedData.value;
        const args = [profileId, followModule, followModuleInitData];
        await handleWrongNetwork();

        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain.__typename === "RelayError") {
            return await write({ args });
          }

          return;
        }

        return await write({ args });
      },
      onError
    });

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
          options: { overrideSigNonce: lensHubOnchainSigNonce },
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
