import { Card, CardHeader, H5, StackedAvatars } from "@hey/ui";
import type { FC } from "react";

const StackedAvatarsDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Card" />
      <div className="m-5 flex flex-col items-start gap-5">
        <div>
          <H5 className="mb-2">Simple Stacked Avatars</H5>
          <StackedAvatars
            avatars={[
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
            ]}
          />
        </div>
        <div>
          <H5 className="mb-2">Limited Stacked Avatars</H5>
          <StackedAvatars
            limit={5}
            avatars={[
              "https://github.com/bigint.png",
              "https://github.com/sasicodes.png",
              "https://github.com/mdo.png",
              "https://github.com/mikavilpas.png",
              "https://github.com/tommoor.png",
              "https://github.com/jack.png",
              "https://github.com/bigint.png"
            ]}
          />
        </div>
      </div>
    </Card>
  );
};

export default StackedAvatarsDesign;
