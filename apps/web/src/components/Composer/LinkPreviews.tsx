import Oembed from "@components/Shared/Oembed";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { KNOWN_ATTRIBUTES } from "@hey/data/constants";
import getURLs from "@hey/helpers/getURLs";
import { MetadataAttributeType } from "@lens-protocol/metadata";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { usePostAttachmentStore } from "src/store/non-persisted/post/usePostAttachmentStore";
import { usePostAttributesStore } from "src/store/non-persisted/post/usePostAttributesStore";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";

const LinkPreviews: FC = () => {
  const { postContent, quotedPost } = usePostStore();
  const { attachments } = usePostAttachmentStore((state) => state);
  const { addAttribute, getAttribute, removeAttribute } =
    usePostAttributesStore();
  const [showRemove, setShowRemove] = useState(false);

  const urls = getURLs(postContent);

  useEffect(() => {
    if (urls.length) {
      removeAttribute(KNOWN_ATTRIBUTES.HIDE_OEMBED);
    }
  }, [urls.length]);

  if (
    !urls.length ||
    attachments.length ||
    quotedPost ||
    getAttribute(KNOWN_ATTRIBUTES.HIDE_OEMBED)?.value === "true"
  ) {
    return null;
  }

  return (
    <div className="relative m-5">
      <Oembed
        onLoad={(og) => setShowRemove(Boolean(og?.title))}
        url={urls[0]}
      />
      {showRemove && (
        <div className="-m-3 absolute top-0">
          <button
            className="rounded-full bg-gray-900 p-1.5 opacity-75"
            onClick={() =>
              addAttribute({
                key: KNOWN_ATTRIBUTES.HIDE_OEMBED,
                type: MetadataAttributeType.BOOLEAN,
                value: "true"
              })
            }
            type="button"
          >
            <XMarkIcon className="size-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkPreviews;
