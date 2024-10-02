import { describe, expect, test, vi } from "vitest";
import generateIframe from "./generateIframe";

vi.mock("@hey/data/og", () => ({
  ALLOWED_HTML_HOSTS: [
    "youtube.com",
    "youtu.be",
    "tape.xyz",
    "twitch.tv",
    "kick.com",
    "open.spotify.com",
    "soundcloud.com",
    "oohlala.xyz"
  ]
}));

describe("generateIframe", () => {
  const universalSize = `width="100%" height="415"`;

  test("should generate iframe for a YouTube URL", () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const embedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    const result = generateIframe(embedUrl, url);

    expect(result).toBe(
      `<iframe src="${embedUrl}" ${universalSize} allow="accelerometer; encrypted-media" allowfullscreen></iframe>`
    );
  });

  test("should generate iframe for a short YouTube URL", () => {
    const url = "https://youtu.be/dQw4w9WgXcQ";
    const embedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    const result = generateIframe(embedUrl, url);

    expect(result).toBe(
      `<iframe src="${embedUrl}" ${universalSize} allow="accelerometer; encrypted-media" allowfullscreen></iframe>`
    );
  });

  test("should generate iframe for a Twitch video URL", () => {
    const url = "https://www.twitch.tv/videos/123456789";
    const embedUrl = "https://www.twitch.tv/videos/123456789";
    const result = generateIframe(embedUrl, url);

    expect(result).toBe(
      `<iframe src="${embedUrl.replace(
        "&player=facebook&autoplay=true&parent=meta.tag",
        "&player=hey&autoplay=false&parent=hey.xyz"
      )}" ${universalSize} allowfullscreen></iframe>`
    );
  });

  test("should generate iframe for a Spotify track URL", () => {
    const url = "https://open.spotify.com/track/abc123";
    const embedUrl = "https://open.spotify.com/track/abc123";
    const result = generateIframe(embedUrl, url);

    expect(result).toBe(
      `<iframe src="${embedUrl.replace(
        "/track",
        "/embed/track"
      )}" style="max-width: 100%;" width="100%" height="155" allow="encrypted-media"></iframe>`
    );
  });

  test("should generate iframe for a Spotify playlist URL", () => {
    const url = "https://open.spotify.com/playlist/def456";
    const embedUrl = "https://open.spotify.com/playlist/def456";
    const result = generateIframe(embedUrl, url);

    expect(result).toBe(
      `<iframe src="${embedUrl.replace(
        "/playlist",
        "/embed/playlist"
      )}" style="max-width: 100%;" width="100%" height="380" allow="encrypted-media"></iframe>`
    );
  });

  test("should return null for unsupported hosts", () => {
    const url = "https://unsupported.com/video/12345";
    const embedUrl = "https://unsupported.com/video/12345";
    const result = generateIframe(embedUrl, url);

    expect(result).toBeNull();
  });

  test("should return null if no embed URL is provided", () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const result = generateIframe(null, url);

    expect(result).toBeNull();
  });

  test("should generate iframe for a SoundCloud URL", () => {
    const url = "https://soundcloud.com/artist/track";
    const embedUrl = "https://soundcloud.com/artist/track";
    const result = generateIframe(embedUrl, url);

    expect(result).toBe(`<iframe src="${embedUrl}" ${universalSize}></iframe>`);
  });

  test("should generate iframe for an Oohlala URL", () => {
    const url = "https://oohlala.xyz/playlist/123456789abcdef";
    const embedUrl = "https://oohlala.xyz/playlist/123456789abcdef";
    const result = generateIframe(embedUrl, url);

    expect(result).toBe(`<iframe src="${embedUrl}" ${universalSize}></iframe>`);
  });

  test("should generate iframe for a Kick URL", () => {
    const url = "https://kick.com/streamer";
    const embedUrl = "https://kick.com/streamer";
    const result = generateIframe(embedUrl, url);

    expect(result).toBe(
      `<iframe src="${embedUrl.replace(
        "kick.com",
        "player.kick.com"
      )}" ${universalSize} allowfullscreen></iframe>`
    );
  });
});
