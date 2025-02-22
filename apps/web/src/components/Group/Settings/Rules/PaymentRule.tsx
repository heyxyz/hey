import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import errorToast from "@helpers/errorToast";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import {
  type Group,
  GroupRuleType,
  useUpdateGroupRulesMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button, Card, Image, Input, Tooltip } from "@hey/ui";
import { type FC, type RefObject, useRef, useState } from "react";
import toast from "react-hot-toast";
import usePreventScrollOnNumberInput from "src/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";

interface PaymentRuleProps {
  group: Group;
}

const PaymentRule: FC<PaymentRuleProps> = ({ group }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState(currentAccount?.address);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);

  const simplePaymentRule = [
    ...group.rules.required,
    ...group.rules.anyOf
  ].find((rule) => rule.type === GroupRuleType.SimplePayment);
  const [enabled, setEnabled] = useState(!!simplePaymentRule);

  const onCompleted = (hash: string) => {
    addSimpleOptimisticTransaction(hash, OptimisticTxType.UPDATE_GROUP_RULES);
    setIsLoading(false);
    setEnabled(false);
    toast.success("Payment rule updated");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [updateGroupRules] = useUpdateGroupRulesMutation({
    onCompleted: async ({ updateGroupRules }) => {
      return await handleTransactionLifecycle({
        transactionData: updateGroupRules,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleUpdateRule = (remove: boolean) => {
    if (isSuspended) return toast.error(Errors.Suspended);
    if (!simplePaymentRule) return setEnabled(false);

    setIsLoading(true);

    return updateGroupRules({
      variables: {
        request: {
          group: group.address,
          ...(remove
            ? { toRemove: [simplePaymentRule?.id] }
            : {
                toAdd: {
                  required: [
                    {
                      simplePaymentRule: {
                        cost: {
                          currency: DEFAULT_COLLECT_TOKEN,
                          value: amount
                        },
                        recipient: group.address
                      }
                    }
                  ]
                }
              })
        }
      }
    });
  };

  const handleToggle = async (on: boolean) => {
    if (!on) return await handleUpdateRule(true);
    setEnabled(on);
  };

  return (
    <>
      <ToggleWithHelper
        heading="Enable Payment Rule"
        description="Enable the payment rule to require users to pay a certain amount to join the group."
        disabled={isLoading}
        icon={<CurrencyDollarIcon className="size-5" />}
        on={enabled}
        setOn={handleToggle}
      />
      {enabled && (
        <Card className="flex flex-col space-y-4 p-5">
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
          <Input
            label="Recipient"
            placeholder="0x123..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              disabled={isLoading}
              onClick={() => handleUpdateRule(false)}
            >
              Update
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};

export default PaymentRule;
