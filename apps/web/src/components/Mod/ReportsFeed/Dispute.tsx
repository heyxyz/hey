import SmallSingleAccount from "@components/Shared/SmallSingleAccount";
import errorToast from "@helpers/errorToast";
import formatDate from "@hey/helpers/datetime/formatDate";
import type { Account } from "@hey/indexer";
import { Button, Form, H5, TextArea, useZodForm } from "@hey/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import { object, string, type z } from "zod";

const validationSchema = object({
  reason: string().min(5, {
    message: "Reason should be at least 5 characters"
  })
});

interface DisputeProps {
  report: ModReport;
  setShowDisputeModal: Dispatch<SetStateAction<boolean>>;
}

const Dispute: FC<DisputeProps> = ({ report, setShowDisputeModal }) => {
  const [modDisputeReport, { loading }] = useModDisputeReportMutation();

  const form = useZodForm({
    schema: validationSchema
  });

  const dispute = async ({ reason }: z.infer<typeof validationSchema>) => {
    try {
      await modDisputeReport({
        variables: {
          request: {
            reason,
            reportedPublicationId: report.reportedPublication?.id,
            reporter: report.reporter.id
          }
        }
      });
      setShowDisputeModal(false);
      form.reset();
      toast.success("Disputed");
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <div className="p-5">
      <div className="max-w-md space-y-3">
        <div>
          <H5>Reason</H5>
          <div className="text-sm">{report.reason}</div>
        </div>
        <div>
          <H5>Subreason</H5>
          <div className="text-sm">{report.subreason}</div>
        </div>
        {report.additionalInfo ? (
          <div>
            <H5>Additional info</H5>
            <div className="text-sm">{report.additionalInfo}</div>
          </div>
        ) : null}
        <div>
          <H5>Reported at</H5>
          <div className="text-sm">
            {formatDate(report.createdAt, "MMM D, YYYY - hh:mm:ss A")}
          </div>
        </div>
        <div>
          <H5>Reported by</H5>
          <div className="mt-1">
            <SmallSingleAccount account={report.reporter as Account} />
          </div>
        </div>
      </div>
      <div className="divider my-5" />
      <Form className="space-y-4" form={form} onSubmit={dispute}>
        <TextArea
          label="Why are you disputing this report?"
          placeholder="This should clearly articulate the grounds for disagreement with the original report."
          {...form.register("reason")}
          rows={5}
        />
        <Button className="w-full" disabled={loading}>
          Dispute
        </Button>
      </Form>
    </div>
  );
};

export default Dispute;
