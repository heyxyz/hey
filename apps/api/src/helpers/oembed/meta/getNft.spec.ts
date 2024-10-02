import { parseHTML } from "linkedom";
import { describe, expect, test, vi } from "vitest";
import getNft from "./getNft";

vi.mock("@hey/data/og", () => ({
  IGNORED_NFT_HOSTS: ["example.com"]
}));

vi.mock("@hey/helpers/getNftChainId", () => ({
  default: vi.fn(() => "ethereum")
}));

describe("getNft", () => {
  test("should return null if the source URL is from an ignored host", () => {
    const html = `
      <html>
        <head>
          <meta name="eth:nft:collection" content="Test Collection" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getNft(document, "https://example.com/nft/123");

    expect(result).toBeNull();
  });

  test("should return NFT data when all metadata is present", () => {
    const html = `
      <html>
        <head>
          <meta name="eth:nft:collection" content="Test Collection" />
          <meta name="eth:nft:contract_address" content="0x1234567890abcdef" />
          <meta name="eth:nft:creator_address" content="0xabcdef1234567890" />
          <meta name="eth:nft:chain" content="ethereum" />
          <meta name="eth:nft:media_url" content="https://example.com/nft.jpg" />
          <meta name="og:description" content="Test NFT Description" />
          <meta name="eth:nft:mint_count" content="100" />
          <meta name="eth:nft:schema" content="ERC721" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getNft(document, "https://nftsite.com/nft/123");

    expect(result).toEqual({
      chain: "ethereum",
      collectionName: "Test Collection",
      contractAddress: "0x1234567890abcdef",
      creatorAddress: "0xabcdef1234567890",
      description: "Test NFT Description",
      endTime: null,
      mediaUrl: "https://example.com/nft.jpg",
      mintCount: "100",
      mintStatus: null,
      mintUrl: null,
      schema: "ERC721",
      sourceUrl: "https://nftsite.com/nft/123"
    });
  });

  test("should return data from Frame buttons if present", () => {
    const html = `
      <html>
        <head>
          <meta name="fc:frame:button:1:action" content="mint" />
          <meta name="fc:frame:button:1:target" content="eip155:1" />
          <meta name="fc:frame:image" content="https://frame.com/image.jpg" />
          <meta name="og:title" content="Frame Collection" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getNft(document, "https://nftsite.com/nft/123");

    expect(result).toEqual({
      chain: "ethereum",
      collectionName: "Frame Collection",
      contractAddress: null,
      creatorAddress: null,
      description: null,
      endTime: null,
      mediaUrl: "https://frame.com/image.jpg",
      mintCount: null,
      mintStatus: null,
      mintUrl: null,
      schema: null,
      sourceUrl: "https://nftsite.com/nft/123"
    });
  });

  test("should return null if collectionName, contractAddress, creatorAddress, and schema are all missing", () => {
    const html = `
      <html>
        <head></head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getNft(document, "https://nftsite.com/nft/123");

    expect(result).toBeNull();
  });
});
