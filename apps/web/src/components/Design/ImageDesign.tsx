import { Card, CardHeader, H5, Image } from "@hey/ui";
import type { FC } from "react";

const ImageDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Image" />
      <div className="m-5 flex flex-col items-start gap-5">
        <div>
          <H5 className="mb-2">Simple Image</H5>
          <Image
            src="https://github.com/bigint.png"
            alt="Bigint"
            height={100}
            width={100}
          />
        </div>
        <div>
          <H5 className="mb-2">Invalid Image</H5>
          <Image
            src="https://github.com/bigint.pdng"
            alt="Bigint"
            height={100}
            width={100}
          />
        </div>
      </div>
    </Card>
  );
};

export default ImageDesign;
