import { HEY_IMAGEKIT_URL } from "@hey/data/constants";
import axios from "axios";
import { describe, expect, test } from "vitest";
import { TEST_URL } from "../helpers/constants";

describe("GET /oembed", () => {
  test("should return 400 if no url is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/oembed`);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return oembed data if the url is valid", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/oembed`, {
      params: { url: "https://github.com/bigint" }
    });

    expect(status).toBe(200);
    expect(data.oembed).toMatchObject({
      image: `${HEY_IMAGEKIT_URL}/oembed/tr:di-placeholder.webp,h-400,w-400/https://avatars.githubusercontent.com/u/69431456?v=4?s=400`,
      site: "GitHub",
      title: "bigint - Overview",
      url: "https://github.com/bigint"
    });
  });

  test("should return oembed data with HTML", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/oembed`, {
      params: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    });

    expect(status).toBe(200);
    expect(data.oembed).toMatchObject({
      html: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="100%" height="415" allow="accelerometer; encrypted-media" allowfullscreen></iframe>'
    });
  });

  test("should return oembed data with Tweet ID", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/oembed`, {
      params: { url: "https://x.com/yogicodes/status/1838260531829858491" }
    });

    expect(status).toBe(200);
    expect(data.oembed).toMatchObject({
      tweet: "1838260531829858491"
    });
  });

  test("should return oembed data with Frame", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/oembed`, {
      params: {
        url: "https://zora.co/collect/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1"
      }
    });

    expect(status).toBe(200);
    expect(data.oembed.frame).toMatchObject({
      acceptsAnonymous: true,
      acceptsLens: false,
      buttons: [
        {
          action: "tx",
          button: "Mint",
          postUrl:
            "https://zora.co/collect/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1",
          target:
            "https://zora.co/api/frame/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1"
        },
        {
          action: "link",
          button: "View on Zora",
          postUrl:
            "https://zora.co/collect/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1",
          target:
            "https://zora.co/collect/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1"
        }
      ],
      frameUrl:
        "https://zora.co/collect/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1",
      image:
        "https://zora.co/api/og-image/post/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1?v=2",
      openFramesVersion: "vNext",
      postUrl:
        "https://zora.co/collect/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1"
    });
  });

  test("should return oembed data with NFT", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/oembed`, {
      params: {
        url: "https://pods.media/ufo/interpreting-technology-with-aixdesign-nadia-piet"
      }
    });

    expect(status).toBe(200);
    expect(data.oembed.nft).toMatchObject({
      chain: "base",
      collectionName: "UFO",
      contractAddress: "0x7dcc6d7468362e6c20f7170abe9a949cf1e256f7",
      creatorAddress: "0x92f551665c69586fd5f30e6efdb78ac882b22d17",
      description:
        "Collect this episode to support UFO and secure your spot on the leaderboard!",
      endTime: null,
      mediaUrl:
        "https://gateway.irys.xyz/NzjoFlhIvLqnQEkxMD_NZeQNCuvWL6L_p_gaPHg9Pxc",
      mintCount: "10176",
      mintStatus: null,
      mintUrl:
        "https://pods.media/ufo/interpreting-technology-with-aixdesign-nadia-piet",
      schema: "erc1155",
      sourceUrl:
        "https://pods.media/ufo/interpreting-technology-with-aixdesign-nadia-piet"
    });
  });
});
