import { describe, expect, test } from "vitest";
import getPostData from "./getPostData";

describe("getPostData", () => {
  test("should return correct data for ArticleMetadataV3", () => {
    const metadata: any = {
      __typename: "ArticleMetadataV3",
      attachments: ["attachment1", "attachment2"],
      content: "This is an article"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is an article"
    });
  });

  test("should return correct data for TextOnlyMetadataV3", () => {
    const metadata: any = {
      __typename: "TextOnlyMetadataV3",
      content: "This is a text-only post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      content: "This is a text-only post"
    });
  });

  test("should return correct data for LinkMetadataV3", () => {
    const metadata: any = {
      __typename: "LinkMetadataV3",
      content: "This is a link post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      content: "This is a link post"
    });
  });

  test("should return correct data for ImageMetadataV3", () => {
    const metadata: any = {
      __typename: "ImageMetadataV3",
      asset: { image: { optimized: { uri: "image-uri" } } },
      attachments: ["attachment1", "attachment2"],
      content: "This is an image post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      asset: { type: "Image", uri: "image-uri" },
      attachments: expect.any(Array),
      content: "This is an image post"
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
      content: "This is an audio post",
      title: "Audio Title"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      asset: {
        artist: "Artist Name",
        cover: "cover-uri",
        title: "Audio Title",
        type: "Audio",
        uri: "audio-uri"
      },
      content: "This is an audio post"
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
      content: "This is a video post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      asset: { cover: "cover-uri", type: "Video", uri: "video-uri" },
      content: "This is a video post"
    });
  });

  test("should return correct data for MintMetadataV3", () => {
    const metadata: any = {
      __typename: "MintMetadataV3",
      attachments: ["attachment1", "attachment2"],
      content: "This is a mint post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is a mint post"
    });
  });

  test("should return correct data for LiveStreamMetadataV3", () => {
    const metadata: any = {
      __typename: "LiveStreamMetadataV3",
      attachments: ["attachment1", "attachment2"],
      content: "This is a live stream post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is a live stream post"
    });
  });

  test("should return correct data for CheckingInMetadataV3", () => {
    const metadata: any = {
      __typename: "CheckingInMetadataV3",
      attachments: ["attachment1", "attachment2"],
      content: "This is a checking in post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is a checking in post"
    });
  });

  test("should return null for unknown metadata __typename", () => {
    const metadata: any = {
      __typename: "UnknownMetadataType",
      content: "This is an unknown post"
    };
    const result = getPostData(metadata);
    expect(result).toBeNull();
  });

  test("should return correct data with missing attachments in ImageMetadataV3", () => {
    const metadata: any = {
      __typename: "ImageMetadataV3",
      asset: { image: { optimized: { uri: "image-uri" } } },
      attachments: null,
      content: "This is an image post with missing attachments"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      asset: { type: "Image", uri: "image-uri" },
      attachments: expect.any(Array),
      content: "This is an image post with missing attachments"
    });
  });

  test("should return default attachments and content if they are undefined", () => {
    const metadata: any = {
      __typename: "MintMetadataV3",
      attachments: undefined,
      content: undefined
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: undefined
    });
  });
});
