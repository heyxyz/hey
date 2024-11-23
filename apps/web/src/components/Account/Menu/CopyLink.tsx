import { MenuItem } from "@headlessui/react";
import { Leafwatch } from "@helpers/leafwatch";
import { LinkIcon } from "@heroicons/react/24/outline";
import { ACCOUNT } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import toast from "react-hot-toast";

interface CopyLinkProps {
  account: Profile;
}

const CopyLink: FC<CopyLinkProps> = ({ account }) => {
  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}${getAccount(account).link}`
        );
        toast.success("Link copied to clipboard!");
        Leafwatch.track(ACCOUNT.COPY_ACCOUNT_LINK, { accountId: account.id });
      }}
    >
      <LinkIcon className="size-4" />
      <div>Copy link</div>
    </MenuItem>
  );
};

export default CopyLink;
