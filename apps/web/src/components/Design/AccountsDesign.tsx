import SingleAccount from "@components/Shared/SingleAccount";
import SmallSingleAccount from "@components/Shared/SmallSingleAccount";
import { ADDRESS_PLACEHOLDER } from "@hey/data/constants";
import type { Account } from "@hey/indexer";
import { Card, CardHeader, H5 } from "@hey/ui";
import type { FC } from "react";

const AccountsDesign: FC = () => {
  const account: any = {
    address: ADDRESS_PLACEHOLDER,
    owner: ADDRESS_PLACEHOLDER,
    score: 1000,
    metadata: {
      id: ADDRESS_PLACEHOLDER,
      attributes: [],
      bio: "creator of @lens/hey 🌸 // $bonsai early supporter // fighting for human privacy 🛡️ // opinions are mine // swiftie // he/him",
      name: "Yoginth",
      picture: {
        optimized: {
          uri: "https://ik.imagekit.io/lens/media-snapshot/29e4fa02ae65d97c0ff04a023de02a3a4e4cccd7200b5ea3be0503296ebce0ce.png"
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader title="Account" />
      <div className="m-5 space-y-5">
        <div className="space-y-3">
          <H5>Account</H5>
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={account as Account}
          />
        </div>
        <div className="space-y-3">
          <H5>Account with Bio</H5>
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={account as Account}
            showBio
          />
        </div>
        <div className="space-y-3">
          <H5>Account with Timestamp</H5>
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={account as Account}
            timestamp={new Date("2024-06-29T19:16:26.062Z")}
          />
        </div>
        <div className="space-y-3">
          <H5>Big Account</H5>
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            isBig
            account={account as Account}
          />
        </div>
        <div className="space-y-3">
          <H5>Small Account</H5>
          <SmallSingleAccount account={account as Account} />
        </div>
        <div className="space-y-3">
          <H5>Small Account with Slug</H5>
          <SmallSingleAccount hideSlug account={account as Account} />
        </div>
        <div className="space-y-3">
          <H5>Small Account with timestamp</H5>
          <SmallSingleAccount
            account={account as Account}
            timestamp={new Date("2024-06-29T19:16:26.062Z")}
          />
        </div>
        <div className="space-y-3">
          <H5>Small Account with small avatar</H5>
          <SmallSingleAccount account={account as Account} smallAvatar />
        </div>
      </div>
    </Card>
  );
};

export default AccountsDesign;
