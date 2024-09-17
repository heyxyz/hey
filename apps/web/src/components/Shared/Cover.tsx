import type { FC } from "react";

import { BRAND_COLOR, COVER, STATIC_IMAGES_URL } from "@hey/data/constants";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";

interface CoverProps {
  cover: string;
}

const Cover: FC<CoverProps> = ({ cover }) => {
  const isDefaultCover = cover.includes(STATIC_IMAGES_URL);
  const backgroundImage = isDefaultCover
    ? `${STATIC_IMAGES_URL}/patterns/2.svg`
    : imageKit(sanitizeDStorageUrl(cover), COVER);

  const backgroundStyles = {
    backgroundColor: BRAND_COLOR,
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: "center center",
    backgroundRepeat: isDefaultCover ? "repeat" : "no-repeat",
    backgroundSize: isDefaultCover ? "30%" : "cover"
  };

  return (
    <div className="container mx-auto max-w-[1350px]">
      <div
        className="h-52 sm:h-[350px] md:rounded-b-2xl"
        style={backgroundStyles}
      />
    </div>
  );
};

export default Cover;
