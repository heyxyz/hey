import PFPUpload from "@components/Shared/PFPUpload";
import errorToast from "@helpers/errorToast";
import uploadMetadata from "@helpers/uploadMetadata";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import { useCreateGroupMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button, Form, Input, TextArea, useZodForm } from "@hey/ui";
import { group } from "@lens-protocol/metadata";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { object, string, type z } from "zod";
import { useCreateGroupStore } from "./CreateGroup";

const validationSchema = object({
  name: string()
    .max(100, { message: "Name should not exceed 100 characters" })
    .regex(Regex.accountNameValidator, {
      message: "Account name must not contain restricted symbols"
    }),
  description: string().max(260, {
    message: "Description should not exceed 260 characters"
  })
});

const CreateGroupModal: FC = () => {
  const { isSuspended } = useAccountStatus();
  const { setScreen, setTransactionHash } = useCreateGroupStore();
  const [pfpUrl, setPfpUrl] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { handleTransactionLifecycle } = useTransactionLifecycle();

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
    setTransactionHash(hash);
    setScreen("minting");
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

      return await handleTransactionLifecycle({
        transactionData: createGroup,
        onCompleted,
        onError
      });
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
      description: data.description,
      icon: pfpUrl
    });
    const metadataUri = await uploadMetadata(metadata);
    return await createGroup({
      variables: {
        request: {
          metadataUri,
          rules: { required: [{ banAccountRule: { enable: true } }] }
        }
      }
    });
  };

  return (
    <Form className="space-y-4 p-5" form={form} onSubmit={handleCreateGroup}>
      <Input label="Name" placeholder="Name" {...form.register("name")} />
      <TextArea
        label="Description"
        placeholder="Please provide additional details"
        {...form.register("description")}
      />
      <PFPUpload src={pfpUrl || ""} setSrc={(src) => setPfpUrl(src)} isSmall />
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
