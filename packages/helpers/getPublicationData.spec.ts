import { describe, expect, test } from "vitest";

import getPublicationData from "./getPublicationData";

describe("getPublicationData", () => {
  test("should return correct data for ArticleMetadataV3", () => {
    const metadata: any = {
      __typename: "ArticleMetadataV3",
      attachments: ["attachment1", "attachment2"],
      content: "This is an article"
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is an article"
    });
  });

  test("should return correct data for TextOnlyMetadataV3", () => {
    const metadata: any = {
      __typename: "TextOnlyMetadataV3",
      content: "This is a text-only publication"
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: "This is a text-only publication"
    });
  });

  test("should return correct data for LinkMetadataV3", () => {
    const metadata: any = {
      __typename: "LinkMetadataV3",
      content: "This is a link publication"
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: "This is a link publication"
    });
  });

  test("should return correct data for ImageMetadataV3", () => {
    const metadata: any = {
      __typename: "ImageMetadataV3",
      asset: { image: { optimized: { uri: "image-uri" } } },
      attachments: ["attachment1", "attachment2"],
      content: "This is an image publication"
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      asset: { type: "Image", uri: "image-uri" },
      attachments: expect.any(Array),
      content: "This is an image publication"
    });
  });

  test("should return correct data for AudioMetadataV3", () => {
    const metadata: any = {
      __typename: "AudioMetadataV3",
      asset: {
        artist: "Artist Name",
        audio: { optimized: { uri: "audio-uri" } },
        cover: { optimized: { uri: "cover-uri" } }
      },
      attachments: ["attachment1", "attachment2"],
      content: "This is an audio publication",
      title: "Audio Title"
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      asset: {
        artist: "Artist Name",
        cover: "cover-uri",
        title: "Audio Title",
        type: "Audio",
        uri: "audio-uri"
      },
      content: "This is an audio publication"
    });
  });

  test("should return correct data for VideoMetadataV3", () => {
    const metadata: any = {
      __typename: "VideoMetadataV3",
      asset: {
        cover: { optimized: { uri: "cover-uri" } },
        video: { optimized: { uri: "video-uri" } }
      },
      attachments: ["attachment1", "attachment2"],
      content: "This is a video publication"
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      asset: { cover: "cover-uri", type: "Video", uri: "video-uri" },
      content: "This is a video publication"
    });
  });

  test("should return correct data for MintMetadataV3", () => {
    const metadata: any = {
      __typename: "MintMetadataV3",
      attachments: ["attachment1", "attachment2"],
      content: "This is a mint publication"
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is a mint publication"
    });
  });

  test("should return correct data for LiveStreamMetadataV3", () => {
    const metadata: any = {
      __typename: "LiveStreamMetadataV3",
      attachments: ["attachment1", "attachment2"],
      content: "This is a live stream publication"
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is a live stream publication"
    });
  });

  test("should return null for unknown metadata __typename", () => {
    const metadata: any = {
      __typename: "UnknownMetadataType",
      content: "This is an unknown publication"
    };
    const result = getPublicationData(metadata);
    expect(result).toBeNull();
  });
});
