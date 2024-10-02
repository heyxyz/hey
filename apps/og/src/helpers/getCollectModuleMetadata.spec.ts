import getPublicationOGImages from "@helpers/getPublicationOGImages";
import { APP_NAME } from "@hey/data/constants";
import allowedOpenActionModules from "@hey/helpers/allowedOpenActionModules";
import getProfile from "@hey/helpers/getProfile";
import { beforeEach, describe, expect, test, vi } from "vitest";
import getCollectModuleMetadata from "./getCollectModuleMetadata";

// Mock the imported functions
vi.mock("@hey/helpers/getProfile", () => ({
  default: vi.fn()
}));

vi.mock("@helpers/getPublicationOGImages", () => ({
  default: vi.fn()
}));

describe("getCollectModuleMetadata", () => {
  const mockProfile = { slugWithPrefix: "@john_doe" };
  const mockOGImages = ["https://example.com/media.jpg"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return correct metadata when open action module is present", () => {
    (getProfile as any).mockReturnValue(mockProfile);
    (getPublicationOGImages as any).mockReturnValue(mockOGImages);

    const publication = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Publication"
      },
      openActionModules: [
        {
          type: allowedOpenActionModules[0],
          contract: { address: "0xabcdefabcdef" }
        }
      ],
      stats: { countOpenActions: 10 },
      id: "publication-id-123"
    } as any;

    const result = getCollectModuleMetadata(publication);

    expect(result).toEqual({
      "eth:nft:chain": "polygon",
      "eth:nft:collection": `MirrorablePublication by @john_doe • ${APP_NAME}`,
      "eth:nft:contract_address": "0xabcdefabcdef",
      "eth:nft:creator_address": "0x1234567890abcdef",
      "eth:nft:media_url": "https://example.com/media.jpg",
      "eth:nft:mint_count": 10,
      "eth:nft:mint_url": "https://hey.xyz/posts/publication-id-123",
      "eth:nft:schema": "ERC721"
    });
  });

  test("should return undefined when no open action module is present", () => {
    const publication = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Publication"
      },
      openActionModules: [],
      stats: { countOpenActions: 0 },
      id: "publication-id-123"
    } as any;

    const result = getCollectModuleMetadata(publication);
    expect(result).toBeUndefined();
  });

  test("should return undefined when collect module is not found", () => {
    const publication = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Publication"
      },
      openActionModules: [
        { type: "NonAllowedModuleType", contract: { address: "0xabcdef" } }
      ],
      stats: { countOpenActions: 0 },
      id: "publication-id-123"
    } as any;

    const result = getCollectModuleMetadata(publication);
    expect(result).toBeUndefined();
  });

  test("should return undefined when openActionModules is missing", () => {
    const publication = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Publication"
      },
      stats: { countOpenActions: 0 },
      id: "publication-id-123"
    } as any;

    const result = getCollectModuleMetadata(publication);
    expect(result).toBeUndefined();
  });

  test("should return undefined when no valid collect module is found", () => {
    const publication = {
      __typename: "MirrorablePublication",
      by: {
        ownedBy: { address: "0x1234567890abcdef" }
      },
      metadata: {
        title: "Test Publication"
      },
      openActionModules: [
        { type: "UnknownModuleType", contract: { address: "0xabcdef" } }
      ],
      stats: { countOpenActions: 0 },
      id: "publication-id-123"
    } as any;

    const result = getCollectModuleMetadata(publication);
    expect(result).toBeUndefined();
  });
});
