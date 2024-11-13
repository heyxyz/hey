import Markup from "@components/Shared/Markup";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import getPostData from "@hey/helpers/getPostData";
import type { MirrorablePublication } from "@hey/lens";
import { useFlag } from "@unleash/proxy-client-react";
import axios from "axios";
import { francAll } from "franc";
import { type FC, useState } from "react";
import toast from "react-hot-toast";

interface TranslateProps {
  post: MirrorablePublication;
}

const Translate: FC<TranslateProps> = ({ post }) => {
  const enabled = useFlag("translation");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!enabled) {
    return null;
  }

  const fetchTranslation = async () => {
    const { data } = await axios.post(
      `${HEY_API_URL}/ai/translate`,
      { id: post.id },
      { headers: getAuthApiHeaders() }
    );

    return data.result;
  };

  const handleFetchTranslation = async () => {
    setTranslation("");
    setIsLoading(true);
    try {
      const result = await fetchTranslation();
      setTranslation(result.translated);
    } catch {
      toast.error("Error fetching translation");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContent = getPostData(post.metadata)?.content || "";

  if (filteredContent?.length < 5) {
    return null;
  }

  const isEnglish =
    francAll(filteredContent, { only: ["eng"] })?.[0]?.[0] === "eng";

  if (isEnglish) {
    return null;
  }

  return (
    <div>
      <button
        className="mt-2 text-sm underline"
        onClick={handleFetchTranslation}
        disabled={isLoading}
        type="button"
      >
        {isLoading ? "Translating..." : "Translate post"}
      </button>
      <Markup className="markup linkify full-page-post-markup mt-3 break-words">
        {translation}
      </Markup>
    </div>
  );
};

export default Translate;
