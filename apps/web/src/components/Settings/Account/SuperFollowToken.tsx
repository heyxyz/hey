import detectTokenType from "@helpers/detectTokenType";
import errorToast from "@helpers/errorToast";
import { getTokenDetails } from "@helpers/rules";
import { Errors } from "@hey/data/errors";
import {
  type Account,
  AccountFollowRuleType,
  TokenStandard,
  useMeLazyQuery,
  useTransactionStatusLazyQuery,
  useUpdateAccountFollowRulesMutation
} from "@hey/indexer";
import { Button, Card, CardHeader, Input } from "@hey/ui";
import { useRouter } from "next/router";
import { type FC, type RefObject, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import usePreventScrollOnNumberInput from "src/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const SuperFollowToken: FC = () => {
  const { reload } = useRouter();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingStandard, setFetchingStandard] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [standard, setStandard] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);
  const [getTransactionStatus] = useTransactionStatusLazyQuery({
    fetchPolicy: "no-cache"
  });
  const [getMeDetails] = useMeLazyQuery({ fetchPolicy: "no-cache" });

  const account = currentAccount as Account;
  const tokenGatedRule = [
    ...account.rules.required,
    ...account.rules.anyOf
  ].find((rule) => rule.type === AccountFollowRuleType.TokenGated);
  const { assetContract, amount: tokenGatedAmount } = getTokenDetails(
    account.rules
  );

  const getTokenType = async (assetContract: string) => {
    setFetchingStandard(true);
    const tokenType = await detectTokenType(assetContract as `0x${string}`);
    setStandard(tokenType);
    setFetchingStandard(false);
  };

  useEffect(() => {
    if (tokenGatedAmount && assetContract) {
      setToken(assetContract);
      setAmount(tokenGatedAmount || 0);
      getTokenType(assetContract);
    }
  }, [tokenGatedAmount, assetContract]);

  useEffect(() => {
    if (token) {
      getTokenType(token);
    }
  }, [token]);

  const onCompleted = (hash: string) => {
    getTransactionStatus({ variables: { request: { txHash: hash } } }).then(
      ({ data }) => {
        if (
          data?.transactionStatus?.__typename === "FinishedTransactionStatus"
        ) {
          getMeDetails().then(({ data: meData }) => {
            setCurrentAccount({
              currentAccount: meData?.me.loggedInAs.account as Account,
              isSignlessEnabled: meData?.me.isSignless || false
            });
            reload();
          });
        }
      }
    );
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

    setIsLoading(true);

    return updateAccountFollowRules({
      variables: {
        request: {
          ...(remove
            ? { toRemove: [tokenGatedRule?.id] }
            : {
                ...(tokenGatedRule && {
                  toRemove: [tokenGatedRule?.id]
                }),
                toAdd: {
                  required: [
                    {
                      tokenGatedRule: {
                        token: {
                          currency: token,
                          standard: standard as TokenStandard,
                          value: amount.toString()
                        }
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
        body="You can set a token gated rule to super follow users."
        title="Super follow - Token Gated"
      />
      <div className="m-5 flex flex-col space-y-4">
        <Input
          label={
            <div className="flex items-center">
              <span>Token -</span>
              <div className="ld-text-gray-500 ml-1 text-sm">
                {standard ||
                  (fetchingStandard ? "Fetching..." : "Please select a token")}
              </div>
            </div>
          }
          placeholder="0x123..."
          value={token || ""}
          onChange={(e) => setToken(e.target.value)}
        />
        <Input
          label="Amount"
          placeholder="1"
          className="no-spinner"
          ref={inputRef}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <div className="flex justify-end space-x-2">
          {tokenGatedRule && (
            <Button
              variant="danger"
              disabled={isLoading}
              onClick={() => handleUpdateRule(true)}
            >
              Remove
            </Button>
          )}
          <Button
            disabled={
              isLoading ||
              !token ||
              !amount ||
              !Object.values(TokenStandard).includes(standard as TokenStandard)
            }
            onClick={() => handleUpdateRule(false)}
          >
            Update
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SuperFollowToken;
