import SingleAccount from "@components/Shared/SingleAccount";
import SmallSingleAccount from "@components/Shared/SmallSingleAccount";
import type { Profile } from "@hey/lens";
import { Card, CardHeader, H5 } from "@hey/ui";
import type { FC } from "react";

const AccountsDesign: FC = () => {
  const account = {
    handle: { localName: "yoginth" },
    id: "0x0d",
    metadata: {
      bio: "creator of @lens/hey 🌸 // $bonsai early supporter // fighting for human privacy 🛡️ // opinions are mine // swiftie // he/him",
      displayName: "Yoginth",
      picture: {
        optimized: {
          uri: "https://ik.imagekit.io/lens/media-snapshot/29e4fa02ae65d97c0ff04a023de02a3a4e4cccd7200b5ea3be0503296ebce0ce.png"
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader title="Profile" />
      <div className="m-5 space-y-5">
        <div className="space-y-3">
          <H5>Profile</H5>
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={account as Profile}
          />
        </div>
        <div className="space-y-3">
          <H5>Profile with ID</H5>
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={account as Profile}
            showId
          />
        </div>
        <div className="space-y-3">
          <H5>Profile with Bio</H5>
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={account as Profile}
            showBio
          />
        </div>
        <div className="space-y-3">
          <H5>Profile with Timestamp</H5>
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            account={account as Profile}
            timestamp={new Date("2024-06-29T19:16:26.062Z")}
          />
        </div>
        <div className="space-y-3">
          <H5>Big Profile</H5>
          <SingleAccount
            hideFollowButton
            hideUnfollowButton
            isBig
            account={account as Profile}
          />
        </div>
        <div className="space-y-3">
          <H5>Small Profile</H5>
          <SmallSingleAccount account={account as Profile} />
        </div>
        <div className="space-y-3">
          <H5>Small Profile with Slug</H5>
          <SmallSingleAccount hideSlug account={account as Profile} />
        </div>
        <div className="space-y-3">
          <H5>Small Profile with timestamp</H5>
          <SmallSingleAccount
            account={account as Profile}
            timestamp={new Date("2024-06-29T19:16:26.062Z")}
          />
        </div>
        <div className="space-y-3">
          <H5>Small Profile with small avatar</H5>
          <SmallSingleAccount account={account as Profile} smallAvatar />
        </div>
      </div>
    </Card>
  );
};

export default AccountsDesign;
