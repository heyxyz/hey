import AvatarUpload from "@components/Shared/AvatarUpload";
import CoverUpload from "@components/Shared/CoverUpload";
import errorToast from "@helpers/errorToast";
import uploadMetadata from "@helpers/uploadMetadata";
import { Errors } from "@hey/data/errors";
import { Regex } from "@hey/data/regex";
import getAccountAttribute from "@hey/helpers/getAccountAttribute";
import trimify from "@hey/helpers/trimify";
import {
  type Account,
  useMeLazyQuery,
  useSetAccountMetadataMutation
} from "@hey/indexer";
import { Button, Card, Form, Input, TextArea, useZodForm } from "@hey/ui";
import type {
  AccountOptions,
  MetadataAttribute
} from "@lens-protocol/metadata";
import {
  MetadataAttributeType,
  account as accountMetadata
} from "@lens-protocol/metadata";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import type { z } from "zod";
import { object, string, union } from "zod";

const validationSchema = object({
  bio: string().max(260, { message: "Bio should not exceed 260 characters" }),
  location: string().max(100, {
    message: "Location should not exceed 100 characters"
  }),
  name: string()
    .max(100, { message: "Name should not exceed 100 characters" })
    .regex(Regex.accountNameValidator, {
      message: "Account name must not contain restricted symbols"
    }),
  website: union([
    string().regex(Regex.url, { message: "Invalid website" }),
    string().max(0)
  ]),
  x: string().max(100, { message: "X handle must not exceed 100 characters" })
});

const AccountSettingsForm: FC = () => {
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [pfpUrl, setPfpUrl] = useState<string | undefined>(
    currentAccount?.metadata?.picture
  );
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    currentAccount?.metadata?.coverPicture
  );
  const handleTransactionLifecycle = useTransactionLifecycle();
  const [getCurrentAccountDetails] = useMeLazyQuery({
    fetchPolicy: "no-cache"
  });

  const onCompleted = () => {
    getCurrentAccountDetails().then(({ data }) => {
      setCurrentAccount({
        currentAccount: data?.me.loggedInAs.account as Account,
        isSignlessEnabled: data?.me.isSignless || false
      });
    });
    setIsLoading(false);
    toast.success("Account updated");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [setAccountMetadata] = useSetAccountMetadataMutation({
    onCompleted: async ({ setAccountMetadata }) => {
      if (setAccountMetadata.__typename === "SetAccountMetadataResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: setAccountMetadata,
        onCompleted,
        onError
      });
    },
    onError
  });

  const form = useZodForm({
    defaultValues: {
      bio: currentAccount?.metadata?.bio || "",
      location: getAccountAttribute(
        "location",
        currentAccount?.metadata?.attributes
      ),
      name: currentAccount?.metadata?.name || "",
      website: getAccountAttribute(
        "website",
        currentAccount?.metadata?.attributes
      ),
      x: getAccountAttribute(
        "x",
        currentAccount?.metadata?.attributes
      )?.replace(/(https:\/\/)?x\.com\//, "")
    },
    schema: validationSchema
  });

  const updateAccount = async (
    data: z.infer<typeof validationSchema>,
    pfpUrl: string | undefined,
    coverUrl: string | undefined
  ) => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const otherAttributes =
        currentAccount.metadata?.attributes
          ?.filter(
            (attr) =>
              !["app", "location", "timestamp", "website", "x"].includes(
                attr.key
              )
          )
          .map(({ key, type, value }) => ({
            key,
            type: MetadataAttributeType[type] as any,
            value
          })) || [];

      const preparedAccountMetadata: AccountOptions = {
        ...(data.name && { name: data.name }),
        ...(data.bio && { bio: data.bio }),
        attributes: [
          ...(otherAttributes as MetadataAttribute[]),
          {
            key: "location",
            type: MetadataAttributeType.STRING,
            value: data.location
          },
          {
            key: "website",
            type: MetadataAttributeType.STRING,
            value: data.website
          },
          { key: "x", type: MetadataAttributeType.STRING, value: data.x },
          {
            key: "timestamp",
            type: MetadataAttributeType.STRING,
            value: new Date().toISOString()
          }
        ],
        coverPicture: coverUrl || undefined,
        picture: pfpUrl || undefined
      };
      preparedAccountMetadata.attributes =
        preparedAccountMetadata.attributes?.filter((m) => {
          return m.key !== "" && Boolean(trimify(m.value));
        });
      const metadata = accountMetadata(preparedAccountMetadata);
      const metadataUri = await uploadMetadata(metadata);

      return await setAccountMetadata({
        variables: { request: { metadataUri } }
      });
    } catch (error) {
      onError(error);
    }
  };

  const onSetAvatar = async (src: string | undefined) => {
    setPfpUrl(src);
    return await updateAccount({ ...form.getValues() }, src, coverUrl);
  };

  const onSetCover = async (src: string | undefined) => {
    setCoverUrl(src);
    return await updateAccount({ ...form.getValues() }, pfpUrl, src);
  };

  return (
    <Card className="p-5">
      <Form
        className="space-y-4"
        form={form}
        onSubmit={(data) => updateAccount(data, pfpUrl, coverUrl)}
      >
        <Input
          disabled
          label="Account Address"
          type="text"
          value={currentAccount?.address}
        />
        <Input
          label="Name"
          placeholder="Gavin"
          type="text"
          {...form.register("name")}
        />
        <Input
          label="Location"
          placeholder="Miami"
          type="text"
          {...form.register("location")}
        />
        <Input
          label="Website"
          placeholder="https://hooli.com"
          type="text"
          {...form.register("website")}
        />
        <Input
          label="X"
          placeholder="gavin"
          prefix="https://x.com"
          type="text"
          {...form.register("x")}
        />
        <TextArea
          label="Bio"
          placeholder="Tell us something about you!"
          {...form.register("bio")}
        />
        <AvatarUpload src={pfpUrl || ""} setSrc={onSetAvatar} />
        <CoverUpload src={coverUrl || ""} setSrc={onSetCover} />
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

export default AccountSettingsForm;
