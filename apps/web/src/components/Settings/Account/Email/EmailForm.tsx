import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { SETTINGS } from "@hey/data/tracking";
import isEmailAllowed from "@hey/helpers/isEmailAllowed";
import { Button, Form, Input, useZodForm } from "@hey/ui";
import axios from "axios";
import type { FC } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import { object, string, type z } from "zod";

const updateEmailSchema = object({
  email: string().email()
});

const EmailForm: FC = () => {
  const { currentAccount } = useAccountStore();
  const { email, setEmail: setEmailState } = usePreferencesStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);

  const form = useZodForm({ schema: updateEmailSchema });

  useEffect(() => {
    if (email) {
      form.setValue("email", email);
    }
  }, [email]);

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const setEmail = async ({ email }: z.infer<typeof updateEmailSchema>) => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${HEY_API_URL}/email/update`,
        { email },
        { headers: getAuthApiHeaders() }
      );
      setEmailState(email as string);
      Leafwatch.track(SETTINGS.ACCOUNT.SET_EMAIL);

      return toast.success("Email verification sent to your email!");
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const emailNotAllowed = !isEmailAllowed(form.watch("email"));

  return (
    <Form className="space-y-4" form={form} onSubmit={setEmail}>
      <div>
        <Input
          label="Email address"
          placeholder="gavin@hooli.com"
          error={emailNotAllowed}
          {...form.register("email")}
          type="email"
        />
        {emailNotAllowed && (
          <div className="mt-2 flex items-center space-x-1 text-red-500 text-sm">
            <NoSymbolIcon className="size-4" />
            <b>Email domain not allowed!</b>
          </div>
        )}
      </div>
      <div className="ml-auto">
        <Button
          disabled={isLoading || !form.formState.isDirty || emailNotAllowed}
          type="submit"
        >
          Set Email
        </Button>
      </div>
    </Form>
  );
};

export default EmailForm;
