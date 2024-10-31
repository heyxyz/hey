import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { SETTINGS } from "@hey/data/tracking";
import formatDate from "@hey/helpers/datetime/formatDate";
import { Card, CardHeader, H5 } from "@hey/ui";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

const MutedWords: FC = () => {
  const { mutedWords, setMutedWords } = usePreferencesStore();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [muting, setMuting] = useState(false);

  const updateMutedWords = async (word: string, expiresAt: Date | null) => {
    try {
      setMuting(true);
      const { data } = await axios.post(
        `${HEY_API_URL}/preferences/mute`,
        { word, expiresAt },
        { headers: getAuthApiHeaders() }
      );

      setMutedWords([...mutedWords, { word, expiresAt, id: data.result.id }]);
      toast.success("Muted word updated");
      Leafwatch.track(SETTINGS.PREFERENCES.MUTE_WORD);
    } catch (error) {
      errorToast(error);
    } finally {
      setMuting(false);
    }
  };

  const unmuteWord = async (id: string) => {
    try {
      setDeleting(id);
      const { data } = await axios.post(
        `${HEY_API_URL}/preferences/unmute`,
        { id },
        { headers: getAuthApiHeaders() }
      );

      setMutedWords(
        mutedWords.filter((mutedWord) => mutedWord.id !== data.result.id)
      );
      toast.success("Muted word removed");
      Leafwatch.track(SETTINGS.PREFERENCES.UNMUTE_WORD);
    } catch (error) {
      errorToast(error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Card>
      <CardHeader
        body="Mute words that you don't want to see in your notifications."
        title="Muted Words"
      />
      <div className="m-5">
        <H5>Your muted words</H5>
        <div className="mt-3 space-y-4">
          {mutedWords.length ? (
            mutedWords.map((mutedWord) => (
              <Card
                key={mutedWord.word}
                className="flex items-center justify-between p-3"
              >
                <div className="space-y-1">
                  <b>{mutedWord.word}</b>
                  {mutedWord.expiresAt ? (
                    <div className="text-gray-500 text-sm">
                      Expires at {formatDate(mutedWord.expiresAt)}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => unmuteWord(mutedWord.id)}
                  disabled={deleting === mutedWord.id}
                >
                  <XCircleIcon className="size-5 text-red-500" />
                </button>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-100 p-3 text-center italic">
              You haven't muted any words yets
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MutedWords;
