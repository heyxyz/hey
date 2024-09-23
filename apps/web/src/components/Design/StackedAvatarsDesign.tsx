import { Card, CardHeader, H5, StackedAvatars } from "@hey/ui";
import type { FC } from "react";

const StackedAvatarsDesign: FC = () => {
  const avatars = [
    "https://github.com/bigint.png",
    "https://github.com/sasicodes.png",
    "https://github.com/mdo.png",
    "https://github.com/mikavilpas.png",
    "https://github.com/tommoor.png",
    "https://github.com/jack.png",
    "https://github.com/bigint.png",
    "https://github.com/sasicodes.png",
    "https://github.com/mdo.png",
    "https://github.com/mikavilpas.png",
    "https://github.com/tommoor.png",
    "https://github.com/jack.png"
  ];

  return (
    <Card>
      <CardHeader title="Stacked Avatars" />
      <div className="m-5 flex flex-col items-start gap-5">
        <div>
          <H5 className="mb-2">Simple Stacked Avatars</H5>
          <StackedAvatars avatars={avatars} />
        </div>
        <div>
          <H5 className="mb-2">Limited Stacked Avatars</H5>
          <StackedAvatars limit={5} avatars={avatars} />
        </div>
      </div>
    </Card>
  );
};

export default StackedAvatarsDesign;
