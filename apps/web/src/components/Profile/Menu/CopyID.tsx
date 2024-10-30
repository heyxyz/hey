import { MenuItem } from "@headlessui/react";
import { Leafwatch } from "@helpers/leafwatch";
import { HashtagIcon } from "@heroicons/react/24/outline";
import { PROFILE } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import toast from "react-hot-toast";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

interface CopyIDProps {
  profile: Profile;
}

const CopyID: FC<CopyIDProps> = ({ profile }) => {
  const { developerMode } = usePreferencesStore();

  if (!developerMode) {
    return null;
  }

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
        await navigator.clipboard.writeText(profile.id);
        toast.success("ID copied to clipboard!");
        Leafwatch.track(PROFILE.COPY_PROFILE_ID, {
          profile_id: profile.id
        });
      }}
    >
      <HashtagIcon className="size-4" />
      <div>Copy ID</div>
    </MenuItem>
  );
};

export default CopyID;
