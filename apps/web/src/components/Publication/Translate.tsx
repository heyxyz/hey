import Markup from "@components/Shared/Markup";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import getPublicationData from "@hey/helpers/getPublicationData";
import type { MirrorablePublication } from "@hey/lens";
import { useFlag } from "@unleash/proxy-client-react";
import axios from "axios";
import { francAll } from "franc";
import { type FC, useState } from "react";
import toast from "react-hot-toast";

interface TranslateProps {
  publication: MirrorablePublication;
}

const Translate: FC<TranslateProps> = ({ publication }) => {
  const enabled = useFlag("translation");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!enabled) {
    return null;
  }

  const fetchTranslation = async () => {
    const response = await axios.post(
      `${HEY_API_URL}/ai/translate`,
      { id: publication.id },
      { headers: getAuthApiHeaders() }
    );

    return response.data.result;
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

  const filteredContent =
    getPublicationData(publication.metadata)?.content || "";
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
        {isLoading ? "Translating..." : "Translate publication"}
      </button>
      <Markup className="markup linkify full-page-publication-markup mt-3 break-words">
        {translation}
      </Markup>
    </div>
  );
};

export default Translate;
