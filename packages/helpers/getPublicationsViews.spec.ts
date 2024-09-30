import { HEY_API_URL } from "@hey/data/constants";
import axios from "axios";
import { beforeEach, describe, expect, test, vi } from "vitest";
import getPublicationsViews from "./getPublicationsViews";

vi.mock("axios");

describe("getPublicationsViews", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should return views when API request is successful on mainnet", async () => {
    (axios.post as any).mockResolvedValue({
      data: { views: { "0x0d-0x01": 100, "0x0d-0x02": 200 } }
    });

    const ids = ["0x0d-0x01", "0x0d-0x02"];
    const result = await getPublicationsViews(ids);

    expect(axios.post).toHaveBeenCalledWith(
      `${HEY_API_URL}/stats/publication/views`,
      { ids }
    );
    expect(result).toEqual({ "0x0d-0x01": 100, "0x0d-0x02": 200 });
  });

  test("should return an empty array when API request fails", async () => {
    (axios.post as any).mockRejectedValue(new Error("API Error"));

    const ids = ["0x0d-0x01"];
    const result = await getPublicationsViews(ids);

    expect(axios.post).toHaveBeenCalledWith(
      `${HEY_API_URL}/stats/publication/views`,
      { ids }
    );
    expect(result).toEqual([]);
  });

  test("should return an empty array when no ids are provided", async () => {
    const ids: string[] = [];
    const result = await getPublicationsViews(ids);

    expect(axios.post).toHaveBeenCalledWith(
      `${HEY_API_URL}/stats/publication/views`,
      { ids }
    );
    expect(result).toEqual([]);
  });
});
