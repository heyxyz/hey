import getAvatar from "@hey/helpers/getAvatar";
import { Card, Image } from "@hey/ui";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import NewPublication from "./NewPublication";

interface NewPostProps {
  feed?: string;
}

const NewPost: FC<NewPostProps> = ({ feed }) => {
  const { isReady, query } = useRouter();
  const { currentAccount } = useAccountStore();
  const { setPostContent } = usePostStore();
  const [showComposer, setShowComposer] = useState(false);

  const handleOpenModal = () => {
    setShowComposer(true);
  };

  useEffect(() => {
    if (isReady && query.text) {
      const { hashtags, text, url, via } = query;
      let processedHashtags: string | undefined;

      if (hashtags) {
        processedHashtags = (hashtags as string)
          .split(",")
          .map((tag) => `#${tag} `)
          .join("");
      }

      const content = `${text}${
        processedHashtags ? ` ${processedHashtags} ` : ""
      }${url ? `\n\n${url}` : ""}${via ? `\n\nvia @${via}` : ""}`;

      handleOpenModal();
      setPostContent(content);
    }
  }, [query]);

  if (showComposer) {
    return <NewPublication feed={feed} />;
  }

  return (
    <Card
      className="cursor-pointer space-y-3 px-5 py-4"
      onClick={handleOpenModal}
    >
      <div className="flex items-center space-x-3">
        <Image
          alt={currentAccount?.address}
          className="size-11 cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
          height={44}
          src={getAvatar(currentAccount)}
          width={44}
        />
        <span className="ld-text-gray-500">What's new?!</span>
      </div>
    </Card>
  );
};

export default NewPost;
