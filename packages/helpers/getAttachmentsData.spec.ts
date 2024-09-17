import type { PublicationMetadataMedia } from "@hey/lens";

import { describe, expect, test } from "vitest";

import getAttachmentsData from "./getAttachmentsData";

describe("getAttachmentsData", () => {
  test("should return an empty array when attachments are not provided", () => {
    const result = getAttachmentsData();
    expect(result).toEqual([]);
  });

  test("should return an array of image attachments", () => {
    const attachments: PublicationMetadataMedia[] = [
      {
        __typename: "PublicationMetadataMediaImage",
        image: { optimized: { uri: "image-uri" }, raw: { uri: "raw-uri" } }
      }
    ];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([{ type: "Image", uri: "image-uri" }]);
  });

  test("should return an array of video attachments", () => {
    const attachments: PublicationMetadataMedia[] = [
      {
        __typename: "PublicationMetadataMediaVideo",
        cover: {
          optimized: { uri: "cover-uri" },
          raw: { uri: "raw-cover-uri" }
        },
        video: {
          optimized: { uri: "video-uri" },
          raw: { uri: "raw-video-uri" }
        }
      }
    ];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([
      { coverUri: "cover-uri", type: "Video", uri: "video-uri" }
    ]);
  });

  test("should return an array of audio attachments", () => {
    const attachments: PublicationMetadataMedia[] = [
      {
        __typename: "PublicationMetadataMediaAudio",
        artist: "John Doe",
        audio: {
          optimized: { uri: "audio-uri" },
          raw: { uri: "raw-audio-uri" }
        },
        cover: {
          optimized: { uri: "cover-uri" },
          raw: { uri: "raw-video-uri" }
        }
      }
    ];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([
      {
        artist: "John Doe",
        coverUri: "cover-uri",
        type: "Audio",
        uri: "audio-uri"
      }
    ]);
  });

  test("should return an empty array for unknown attachment types", () => {
    const attachments: any[] = [{ __typename: "UnknownAttachmentType" }];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([[]]);
  });
});
