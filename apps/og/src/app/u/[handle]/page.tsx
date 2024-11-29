import { APP_NAME } from "@hey/data/constants";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import logger from "@hey/helpers/logger";
import { type Account, AccountDocument } from "@hey/indexer";
import { print } from "graphql";
import type { Metadata } from "next";
import defaultMetadata from "src/defaultMetadata";

interface Props {
  params: Promise<{ username: string }>;
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { username } = await params;

  const response = await fetch("https://api-v2.lens.dev", {
    body: JSON.stringify({
      operationName: "Account",
      query: print(AccountDocument),
      variables: {
        request: { username: { localName: username } }
      }
    }),
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });

  const result = await response.json();

  if (!result.data.profile) {
    return defaultMetadata;
  }

  const account = result.data.profile as Account;
  const { displayName, link, slugWithPrefix } = getAccount(account);
  const title = `${displayName} (${slugWithPrefix}) • ${APP_NAME}`;
  const description = (account?.metadata?.bio || title).slice(0, 155);

  return {
    alternates: { canonical: `https://hey.xyz${link}` },
    applicationName: APP_NAME,
    creator: displayName,
    description: description,
    keywords: [
      "hey",
      "hey.xyz",
      "social media profile",
      "social media",
      "lenster",
      "polygon",
      "profile",
      "lens",
      "lens protocol",
      "decentralized",
      "web3",
      displayName,
      slugWithPrefix
    ],
    metadataBase: new URL(`https://hey.xyz${link}`),
    openGraph: {
      description: description,
      images: [getAvatar(account)],
      siteName: "Hey",
      type: "profile",
      url: `https://hey.xyz${link}`
    },
    other: {
      "count:followers": account.stats.followers,
      "count:following": account.stats.following,
      "lens:username": username,
      "lens:id": account.address
    },
    publisher: displayName,
    title: title,
    twitter: { card: "summary", site: "@heydotxyz" }
  };
};

const Page = async ({ params }: Props) => {
  const { username } = await params;
  const metadata = await generateMetadata({ params });

  if (!metadata) {
    return <h1>{username}</h1>;
  }

  const profileUrl = `https://hey.xyz/u/${metadata.other?.["lens:username"]}`;

  logger.info(`[OG] Fetched profile /u/${username}`);

  return (
    <>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      <div>
        <b>Stats</b>
        <ul>
          <li>
            <a href={profileUrl}>
              Following: {metadata.other?.["count:following"]}
            </a>
          </li>
          <li>
            <a href={profileUrl}>
              Followers: {metadata.other?.["count:followers"]}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Page;
