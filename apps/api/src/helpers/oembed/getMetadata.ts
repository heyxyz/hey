import getFavicon from "@hey/helpers/getFavicon";
import type { OG } from "@hey/types/misc";
import axios from "axios";
import { parseHTML } from "linkedom";
import { HEY_USER_AGENT } from "../constants";
import generateIframe from "./meta/generateIframe";
import getDescription from "./meta/getDescription";
import getEmbedUrl from "./meta/getEmbedUrl";
import getImage from "./meta/getImage";
import getSite from "./meta/getSite";
import getTitle from "./meta/getTitle";

const getMetadata = async (url: string): Promise<null | OG> => {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": HEY_USER_AGENT }
    });

    const { document } = parseHTML(data);
    const image = getImage(document) as string;

    const metadata: OG = {
      description: getDescription(document),
      favicon: getFavicon(url),
      html: generateIframe(getEmbedUrl(document), url),
      image: image,
      lastIndexedAt: new Date().toISOString(),
      site: getSite(document),
      title: getTitle(document),
      url
    };

    return metadata;
  } catch {
    return null;
  }
};

export default getMetadata;
