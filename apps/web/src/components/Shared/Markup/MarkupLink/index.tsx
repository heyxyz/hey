import type { MarkupLinkProps } from "@hey/types/misc";
import Cashtag from "./Cashtag";
import ExternalLink from "./ExternalLink";
import Group from "./Group";
import Hashtag from "./Hashtag";
import Mention from "./Mention";

const MarkupLink = ({ mentions, title }: MarkupLinkProps) => {
  if (!title) {
    return null;
  }

  if (title.startsWith("@")) {
    if (title.startsWith("@club/")) {
      return <Group title={title} />;
    }

    return <Mention mentions={mentions} title={title} />;
  }

  if (title.startsWith("#")) {
    return <Hashtag title={title} />;
  }

  if (title.startsWith("$")) {
    return <Cashtag title={title} />;
  }

  return <ExternalLink title={title} />;
};

export default MarkupLink;
