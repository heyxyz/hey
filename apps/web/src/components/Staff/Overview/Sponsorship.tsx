import Loader from "@components/Shared/Loader";
import { HEY_SPONSOR } from "@hey/data/constants";
import { useSponsorshipQuery } from "@hey/indexer";
import { Card, CardHeader, ErrorMessage, NumberedStat } from "@hey/ui";
import type { FC } from "react";

const Sponsorship: FC = () => {
  const { data, loading, error } = useSponsorshipQuery({
    variables: { request: { address: HEY_SPONSOR } },
    pollInterval: 5000
  });

  return (
    <Card>
      <CardHeader title="Sponsorship" />
      <div className="m-5">
        {loading ? (
          <Loader className="my-10" message="Loading sponsorship..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load sponsorship" />
        ) : (
          <div className="space-y-5">
            <NumberedStat
              count={data?.sponsorship?.balance}
              name="Balance"
              suffix="GHO"
            />
            {data?.sponsorship?.limits?.user && (
              <NumberedStat
                name="User limit"
                suffix={`${data?.sponsorship?.limits?.user.limit} / ${data?.sponsorship?.limits?.user.window}`}
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Sponsorship;
