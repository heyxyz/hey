import type { MirrorablePublication } from "@hey/lens";
import { Card, CardHeader } from "@hey/ui";
import type { FC } from "react";

interface CheckinProps {
  post: MirrorablePublication;
}

const Checkin: FC<CheckinProps> = ({ post }) => {
  if (post.metadata.__typename !== "CheckingInMetadataV3") {
    return null;
  }

  const { metadata } = post;
  const locality = metadata.address?.locality;
  const country = metadata.address?.country;
  const postalCode = metadata.address?.postalCode;
  const location = metadata.location;
  const address = `${locality}, ${country}${postalCode ? `, ${postalCode}` : ""}`;

  return (
    <Card className="mt-4">
      <CardHeader title={location} body={address} />
      <iframe
        width="100%"
        height="200"
        className="rounded-t-none"
        loading="lazy"
        title={location}
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBrxocLyV2K3XO99m5c74tedidN3vRU3Yc&q=${location}${address}`}
      />
    </Card>
  );
};

export default Checkin;
