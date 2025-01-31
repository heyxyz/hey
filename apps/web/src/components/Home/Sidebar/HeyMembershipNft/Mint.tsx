import CollectAction from "@components/Post/OpenAction/CollectModule/CollectAction";
import Loader from "@components/Shared/Loader";
import { signatureFont } from "@helpers/fonts";
import { APP_NAME, HEY_MEMBERSHIP_NFT_POST_ID } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { type Post, usePostQuery } from "@hey/indexer";
import { ErrorMessage, H3 } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";

interface MintProps {
  onCollectSuccess: () => void;
}

const Mint: FC<MintProps> = ({ onCollectSuccess }) => {
  const { data, error, loading } = usePostQuery({
    variables: {
      request: { post: HEY_MEMBERSHIP_NFT_POST_ID }
    }
  });

  if (loading) {
    return <Loader className="p-10" message="Loading NFT" />;
  }

  if (!data?.post || error) {
    return (
      <ErrorMessage
        className="m-5"
        error={
          error || {
            message: Errors.SomethingWentWrong,
            name: "Failed to load NFT"
          }
        }
        title="Failed to load NFT"
      />
    );
  }

  const post = data?.post as Post;
  const postAction = post.actions[0];

  return (
    <div className="p-5">
      <img
        className="mb-4 h-[250px] w-full rounded-xl border object-cover dark:border-gray-700"
        src="https://ipfs.decentralized-content.com/ipfs/bafybeib6infyovvtawokys4ejjr4r3qk4soy7jqriejp2wbmttedupsy64"
        alt="NFT"
      />
      <div className="linkify mt-5 space-y-3 font-serif">
        <b>Thanks for Being a {APP_NAME} Member!</b>
        <div>
          Your journey with us has been invaluable. By supporting "{APP_NAME}",
          you're not just a part of our story, but you're also fueling the
          vibrant future of{" "}
          <Link
            className="font-bold"
            href="https://github.com/heyxyz/hey"
            target="_blank"
          >
            open-source
          </Link>{" "}
          development. Here's to more innovation and collaboration ahead!
        </div>
        <H3
          className={cn(
            "flex items-center space-x-2 pt-3",
            signatureFont.className
          )}
        >
          <div>-</div>
          <img className="size-6" src="/logo.png" alt="Logo" />
          <div>Team Hey</div>
        </H3>
      </div>
      <div className="mt-6">
        <CollectAction
          buttonTitle="Collect for 5 MATIC"
          className="!mt-0 w-full justify-center"
          countOpenActions={0}
          forceShowCollect
          noBalanceErrorMessages={
            <span>
              You need <b>5 MATIC</b> to collect this {APP_NAME} NFT
            </span>
          }
          onCollectSuccess={onCollectSuccess}
          postAction={postAction}
          post={post}
        />
      </div>
    </div>
  );
};

export default Mint;
