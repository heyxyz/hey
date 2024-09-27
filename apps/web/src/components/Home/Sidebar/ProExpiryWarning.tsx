import ExtendButton from "@components/Pro/ExtendButton";
import getNumberOfDaysFromDate from "@hey/helpers/datetime/getNumberOfDaysFromDate";
import { Card, H5 } from "@hey/ui";
import plur from "plur";
import type { FC } from "react";
import { useProStore } from "src/store/non-persisted/useProStore";

const ProExpiryWarning: FC = () => {
  const { isPro, proExpiresAt } = useProStore();
  const daysLeft = getNumberOfDaysFromDate(proExpiresAt as Date);

  if (!isPro || daysLeft > 5) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="!bg-yellow-300/20 mb-4 space-y-2.5 border-yellow-400 p-5 text-yellow-600"
    >
      <H5>Pro expiring soon!</H5>
      <p className="pb-3 text-sm leading-[22px]">
        You have{" "}
        <b className="text-red-500">
          {daysLeft} {plur("day", daysLeft)}
        </b>{" "}
        left on your current Pro subscription. To keep enjoying premium features
        be sure to renew your subscription before it runs out!
      </p>
      <ExtendButton size="md" />
    </Card>
  );
};

export default ProExpiryWarning;
