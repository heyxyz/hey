import MetaDetails from "@components/Shared/MetaDetails";
import {
  CalendarDaysIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import formatDate from "@hey/helpers/datetime/formatDate";
import type { InternalProfile } from "@hey/types/hey";
import { H5 } from "@hey/ui";
import type { FC } from "react";

interface ProOverviewProps {
  preferences: InternalProfile;
}

const ProOverview: FC<ProOverviewProps> = ({ preferences }) => {
  if (!preferences || !preferences.pro?.expiresAt) {
    return null;
  }

  return (
    <>
      <div className="divider my-5 border-yellow-600 border-dashed" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <CurrencyDollarIcon className="size-5" />
        <H5>Pro Preferences</H5>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={<CalendarDaysIcon className="ld-text-gray-500 size-4" />}
          title="Expires at"
        >
          {formatDate(preferences.pro?.expiresAt, "MMMM D, YYYY")}
        </MetaDetails>
      </div>
    </>
  );
};

export default ProOverview;
