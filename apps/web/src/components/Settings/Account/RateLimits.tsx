import Loader from "@components/Shared/Loader";
import { useMeQuery } from "@hey/indexer";
import { Card, CardHeader, ErrorMessage, ProgressBar } from "@hey/ui";
import type { FC } from "react";

const RateLimits: FC = () => {
  const { data, error, loading } = useMeQuery({ fetchPolicy: "no-cache" });

  return (
    <Card>
      <CardHeader
        body="Rate limits are used to prevent abuse and ensure fair usage of the platform."
        title="Rate Limits"
      />
      {loading ? (
        <Loader className="my-10" message="Loading Rate Limits..." />
      ) : error ? (
        <ErrorMessage className="m-5" error={error} />
      ) : data ? (
        <div className="m-5 space-y-5">
          <span className="space-x-2 text-gray-500 text-sm">
            <span>Hourly Allowance</span>
            <b>
              {data.me.limit.allowanceUsed} / {data.me.limit.allowanceLeft}
            </b>
          </span>
          <ProgressBar
            max={data.me.limit.allowance}
            value={data.me.limit.allowanceUsed}
          />
        </div>
      ) : null}
    </Card>
  );
};

export default RateLimits;
