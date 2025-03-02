import SingleAccount from "@components/Shared/SingleAccount";
import errorToast from "@helpers/errorToast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Errors } from "@hey/data/errors";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AccountFragment, AccountReportReason } from "@hey/indexer";
import { useReportAccountMutation } from "@hey/indexer";
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  Form,
  TextArea,
  useZodForm
} from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { object, string, type z } from "zod";
import Reason from "./Reason";

const validationSchema = object({
  additionalComment: string().max(260, {
    message: "Additional comments should not exceed 260 characters"
  })
});

interface ReportAccountProps {
  account?: AccountFragment;
}

const ReportAccount: FC<ReportAccountProps> = ({ account }) => {
  const { isSuspended } = useAccountStatus();
  const [reason, setReason] = useState("");

  const form = useZodForm({
    schema: validationSchema
  });

  const [createReport, { data, error, loading }] = useReportAccountMutation({
    onError: (error) => errorToast(error)
  });

  const reportProfile = async ({
    additionalComment
  }: z.infer<typeof validationSchema>) => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    return await createReport({
      variables: {
        request: {
          additionalComment,
          account: account?.address,
          reason: reason as AccountReportReason
        }
      }
    });
  };

  return (
    <div onClick={stopEventPropagation}>
      {data?.reportAccount === null ? (
        <EmptyState
          hideCard
          icon={<CheckCircleIcon className="size-14" />}
          message="Account reported"
        />
      ) : account ? (
        <div className="p-5">
          <Card className="p-3">
            <SingleAccount
              hideFollowButton
              hideUnfollowButton
              account={account}
              showUserPreview={false}
            />
          </Card>
          <div className="divider my-5" />
          <Form className="space-y-4" form={form} onSubmit={reportProfile}>
            {error ? (
              <ErrorMessage error={error} title="Failed to report" />
            ) : null}
            <Reason setReason={setReason} reason={reason} />
            {reason ? (
              <>
                <TextArea
                  label="Description"
                  placeholder="Please provide additional details"
                  {...form.register("additionalComment")}
                />
                <Button
                  className="flex w-full justify-center"
                  disabled={loading}
                  type="submit"
                >
                  Report
                </Button>
              </>
            ) : null}
          </Form>
        </div>
      ) : null}
    </div>
  );
};

export default ReportAccount;
