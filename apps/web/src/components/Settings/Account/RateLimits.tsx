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
          <div className="space-y-2">
            <span className="space-x-2 text-gray-500 text-sm">
              <span>Hourly Allowance</span>
              <b>
                {data.me.limit.allowanceUsed} / {data.me.limit.allowanceLeft}
              </b>
            </span>
            <ProgressBar
              max={data.userRateLimit.momoka.hourAllowance}
              value={data.userRateLimit.momoka.hourAllowanceUsed}
            />
          </div>
          <div className="space-y-2">
            <span className="space-x-2 text-gray-500 text-sm">
              <span>Daily Allowance</span>
              <b>
                {data.userRateLimit.momoka.dayAllowanceUsed} /{" "}
                {data.userRateLimit.momoka.dayAllowance}
              </b>
            </span>
            <ProgressBar
              max={data.userRateLimit.momoka.dayAllowance}
              value={data.userRateLimit.momoka.dayAllowanceUsed}
            />
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default RateLimits;
