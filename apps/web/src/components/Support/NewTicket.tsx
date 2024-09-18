import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { APP_NAME, HEY_API_URL } from "@hey/data/constants";
import {
  Button,
  Card,
  Form,
  H4,
  H5,
  Input,
  TextArea,
  useZodForm
} from "@hey/ui";
import axios from "axios";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePreferencesStore } from "src/store/non-persisted/usePreferencesStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import { object, string } from "zod";

const newTicketSchema = object({
  title: string()
    .min(5, { message: "Title should be at least 5 characters long" })
    .max(1000, { message: "Title should be at most 500 characters long" }),
  description: string()
    .min(20, { message: "Description should be at least 20 characters long" })
    .max(20000, {
      message: "Description should be at most 20000 characters long"
    }),
  email: string().email()
});

const NewTicket: FC = () => {
  const { email } = usePreferencesStore();
  const { currentProfile } = useProfileStore();
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<null | string>(null);

  const form = useZodForm({ schema: newTicketSchema });

  useEffect(() => {
    if (email) {
      form.setValue("email", email);
      setEmailDisabled(true);
    }
  }, [email]);

  const handleSubmit = async (data: {
    description: string;
    email: string;
    title: string;
  }) => {
    setSubmitting(true);

    const { description, email, title } = data;

    toast.promise(
      axios.post(
        `${HEY_API_URL}/misc/ticket`,
        { description, email, title },
        { headers: getAuthApiHeaders() }
      ),
      {
        error: () => {
          setSubmitting(false);
          return "Error submitting ticket";
        },
        loading: "Submitting ticket...",
        success: ({ data }) => {
          setTicketNumber(data.id);
          setSubmitting(false);
          return "Ticket submitted successfully";
        }
      }
    );
  };

  if (currentProfile && !email) {
    return (
      <Card className="p-10 text-center">
        <EnvelopeIcon className="mx-auto size-16" />
        <H5 className="mt-3 mb-5 font-normal">
          You don't have an email set! Update in settings and get back here.
        </H5>
        <Link href="/settings/account">
          <Button>Set email</Button>
        </Link>
      </Card>
    );
  }

  if (ticketNumber) {
    return (
      <Card className="p-10 text-center">
        <CheckCircleIcon className="mx-auto size-16 text-green-500" />
        <H4 className="mt-3 mb-5">Thank you for contacting us!</H4>
        <H5 className="mt-3 font-normal">
          We will get back to you as soon as possible. Your ticket number is{" "}
          <b>#{ticketNumber}</b>
        </H5>
      </Card>
    );
  }

  return (
    <Card className="p-10 text-center">
      <H4 className="pb-8 font-normal">
        Here you can ask any question about <b>{APP_NAME}</b>.
      </H4>
      <Form
        className="mx-auto w-full space-y-5 sm:w-4/5"
        form={form}
        onSubmit={async (data) => await handleSubmit(data)}
      >
        <Input
          placeholder="Email"
          {...form.register("email")}
          disabled={emailDisabled}
        />
        <Input
          placeholder="Briefly describe your question"
          {...form.register("title")}
        />
        <TextArea
          placeholder="Tell us bit more about your question"
          {...form.register("description")}
          rows={6}
        />
        <Button
          className="w-full justify-center"
          disabled={submitting}
          type="submit"
        >
          Submit
        </Button>
      </Form>
    </Card>
  );
};

export default NewTicket;
