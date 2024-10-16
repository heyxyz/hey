import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { HEY_API_URL } from "@hey/data/constants";
import axios from "axios";
import { type FC, useState } from "react";
import toast from "react-hot-toast";

interface TranslateProps {
  id: string;
}

const Translate: FC<TranslateProps> = ({ id }) => {
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchTranslation = async () => {
    const response = await axios.post(
      `${HEY_API_URL}/ai/translate`,
      { id },
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

  return (
    <div>
      <button
        onClick={handleFetchTranslation}
        disabled={isLoading}
        type="button"
      >
        Fetch Translation
      </button>
      <div>
        <h3>Translated Text:</h3>
        <pre>{translation}</pre>
      </div>
    </div>
  );
};

export default Translate;
