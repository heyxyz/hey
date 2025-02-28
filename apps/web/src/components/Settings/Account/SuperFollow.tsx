import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { getSimplePaymentDetails } from "@helpers/rules";
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import {
  type Account,
  AccountFollowRuleType,
  useMeLazyQuery,
  useTransactionStatusLazyQuery,
  useUpdateAccountFollowRulesMutation
} from "@hey/indexer";
import { Button, Card, CardHeader, Image, Input, Tooltip } from "@hey/ui";
import { useRouter } from "next/router";
import { type FC, type RefObject, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import usePreventScrollOnNumberInput from "src/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const SuperFollow: FC = () => {
  const { reload } = useRouter();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(0);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);
  const [getTransactionStatus] = useTransactionStatusLazyQuery({
    fetchPolicy: "no-cache"
  });
  const [getCurrentAccountDetails] = useMeLazyQuery({
    fetchPolicy: "no-cache"
  });

  const account = currentAccount as Account;
  const simplePaymentRule = [
    ...account.rules.required,
    ...account.rules.anyOf
  ].find((rule) => rule.type === AccountFollowRuleType.SimplePayment);
  const { amount: simplePaymentAmount } = getSimplePaymentDetails(
    account.rules
  );

  useEffect(() => {
    setAmount(simplePaymentAmount || 0);
  }, [simplePaymentAmount]);

  const pollTransactionStatus = async (hash: string) => {
    const { data } = await getTransactionStatus({
      variables: { request: { txHash: hash } }
    });

    if (data?.transactionStatus?.__typename === "FinishedTransactionStatus") {
      const accountData = await getCurrentAccountDetails();
      setCurrentAccount({
        currentAccount: accountData?.data?.me.loggedInAs.account as Account,
        isSignlessEnabled: accountData?.data?.me.isSignless || false
      });
      reload();
    } else {
      setTimeout(() => pollTransactionStatus(hash), 1000);
    }
  };

  const onCompleted = (hash: string) => {
    trackEvent(Events.Account.UpdateSettings, { type: "simple_payment_rule" });
    pollTransactionStatus(hash);
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [updateAccountFollowRules] = useUpdateAccountFollowRulesMutation({
    onCompleted: async ({ updateAccountFollowRules }) => {
      if (
        updateAccountFollowRules.__typename ===
        "UpdateAccountFollowRulesResponse"
      ) {
        return onCompleted(updateAccountFollowRules.hash);
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

    setIsSubmitting(true);

    return updateAccountFollowRules({
      variables: {
        request: {
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

export default SuperFollow;
