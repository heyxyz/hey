import getFavicon from "@hey/helpers/getFavicon";
import axios from "axios";
import { parseHTML } from "linkedom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import getMetadata from "./getMetadata";
import getProxyUrl from "./getProxyUrl";
import generateIframe from "./meta/generateIframe";
import getDescription from "./meta/getDescription";
import getEmbedUrl from "./meta/getEmbedUrl";
import getFrame from "./meta/getFrame";
import getImage from "./meta/getImage";
import getNft from "./meta/getNft";
import getSite from "./meta/getSite";
import getTitle from "./meta/getTitle";
import getTweet from "./meta/getTweet";

// Mock the helper functions and axios
vi.mock("axios");
vi.mock("linkedom", () => ({ parseHTML: vi.fn() }));
vi.mock("@hey/helpers/getFavicon");
vi.mock("./meta/getDescription");
vi.mock("./meta/getImage");
vi.mock("./meta/getTitle");
vi.mock("./meta/getSite");
vi.mock("./meta/getFrame");
vi.mock("./meta/getTweet");
vi.mock("./meta/getNft");
vi.mock("./meta/generateIframe");
vi.mock("./meta/getEmbedUrl");
vi.mock("./getProxyUrl");

describe("getMetadata", () => {
  const mockUrl = "https://example.com";
  const mockHTML = "<html><head></head><body></body></html>";
  const mockDocument = { document: "mockDocument" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return metadata with valid inputs", async () => {
    (axios.get as any).mockResolvedValue({ data: mockHTML });
    (parseHTML as any).mockReturnValue({ document: mockDocument });
    (getDescription as any).mockReturnValue("Example description");
    (getImage as any).mockReturnValue("https://example.com/image.jpg");
    (getFavicon as any).mockReturnValue("https://example.com/favicon.ico");
    (getTitle as any).mockReturnValue("Example Title");
    (getSite as any).mockReturnValue("Example Site");
    (getFrame as any).mockReturnValue("<iframe></iframe>");
    (getTweet as any).mockReturnValue(null);
    (getNft as any).mockReturnValue(null);
    (generateIframe as any).mockReturnValue("<iframe></iframe>");
    (getEmbedUrl as any).mockReturnValue("https://example.com/embed");
    (getProxyUrl as any).mockReturnValue("https://proxy.example.com/image.jpg");

    const result = await getMetadata(mockUrl);

    expect(result).toEqual({
      description: "Example description",
      favicon: "https://example.com/favicon.ico",
      frame: "<iframe></iframe>",
      html: "<iframe></iframe>",
      tweet: null,
      image: "https://proxy.example.com/image.jpg",
      lastIndexedAt: expect.any(String),
      nft: null,
      site: "Example Site",
      title: "Example Title",
      url: mockUrl
    });
  });

  test("should return null when axios request fails", async () => {
    (axios.get as any).mockRejectedValue(new Error("Network error"));
    const result = await getMetadata(mockUrl);
    expect(result).toBeNull();
  });

  test("should return metadata with fallback values when some helpers return undefined", async () => {
    (axios.get as any).mockResolvedValue({ data: mockHTML });
    (parseHTML as any).mockReturnValue({ document: mockDocument });
    (getDescription as any).mockReturnValue(undefined);
    (getImage as any).mockReturnValue(undefined);
    (getFavicon as any).mockReturnValue(undefined);
    (getTitle as any).mockReturnValue(undefined);
    (getSite as any).mockReturnValue(undefined);
    (getFrame as any).mockReturnValue(undefined);
    (getTweet as any).mockReturnValue(undefined);
    (getNft as any).mockReturnValue(undefined);
    (generateIframe as any).mockReturnValue(undefined);
    (getEmbedUrl as any).mockReturnValue(undefined);
    (getProxyUrl as any).mockReturnValue(undefined);

    const result = await getMetadata(mockUrl);

    expect(result).toEqual({
      description: undefined,
      favicon: undefined,
      frame: undefined,
      html: undefined,
      tweet: undefined,
      image: undefined,
      lastIndexedAt: expect.any(String),
      nft: undefined,
      site: undefined,
      title: undefined,
      url: mockUrl
    });
  });
});
