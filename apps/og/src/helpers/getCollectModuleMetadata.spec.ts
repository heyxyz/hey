import getPostOGImages from "@helpers/getPostOGImages";
import { APP_NAME } from "@hey/data/constants";
import allowedPostActionModules from "@hey/helpers/allowedPostActionModules";
import getAccount from "@hey/helpers/getAccount";
import { beforeEach, describe, expect, test, vi } from "vitest";
import getCollectModuleMetadata from "./getCollectModuleMetadata";

// Mock the imported functions
vi.mock("@hey/helpers/getAccount", () => ({
  default: vi.fn()
}));

vi.mock("@helpers/getPostOGImages", () => ({
  default: vi.fn()
}));

describe("getCollectModuleMetadata", () => {
  const mockProfile = { slugWithPrefix: "@john_doe" };
  const mockOGImages = ["https://example.com/media.jpg"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return correct metadata when open action module is present", () => {
    (getAccount as any).mockReturnValue(mockProfile);
    (getPostOGImages as any).mockReturnValue(mockOGImages);

    const post = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Post"
      },
      openActionModules: [
        {
          type: allowedPostActionModules[0],
          contract: { address: "0xabcdefabcdef" }
        }
      ],
      stats: { countOpenActions: 10 },
      id: "post-id-123"
    } as any;

    const result = getCollectModuleMetadata(post);

    expect(result).toEqual({
      "eth:nft:chain": "polygon",
      "eth:nft:collection": `MirrorablePublication by @john_doe • ${APP_NAME}`,
      "eth:nft:contract_address": "0xabcdefabcdef",
      "eth:nft:creator_address": "0x1234567890abcdef",
      "eth:nft:media_url": "https://example.com/media.jpg",
      "eth:nft:mint_count": 10,
      "eth:nft:mint_url": "https://hey.xyz/posts/post-id-123",
      "eth:nft:schema": "ERC721"
    });
  });

  test("should return undefined when no open action module is present", () => {
    const post = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Post"
      },
      openActionModules: [],
      stats: { countOpenActions: 0 },
      id: "post-id-123"
    } as any;

    const result = getCollectModuleMetadata(post);
    expect(result).toBeUndefined();
  });

  test("should return undefined when collect module is not found", () => {
    const post = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Post"
      },
      openActionModules: [
        { type: "NonAllowedModuleType", contract: { address: "0xabcdef" } }
      ],
      stats: { countOpenActions: 0 },
      id: "post-id-123"
    } as any;

    const result = getCollectModuleMetadata(post);
    expect(result).toBeUndefined();
  });

  test("should return undefined when openActionModules is missing", () => {
    const post = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Post"
      },
      stats: { countOpenActions: 0 },
      id: "post-id-123"
    } as any;

    const result = getCollectModuleMetadata(post);
    expect(result).toBeUndefined();
  });

  test("should return undefined when no valid collect module is found", () => {
    const post = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Post"
      },
      openActionModules: [
        { type: "UnknownModuleType", contract: { address: "0xabcdef" } }
      ],
      stats: { countOpenActions: 0 },
      id: "post-id-123"
    } as any;

    const result = getCollectModuleMetadata(post);
    expect(result).toBeUndefined();
  });
});
