import { HEY_API_URL } from "@hey/data/constants";
import { ALLOWED_HTML_HOSTS } from "@hey/data/og";
import getFavicon from "@hey/helpers/getFavicon";
import type { OG } from "@hey/types/misc";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useEffect } from "react";
import Embed from "./Embed";
import EmptyOembed from "./EmptyOembed";
import Player from "./Player";

const GET_OEMBED_QUERY_KEY = "getOembed";

interface OembedProps {
  onLoad?: (og: OG) => void;
  url: string;
}

const Oembed: FC<OembedProps> = ({ onLoad, url }) => {
  const { data, error, isLoading } = useQuery({
    enabled: Boolean(url),
    queryFn: async () => {
      const { data } = await axios.get(`${HEY_API_URL}/oembed`, {
        params: { url }
      });
      return data.oembed;
    },
    queryKey: [GET_OEMBED_QUERY_KEY, url],
    refetchOnMount: false
  });

  useEffect(() => {
    if (onLoad) {
      onLoad(data as OG);
    }
  }, [data]);

  if (isLoading || error || !data) {
    if (error) {
      return null;
    }

    const hostname = new URL(url).hostname.replace("www.", "");

    if (ALLOWED_HTML_HOSTS.includes(hostname)) {
      return <div className="shimmer mt-4 h-[415px] w-full rounded-xl" />;
    }

    return <EmptyOembed url={url} />;
  }

  const og: OG = {
    description: data?.description,
    favicon: getFavicon(data.url),
    html: data?.html,
    image: data?.image,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (!og.title && !og.html) {
    return null;
  }

  if (og.html) {
    return <Player og={og} />;
  }

  return <Embed og={og} />;
};

export default Oembed;
