import { Leafwatch } from "@helpers/leafwatch";
import { ATTACHMENT } from "@hey/data/constants";
import { POST } from "@hey/data/tracking";
import imageKit from "@hey/helpers/imageKit";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { OG } from "@hey/types/misc";
import { Card, Image } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";

interface EmbedProps {
  og: OG;
  postId?: string;
}

const Embed: FC<EmbedProps> = ({ og, postId }) => {
  return (
    <div className="mt-4 w-full text-sm md:w-4/6">
      <Link
        href={og.url}
        onClick={(event) => {
          stopEventPropagation(event);
          Leafwatch.track(POST.CLICK_OEMBED, {
            ...(postId && { postId: postId }),
            url: og.url
          });
        }}
        rel="noreferrer noopener"
        target={og.url.includes(location.host) ? "_self" : "_blank"}
      >
        <Card className="p-3" forceRounded>
          <div className="flex items-center">
            {og.image ? (
              <Image
                alt="Thumbnail"
                className="size-16 rounded-xl bg-gray-200 md:size-20"
                height={80}
                onError={({ currentTarget }) => {
                  currentTarget.src = og.image as string;
                }}
                src={imageKit(og.image, ATTACHMENT)}
                width={80}
              />
            ) : null}
            <div className="truncate px-5 py-4">
              <div className="space-y-1">
                {og.title ? (
                  <div className="flex items-center space-x-1.5">
                    {og.favicon ? (
                      <img
                        alt="Favicon"
                        className="size-4 rounded-full"
                        height={16}
                        src={og.favicon}
                        title={og.site || og.url}
                        width={16}
                      />
                    ) : null}
                    <b className="truncate">{og.title}</b>
                  </div>
                ) : null}
                {og.description ? (
                  <div className="ld-text-gray-500 line-clamp-1 whitespace-break-spaces">
                    {og.description.replace(/ +/g, " ")}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default Embed;
