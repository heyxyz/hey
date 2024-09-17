import type { FC } from "react";

import getAssetLicense from "@helpers/getAssetLicense";
import { Select, Tooltip } from "@hey/ui";
import { MetadataLicenseType } from "@lens-protocol/metadata";
import Link from "next/link";
import { usePublicationLicenseStore } from "src/store/non-persisted/publication/usePublicationLicenseStore";

const LicensePicker: FC = () => {
  const { license, setLicense } = usePublicationLicenseStore();

  const otherOptions = Object.values(MetadataLicenseType)
    .filter((type) => getAssetLicense(type))
    .map((type) => ({
      label: getAssetLicense(type)?.label as string,
      selected: license === type,
      value: type
    })) as any;

  const options = [
    {
      label: "All rights reserved",
      selected: license === null,
      value: null
    },
    ...otherOptions
  ];

  return (
    <div className="my-5">
      {/* <div className="divider mb-3" /> */}
      <div className="mb-2 flex items-center justify-between">
        <b>License</b>
        <Tooltip
          content={
            <div className="max-w-xs py-2 leading-5">
              Creator licenses dictate the use, sharing, and distribution of
              music, art and other intellectual property - ranging from
              restrictive to permissive. Once given, you can't change the
              license.
            </div>
          }
          placement="top"
        >
          <div className="ld-text-gray-500 text-sm">What's this?</div>
        </Tooltip>
      </div>
      <Select
        onChange={(value) => setLicense(value as MetadataLicenseType)}
        options={options}
      />
      <div className="ld-text-gray-500 linkify mt-2 text-sm">
        {getAssetLicense(license)?.helper ||
          "You are not granting a license to the collector and retain all rights."}
        <Link
          className="ml-1.5"
          href="https://yoginth.notion.site/60f9d82c5a274a88b8444611c7a8a94a"
          target="_blank"
        >
          Learn more.
        </Link>
      </div>
    </div>
  );
};

export default LicensePicker;
