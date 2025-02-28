import AvatarUpload from "@components/Shared/AvatarUpload";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import uploadMetadata from "@helpers/uploadMetadata";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import { Regex } from "@hey/data/regex";
import { useCreateGroupMutation } from "@hey/indexer";
import { Button, Form, Input, TextArea, useZodForm } from "@hey/ui";
import { group } from "@lens-protocol/metadata";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const form = useZodForm({
    schema: validationSchema
  });

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    setTransactionHash(hash);
    setScreen("minting");
    trackEvent(Events.Group.Create);
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
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

    setIsSubmitting(true);

    const metadataUri = await uploadMetadata(
      group({
        name: data.name,
        description: data.description || undefined,
        icon: pfpUrl
      })
    );

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
      <AvatarUpload
        src={pfpUrl || ""}
        setSrc={(src) => setPfpUrl(src)}
        isSmall
      />
      <Button
        className="flex w-full justify-center"
        disabled={isSubmitting}
        type="submit"
      >
        Create group
      </Button>
    </Form>
  );
};

export default CreateGroupModal;
