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

  test("should handle multiple attachments of different types", () => {
    const attachments: PublicationMetadataMedia[] = [
      {
        __typename: "PublicationMetadataMediaImage",
        image: { optimized: { uri: "image-uri-1" }, raw: { uri: "raw-uri-1" } }
      },
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
      { type: "Image", uri: "image-uri-1" },
      { coverUri: "cover-uri", type: "Video", uri: "video-uri" }
    ]);
  });

  test("should return an array with 'null' values if optimized URIs are missing", () => {
    const attachments: PublicationMetadataMedia[] = [
      {
        __typename: "PublicationMetadataMediaImage",
        image: { optimized: { uri: null }, raw: { uri: "raw-uri" } }
      },
      {
        __typename: "PublicationMetadataMediaAudio",
        artist: "John Doe",
        audio: { optimized: { uri: null }, raw: { uri: "raw-audio-uri" } },
        cover: { optimized: { uri: null }, raw: { uri: "raw-cover-uri" } }
      }
    ];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([
      { type: "Image", uri: null },
      { artist: "John Doe", coverUri: null, type: "Audio", uri: null }
    ]);
  });

  test("should return an empty array when optimized and raw URIs are missing", () => {
    const attachments: PublicationMetadataMedia[] = [
      {
        __typename: "PublicationMetadataMediaImage",
        image: { optimized: { uri: null }, raw: { uri: null } }
      }
    ];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([{ type: "Image", uri: null }]);
  });

  test("should handle attachments with missing properties", () => {
    const attachments: any[] = [
      {
        __typename: "PublicationMetadataMediaVideo",
        video: { optimized: { uri: "video-uri" } }
        // Missing cover and raw URIs
      }
    ];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([
      { type: "Video", uri: "video-uri", coverUri: undefined }
    ]);
  });
});
