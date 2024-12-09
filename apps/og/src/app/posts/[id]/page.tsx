import getCollectModuleMetadata from "@helpers/getCollectModuleMetadata";
import getPostOGImages from "@helpers/getPostOGImages";
import { APP_NAME } from "@hey/data/constants";
import getAccount from "@hey/helpers/getAccount";
import getPostData from "@hey/helpers/getPostData";
import logger from "@hey/helpers/logger";
import { isRepost } from "@hey/helpers/postHelpers";
import { type AnyPost, PostDocument } from "@hey/indexer";
import { addTypenameToDocument } from "apollo-utilities";
import { print } from "graphql";
import type { Metadata } from "next";
import defaultMetadata from "src/defaultMetadata";

interface Props {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { id } = await params;

  const response = await fetch("https://api-v2.lens.dev", {
    body: JSON.stringify({
      operationName: "Post",
      query: print(addTypenameToDocument(PostDocument)),
      variables: { request: { forId: id } }
    }),
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });

  const result = await response.json();

  if (!result.data.post) {
    return defaultMetadata;
  }

  const post = result.data.post as AnyPost;
  const targetPost = isRepost(post) ? post.repostOf : post;
  const { author, metadata } = targetPost;
  const filteredContent = getPostData(metadata)?.content || "";
  const filteredAsset = getPostData(metadata)?.asset;
  const assetIsAudio = filteredAsset?.type === "Audio";

  const { name, link, slugWithPrefix } = getAccount(author);
  const title = `${targetPost.__typename} by ${slugWithPrefix} • ${APP_NAME}`;
  const description = (filteredContent || title).slice(0, 155);

  return {
    alternates: { canonical: `https://hey.xyz/posts/${targetPost.id}` },
    applicationName: APP_NAME,
    authors: { name, url: `https://hey.xyz${link}` },
    creator: name,
    description: description,
    keywords: [
      "hey",
      "hey.xyz",
      "social media post",
      "social media",
      "lenster",
      "polygon",
      "profile post",
      "like",
      "share",
      "post",
      "lens",
      "lens protocol",
      "decentralized",
      "web3",
      name,
      slugWithPrefix
    ],
    metadataBase: new URL(`https://hey.xyz/posts/${targetPost.id}`),
    openGraph: {
      description: description,
      images: getPostOGImages(metadata) as any,
      siteName: "Hey",
      type: "article",
      url: `https://hey.xyz/posts/${targetPost.id}`
    },
    other: {
      "count:actions": targetPost.stats.countOpenActions,
      "count:comments": targetPost.stats.comments,
      "count:likes": targetPost.stats.reactions,
      "count:reposts": targetPost.stats.reposts,
      "count:quotes": targetPost.stats.quotes,
      "lens:id": targetPost.id,
      ...getCollectModuleMetadata(targetPost)
    },
    publisher: name,
    title: title,
    twitter: {
      card: assetIsAudio ? "summary" : "summary_large_image",
      site: "@heydotxyz"
    }
  };
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const metadata = await generateMetadata({ params });

  if (!metadata) {
    return <h1>{id}</h1>;
  }

  const postUrl = `https://hey.xyz/posts/${metadata.other?.["lens:id"]}`;

  logger.info(`[OG] Fetched post /posts/${metadata.other?.["lens:id"]}`);

  return (
    <>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      <div>
        <b>Stats</b>
        <ul>
          <li>
            <a href={postUrl}>Actions: {metadata.other?.["count:actions"]}</a>
          </li>
          <li>Comments: {metadata.other?.["count:comments"]}</li>
          <li>
            <a href={postUrl}>Likes: {metadata.other?.["count:likes"]}</a>
          </li>
          <li>
            <a href={postUrl}>Reposts: {metadata.other?.["count:reposts"]}</a>
          </li>
          <li>
            <a href={`${postUrl}/quotes`}>
              Quotes: {metadata.other?.["count:quotes"]}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Page;
