import CoverUpload from "@components/Shared/CoverUpload";
import PFPUpload from "@components/Shared/PFPUpload";
import errorToast from "@helpers/errorToast";
import uploadMetadata from "@helpers/uploadMetadata";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import { type Group, useSetGroupMetadataMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button, Card, Form, Input, TextArea, useZodForm } from "@hey/ui";
import { group as groupMetadata } from "@lens-protocol/metadata";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionHandler";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import type { z } from "zod";
import { object, string } from "zod";

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

interface GroupSettingsFormProps {
  group: Group;
}

const GroupSettingsForm: FC<GroupSettingsFormProps> = ({ group }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [pfpUrl, setPfpUrl] = useState<string | undefined>(
    group.metadata?.icon
  );
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    group.metadata?.coverPicture
  );

  const { handleTransactionLifecycle } = useTransactionLifecycle();

  const onCompleted = (hash: string) => {
    setIsLoading(false);
    addSimpleOptimisticTransaction(hash, OptimisticTxType.SET_ACCOUNT_METADATA);
    toast.success("Group updated");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [setGroupMetadata] = useSetGroupMetadataMutation({
    onCompleted: async ({ setGroupMetadata }) => {
      // if (setGroupMetadata.__typename === "SetGroupMetadataResponse") {
      //   return onCompleted(setGroupMetadata.hash);
      // }

      return await handleTransactionLifecycle({
        transactionData: setGroupMetadata,
        onCompleted,
        onError
      });
    },
    onError
  });

  const form = useZodForm({
    defaultValues: {
      name: group?.metadata?.name || "",
      description: group?.metadata?.description || ""
    },
    schema: validationSchema
  });

  const updateGroup = async (data: z.infer<typeof validationSchema>) => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);

      const metadata = groupMetadata({
        name: data.name,
        description: data.description,
        icon: pfpUrl || undefined,
        coverPicture: coverUrl || undefined
      });
      const metadataUri = await uploadMetadata(metadata);

      return await setGroupMetadata({
        variables: { request: { group: group.address, metadataUri } }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Card className="p-5">
      <Form className="space-y-4" form={form} onSubmit={updateGroup}>
        <Input disabled label="Group Id" type="text" value={group.address} />
        <Input
          label="Name"
          placeholder="Milady"
          type="text"
          {...form.register("name")}
        />
        <TextArea
          label="Description"
          placeholder="Tell us something about your group!"
          {...form.register("description")}
        />
        <PFPUpload src={pfpUrl || ""} setSrc={(src) => setPfpUrl(src)} />
        <CoverUpload src={coverUrl || ""} setSrc={(src) => setCoverUrl(src)} />
        <Button
          className="ml-auto"
          disabled={
            isLoading || (!form.formState.isDirty && !coverUrl && !pfpUrl)
          }
          type="submit"
        >
          Save
        </Button>
      </Form>
    </Card>
  );
};

export default GroupSettingsForm;
