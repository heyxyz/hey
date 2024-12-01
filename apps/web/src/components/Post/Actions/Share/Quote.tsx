import { MenuItem } from "@headlessui/react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import { type Post, TriStateValue } from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import toast from "react-hot-toast";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface QuoteProps {
  post: Post;
}

const Quote: FC<QuoteProps> = ({ post }) => {
  const { currentAccount } = useAccountStore();
  const { setShowAuthModal, setShowNewPostModal } = useGlobalModalStateStore();
  const { setQuotedPost } = usePostStore();
  const { isSuspended } = useAccountStatus();

  if (post.operations?.canQuote === TriStateValue.No) {
    return null;
  }

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm"
        )
      }
      onClick={() => {
        if (!currentAccount) {
          setShowAuthModal(true);
          return;
        }

        if (isSuspended) {
          return toast.error(Errors.Suspended);
        }

        setQuotedPost(post);
        setShowNewPostModal(true);
      }}
    >
      <div className="flex items-center space-x-2">
        <ChatBubbleBottomCenterTextIcon className="size-4" />
        <div>{post.commentOn ? "Quote comment" : "Quote post"}</div>
      </div>
    </MenuItem>
  );
};

export default Quote;
