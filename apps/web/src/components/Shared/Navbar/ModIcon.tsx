import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { FeatureFlag } from "@hey/data/feature-flags";
import { Tooltip } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import Link from "next/link";
import type { FC } from "react";

const ModIcon: FC = () => {
  const isGardener = useFlag(FeatureFlag.Gardener);

  if (!isGardener) {
    return null;
  }

  return (
    <Tooltip content="Moderation" placement="bottom">
      <Link
        className="hidden rounded-md px-2 py-1 hover:bg-gray-300/20 md:flex"
        href="/mod"
      >
        <ShieldCheckIcon className="size-5 sm:size-6" />
      </Link>
    </Tooltip>
  );
};

export default ModIcon;
