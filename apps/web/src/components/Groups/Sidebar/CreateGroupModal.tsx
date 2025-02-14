import errorToast from "@helpers/errorToast";
import uploadMetadata from "@helpers/uploadMetadata";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import { useCreateGroupMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button, Form, Input, TextArea, useZodForm } from "@hey/ui";
import { group } from "@lens-protocol/metadata";
import { useState, type FC } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";
import { object, string, z } from "zod";


const validationSchema = object({
  name: string()
    .max(100, { message: "Name should not exceed 100 characters" })
    .regex(Regex.accountNameValidator, {
      message: "Account name must not contain restricted symbols"
    }),
  description: string().max(260, { message: "Description should not exceed 260 characters" }),
});


const CreateGroupModal: FC = () => {
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const { data: walletClient } = useWalletClient();

  const form = useZodForm({
    schema: validationSchema
  });

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      txHash,
      type: OptimisticTxType.CREATE_GROUP
    });
  };

  const onCompleted = (hash: string) => {
    updateTransactions({ txHash: hash });
    setIsLoading(false);
    toast.success("Followed");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [createGroup] = useCreateGroupMutation({
    onCompleted: async ({ createGroup }) => {
      if (createGroup.__typename === "CreateGroupResponse") {
        return onCompleted(createGroup.hash);
      }

      if (walletClient) {
        try {
          if (createGroup.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(createGroup.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (createGroup.__typename === "TransactionWillFail") {
        return toast.error(createGroup.reason);
      }
    },
    onError
  });

  const handleCreateGroup = async (data: z.infer<typeof validationSchema>) => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    const metadata = group({
      name: data.name,
      description: data.description
    });
    const metadataUri = await uploadMetadata(metadata);
    return await createGroup({ variables: { request: { metadataUri } } });
  }

  return (
    <Form className="space-y-4 p-5" form={form} onSubmit={handleCreateGroup}>
      <Input
        label="Name"
        placeholder="Name"
        {...form.register("name")}
      />
      <TextArea
        label="Description"
        placeholder="Please provide additional details"
        {...form.register("description")}
      />
      <Button
        className="flex w-full justify-center"
        disabled={isLoading}
        type="submit"
      >
        Create group
      </Button>
    </Form>
  );
};

export default CreateGroupModal;
