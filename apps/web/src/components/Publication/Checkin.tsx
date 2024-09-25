import type { MirrorablePublication } from "@hey/lens";
import { Card, CardHeader } from "@hey/ui";
import type { FC } from "react";

interface CheckinProps {
  publication: MirrorablePublication;
}

const Checkin: FC<CheckinProps> = ({ publication }) => {
  if (publication.metadata.__typename !== "CheckingInMetadataV3") {
    return null;
  }

  const { metadata } = publication;
  const latitude = metadata.geographic?.latitude;
  const longitude = metadata.geographic?.longitude;
  const locality = metadata.address?.locality;
  const country = metadata.address?.country;
  const postalCode = metadata.address?.postalCode;
  const location = metadata.location;
  const address = `${locality}, ${country}${postalCode ? `, ${postalCode}` : ""}`;
  const position = `${latitude},${longitude}`;

  if (!latitude || !longitude) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader title={location} body={address} />
      <iframe
        width="100%"
        height="200"
        className="rounded-t-none"
        loading="lazy"
        title={location}
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBrxocLyV2K3XO99m5c74tedidN3vRU3Yc&q=${position}`}
      />
    </Card>
  );
};

export default Checkin;
