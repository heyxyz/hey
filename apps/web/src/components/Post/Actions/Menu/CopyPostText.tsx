import { MenuItem } from "@headlessui/react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { PostFragment } from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import toast from "react-hot-toast";

interface CopyPostTextProps {
  post: PostFragment;
}

const CopyPostText: FC<CopyPostTextProps> = ({ post }) => {
  const filteredContent = getPostData(post.metadata)?.content || "";

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
        await navigator.clipboard.writeText(filteredContent || "");
        toast.success("Content copied to clipboard!");
      }}
    >
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="size-4" />
        <div>{post.commentOn ? "Copy comment text" : "Copy post text"}</div>
      </div>
    </MenuItem>
  );
};

export default CopyPostText;
