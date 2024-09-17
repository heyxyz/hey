import type { FC } from "react";

import { CardHeader } from "@hey/ui";

import type { StatsType } from "./LeafwatchStats";

interface ReferrersProps {
  referrers: StatsType["referrers"];
}

const Referrers: FC<ReferrersProps> = ({ referrers }) => {
  return (
    <>
      <div className="divider" />
      <CardHeader title="Referrers" />
      <div className="m-5">
        <table className="w-full border-x border-t">
          <thead>
            <tr className="border-b">
              <th className="border-r px-2 text-left">Referrer</th>
              <th className="px-2 text-right">Count</th>
            </tr>
          </thead>
          <tbody>
            {referrers.map((referrer, index) => (
              <tr className="border-b" key={index}>
                <td className="border-r px-2">{referrer.referrer}</td>
                <td className="px-2 text-right">{referrer.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Referrers;
