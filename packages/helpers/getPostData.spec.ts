import { describe, expect, test } from "vitest";
import getPostData from "./getPostData";

describe("getPostData", () => {
  test("should return correct data for ArticleMetadata", () => {
    const metadata: any = {
      __typename: "ArticleMetadata",
      attachments: ["attachment1", "attachment2"],
      content: "This is an article"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is an article"
    });
  });

  test("should return correct data for TextOnlyMetadata", () => {
    const metadata: any = {
      __typename: "TextOnlyMetadata",
      content: "This is a text-only post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      content: "This is a text-only post"
    });
  });

  test("should return correct data for LinkMetadata", () => {
    const metadata: any = {
      __typename: "LinkMetadata",
      content: "This is a link post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      content: "This is a link post"
    });
  });

  test("should return correct data for ImageMetadata", () => {
    const metadata: any = {
      __typename: "ImageMetadata",
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

  test("should return correct data for AudioMetadata", () => {
    const metadata: any = {
      __typename: "AudioMetadata",
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

  test("should return correct data for VideoMetadata", () => {
    const metadata: any = {
      __typename: "VideoMetadata",
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

  test("should return correct data for MintMetadata", () => {
    const metadata: any = {
      __typename: "MintMetadata",
      attachments: ["attachment1", "attachment2"],
      content: "This is a mint post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is a mint post"
    });
  });

  test("should return correct data for LivestreamMetadata", () => {
    const metadata: any = {
      __typename: "LivestreamMetadata",
      attachments: ["attachment1", "attachment2"],
      content: "This is a live stream post"
    };
    const result = getPostData(metadata);
    expect(result).toEqual({
      attachments: expect.any(Array),
      content: "This is a live stream post"
    });
  });

  test("should return correct data for CheckingInMetadata", () => {
    const metadata: any = {
      __typename: "CheckingInMetadata",
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

  test("should return correct data with missing attachments in ImageMetadata", () => {
    const metadata: any = {
      __typename: "ImageMetadata",
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
      __typename: "MintMetadata",
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
