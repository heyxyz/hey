import type { MirrorablePublication } from "@hey/lens";
import type { FC } from "react";

import { MenuItem } from "@headlessui/react";
import { Leafwatch } from "@helpers/leafwatch";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { PUBLICATION } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import cn from "@hey/ui/cn";
import toast from "react-hot-toast";

interface ShareProps {
  publication: MirrorablePublication;
}

const Share: FC<ShareProps> = ({ publication }) => {
  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}/posts/${publication?.id}`
        );
        toast.success("Copied to clipboard!");
        Leafwatch.track(PUBLICATION.SHARE, { publication_id: publication.id });
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="size-4" />
        <div>Share</div>
      </div>
    </MenuItem>
  );
};

export default Share;
