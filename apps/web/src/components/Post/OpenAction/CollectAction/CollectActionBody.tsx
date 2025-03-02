import CountdownTimer from "@components/Shared/CountdownTimer";
import Loader from "@components/Shared/Loader";
import Collectors from "@components/Shared/Modal/Collectors";
import Slug from "@components/Shared/Slug";
import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import { APP_NAME, BLOCK_EXPLORER_URL } from "@hey/data/constants";
import { tokens } from "@hey/data/tokens";
import formatDate from "@hey/helpers/datetime/formatDate";
import formatAddress from "@hey/helpers/formatAddress";
import getAccount from "@hey/helpers/getAccount";
import getTokenImage from "@hey/helpers/getTokenImage";
import humanize from "@hey/helpers/humanize";
import nFormatter from "@hey/helpers/nFormatter";
import { isRepost } from "@hey/helpers/postHelpers";
import {
  type AnyPostFragment,
  type SimpleCollectActionFragment,
  useCollectActionQuery
} from "@hey/indexer";
import { H3, H4, HelpTooltip, Modal, Tooltip, WarningMessage } from "@hey/ui";
import { useCounter } from "@uidotdev/usehooks";
import Link from "next/link";
import plur from "plur";
import { type FC, useState } from "react";
import CollectActionButton from "./CollectActionButton";
import Splits from "./Splits";

interface CollectActionBodyProps {
  post: AnyPostFragment;
}

const CollectActionBody: FC<CollectActionBodyProps> = ({ post }) => {
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const targetPost = isRepost(post) ? post?.repostOf : post;
  const [collects, { increment }] = useCounter(targetPost.stats.collects);

  const { data, loading } = useCollectActionQuery({
    variables: { request: { post: post.id } }
  });

  if (loading) {
    return <Loader className="py-10" />;
  }

  const targetAction =
    data?.post?.__typename === "Post"
      ? data?.post.actions.find(
          (action) => action.__typename === "SimpleCollectAction"
        )
      : data?.post?.__typename === "Repost"
        ? data?.post?.repostOf?.actions.find(
            (action) => action.__typename === "SimpleCollectAction"
          )
        : null;

  const collectAction = targetAction as SimpleCollectActionFragment;
  const endTimestamp = collectAction?.endsAt;
  const collectLimit = Number(collectAction?.collectLimit);
  const amount = Number.parseFloat(collectAction?.amount?.value || "0");
  const currency = collectAction?.amount?.asset?.symbol;
  const recipients = collectAction?.recipients || [];
  const percentageCollected = (collects / collectLimit) * 100;
  const enabledTokens = tokens.map((t) => t.symbol);
  const isTokenEnabled = enabledTokens?.includes(currency || "");
  const isSaleEnded = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false;
  const isAllCollected = collectLimit ? collects >= collectLimit : false;

  return (
    <>
      {collectLimit ? (
        <Tooltip
          content={`${percentageCollected.toFixed(0)}% Collected`}
          placement="top"
        >
          <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2.5 bg-black dark:bg-white"
              style={{ width: `${percentageCollected}%` }}
            />
          </div>
        </Tooltip>
      ) : null}
      <div className="p-5">
        {isAllCollected ? (
          <WarningMessage
            className="mb-5"
            message={
              <div className="flex items-center space-x-1.5">
                <CheckCircleIcon className="size-4" />
                <span>This collection has been sold out</span>
              </div>
            }
          />
        ) : isSaleEnded ? (
          <WarningMessage
            className="mb-5"
            message={
              <div className="flex items-center space-x-1.5">
                <ClockIcon className="size-4" />
                <span>This collection has ended</span>
              </div>
            }
          />
        ) : null}
        <div className="mb-4">
          <H4>
            {targetPost.__typename} by{" "}
            <Slug slug={getAccount(targetPost.author).usernameWithPrefix} />
          </H4>
        </div>
        {amount ? (
          <div className="flex items-center space-x-1.5 py-2">
            {isTokenEnabled ? (
              <img
                alt={currency}
                className="size-7"
                height={28}
                src={getTokenImage(currency)}
                title={currency}
                width={28}
              />
            ) : (
              <CurrencyDollarIcon className="size-7" />
            )}
            <span className="space-x-1">
              <H3 as="span">{amount}</H3>
              <span className="text-xs">{currency}</span>
            </span>
            <div className="mt-2">
              <HelpTooltip>
                <div className="py-1">
                  <div className="flex items-start justify-between space-x-10">
                    <div>{APP_NAME}</div>
                    <b>
                      {(amount * 0.05).toFixed(2)} {currency} (5%)
                    </b>
                  </div>
                </div>
              </HelpTooltip>
            </div>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <div className="block items-center space-y-1 sm:flex sm:space-x-5">
            <div className="flex items-center space-x-2">
              <UsersIcon className="ld-text-gray-500 size-4" />
              <button
                className="font-bold"
                onClick={() => setShowCollectorsModal(true)}
                type="button"
              >
                {humanize(collects)} {plur("collector", collects)}
              </button>
            </div>
            {collectLimit && !isAllCollected ? (
              <div className="flex items-center space-x-2">
                <PhotoIcon className="ld-text-gray-500 size-4" />
                <div className="font-bold">
                  {collectLimit - collects} available
                </div>
              </div>
            ) : null}
          </div>
          {endTimestamp && !isAllCollected ? (
            <div className="flex items-center space-x-2">
              <ClockIcon className="ld-text-gray-500 size-4" />
              <div className="space-x-1.5">
                <span>{isSaleEnded ? "Sale ended on:" : "Sale ends:"}</span>
                <span className="font-bold text-gray-600">
                  {isSaleEnded ? (
                    `${formatDate(endTimestamp, "MMM D, YYYY, hh:mm A")}`
                  ) : (
                    <CountdownTimer targetDate={endTimestamp} />
                  )}
                </span>
              </div>
            </div>
          ) : null}
          {collectAction.address ? (
            <div className="flex items-center space-x-2">
              <PuzzlePieceIcon className="ld-text-gray-500 size-4" />
              <div className="space-x-1.5">
                <span>Token:</span>
                <Link
                  className="font-bold text-gray-600"
                  href={`${BLOCK_EXPLORER_URL}/address/${collectAction.address}`}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {formatAddress(collectAction.address)}
                </Link>
              </div>
            </div>
          ) : null}
          {amount ? (
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="ld-text-gray-500 size-4" />
              <div className="space-x-1.5">
                <span>Revenue:</span>
                <Tooltip
                  content={`${humanize(amount * collects)} ${currency}`}
                  placement="top"
                >
                  <span className="font-bold text-gray-600">
                    {nFormatter(amount * collects)} {currency}
                  </span>
                </Tooltip>
              </div>
            </div>
          ) : null}
          {recipients.length > 1 ? <Splits recipients={recipients} /> : null}
        </div>
        <div className="flex items-center space-x-2">
          <CollectActionButton
            collects={collects}
            onCollectSuccess={() => increment()}
            postAction={collectAction}
            post={targetPost}
          />
        </div>
      </div>
      <Modal
        onClose={() => setShowCollectorsModal(false)}
        show={showCollectorsModal}
        title="Collectors"
        size="md"
      >
        <Collectors postId={targetPost.id} />
      </Modal>
    </>
  );
};

export default CollectActionBody;
