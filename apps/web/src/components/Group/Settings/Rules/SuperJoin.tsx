import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { getSimplePaymentDetails } from "@helpers/rules";
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import {
  type GroupFragment,
  GroupRuleType,
  type GroupRules,
  useTransactionStatusLazyQuery,
  useUpdateGroupRulesMutation
} from "@hey/indexer";
import { Button, Card, CardHeader, Image, Input, Tooltip } from "@hey/ui";
import { useRouter } from "next/router";
import { type FC, type RefObject, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import usePreventScrollOnNumberInput from "src/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";

interface SuperJoinProps {
  group: GroupFragment;
}

const SuperJoin: FC<SuperJoinProps> = ({ group }) => {
  const { reload } = useRouter();
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(0);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);
  const [getTransactionStatus] = useTransactionStatusLazyQuery({
    fetchPolicy: "no-cache"
  });

  const simplePaymentRule = [
    ...group.rules.required,
    ...group.rules.anyOf
  ].find((rule) => rule.type === GroupRuleType.SimplePayment);
  const { amount: simplePaymentAmount } = getSimplePaymentDetails(
    group.rules as GroupRules
  );

  useEffect(() => {
    setAmount(simplePaymentAmount || 0);
  }, [simplePaymentAmount]);

  const pollTransactionStatus = async (hash: string) => {
    const { data } = await getTransactionStatus({
      variables: { request: { txHash: hash } }
    });

    if (data?.transactionStatus?.__typename === "FinishedTransactionStatus") {
      reload();
    } else {
      setTimeout(() => pollTransactionStatus(hash), 1000);
    }
  };

  const onCompleted = (hash: string) => {
    trackEvent(Events.Group.UpdateSettings, { type: "simple_payment_rule" });
    pollTransactionStatus(hash);
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
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

  const handleUpdateRule = async (remove: boolean) => {
    if (isSuspended) return toast.error(Errors.Suspended);

    setIsSubmitting(true);

    return await updateGroupRules({
      variables: {
        request: {
          group: group.address,
          ...(remove
            ? { toRemove: [simplePaymentRule?.id] }
            : {
                ...(simplePaymentRule && {
                  toRemove: [simplePaymentRule?.id]
                }),
                toAdd: {
                  required: [
                    {
                      simplePaymentRule: {
                        cost: {
                          currency: DEFAULT_COLLECT_TOKEN,
                          value: amount
                        },
                        recipient: group.owner
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
        body="You can set a payment rule to super join groups."
        title="Super Join"
      />
      <div className="m-5 space-y-4">
        <Input
          label="Amount"
          placeholder="1"
          prefix={
            <Tooltip content="Payable in wGHO" placement="top">
              <Image
                className="size-5"
                src={`${STATIC_IMAGES_URL}/tokens/gho.svg`}
                alt="wGHO"
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
              disabled={isSubmitting}
              onClick={() => handleUpdateRule(true)}
            >
              Remove
            </Button>
          )}
          <Button
            disabled={isSubmitting}
            onClick={() => handleUpdateRule(false)}
          >
            Update
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SuperJoin;
