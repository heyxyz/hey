import errorToast from "@helpers/errorToast";
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import {
  type Account,
  AccountFollowRuleType,
  useUpdateAccountFollowRulesMutation
} from "@hey/indexer";
import { Button, Card, CardHeader, Image, Input, Tooltip } from "@hey/ui";
import { useRouter } from "next/router";
import { type FC, type RefObject, useRef, useState } from "react";
import toast from "react-hot-toast";
import usePreventScrollOnNumberInput from "src/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const SuperFollow: FC = () => {
  const { reload } = useRouter();
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);

  const account = currentAccount as Account;
  const simplePaymentRule = [
    ...account.rules.required,
    ...account.rules.anyOf
  ].find((rule) => rule.type === AccountFollowRuleType.SimplePayment);

  const onCompleted = () => {
    setIsLoading(false);
    reload();
    toast.success("Payment rule updated");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [updateAccountFollowRules] = useUpdateAccountFollowRulesMutation({
    onCompleted: async ({ updateAccountFollowRules }) => {
      if (
        updateAccountFollowRules.__typename ===
        "UpdateAccountFollowRulesResponse"
      ) {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: updateAccountFollowRules,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleUpdateRule = (remove: boolean) => {
    if (isSuspended) return toast.error(Errors.Suspended);

    setIsLoading(true);

    return updateAccountFollowRules({
      variables: {
        request: {
          ...(remove
            ? { toRemove: [simplePaymentRule?.id] }
            : {
                toAdd: {
                  required: [
                    {
                      simplePaymentRule: {
                        cost: {
                          currency: DEFAULT_COLLECT_TOKEN,
                          value: amount.toString()
                        },
                        recipient: account.address
                      }
                    }
                  ]
                }
              })
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader
        body="You can set a payment rule to super follow users."
        title="Super follow"
      />
      <div className="m-5 space-y-4">
        <Input
          label="Amount"
          placeholder="1"
          prefix={
            <Tooltip content="Payable in GHO" placement="top">
              <Image
                className="size-5"
                src={`${STATIC_IMAGES_URL}/tokens/gho.svg`}
                alt="GHO"
              />
            </Tooltip>
          }
          className="no-spinner"
          ref={inputRef}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <div className="flex justify-end space-x-2">
          {simplePaymentRule && (
            <Button
              variant="danger"
              disabled={isLoading}
              onClick={() => handleUpdateRule(true)}
            >
              Remove
            </Button>
          )}
          <Button disabled={isLoading} onClick={() => handleUpdateRule(false)}>
            Update
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SuperFollow;
