import { HEY_API_URL } from "@hey/data/constants";
import { ALLOWED_HTML_HOSTS } from "@hey/data/og";
import getFavicon from "@hey/helpers/getFavicon";
import type { AnyPublication } from "@hey/lens";
import type { OG } from "@hey/types/misc";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useEffect, useState } from "react";
import Embed from "./Embed";
import EmptyOembed from "./EmptyOembed";
import Frame from "./Frames";
import Player from "./Player";

const GET_OEMBED_QUERY_KEY = "getOembed";

interface OembedProps {
  onLoad?: (og: OG) => void;
  post?: AnyPublication;
  url: string;
}

const Oembed: FC<OembedProps> = ({ onLoad, post, url }) => {
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

  const [currentPost, setCurrentPost] = useState<AnyPublication>();

  useEffect(() => {
    if (post) {
      setCurrentPost(post);
    }
  }, [post]);

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
    frame: data?.frame,
    html: data?.html,
    image: data?.image,
    nft: data?.nft,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (!og.title && !og.html && !og.frame) {
    return null;
  }

  if (og.html) {
    return <Player og={og} />;
  }

  if (og.frame) {
    return <Frame frame={og.frame} postId={currentPost?.id} />;
  }

  return <Embed og={og} postId={currentPost?.id} />;
};

export default Oembed;
