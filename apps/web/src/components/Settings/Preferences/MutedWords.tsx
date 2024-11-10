import errorToast from "@helpers/errorToast";
import { getAuthApiHeaders } from "@helpers/getAuthApiHeaders";
import { Leafwatch } from "@helpers/leafwatch";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { SETTINGS } from "@hey/data/tracking";
import formatDate from "@hey/helpers/datetime/formatDate";
import getTimeAddedNDay from "@hey/helpers/datetime/getTimeAddedNDay";
import { Button, Card, CardHeader, Checkbox, H5, Input } from "@hey/ui";
import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

const MutedWords: FC = () => {
  const { mutedWords, setMutedWords } = usePreferencesStore();
  const [word, setWord] = useState("");
  const [expiresIn, setExpiresIn] = useState<1 | 7 | 30 | -1>(-1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [muting, setMuting] = useState(false);

  const handleUpdateMutedWords = async () => {
    try {
      setMuting(true);
      const { data } = await axios.post(
        `${HEY_API_URL}/preferences/mute`,
        {
          word,
          expiresAt: expiresIn === -1 ? null : getTimeAddedNDay(expiresIn)
        },
        { headers: getAuthApiHeaders() }
      );

      setMutedWords([
        ...mutedWords,
        {
          word,
          expiresAt:
            expiresIn === -1 ? null : new Date(getTimeAddedNDay(expiresIn)),
          id: data.result.id
        }
      ]);
      setWord("");
      setExpiresIn(-1);
      toast.success("Muted word updated");
      Leafwatch.track(SETTINGS.PREFERENCES.MUTE_WORD);
    } catch (error) {
      errorToast(error);
    } finally {
      setMuting(false);
    }
  };

  const handleUnmuteWord = async (id: string) => {
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
        <div className="space-y-5">
          <Input
            disabled={muting}
            onChange={(e) => setWord(e.target.value)}
            value={word}
            placeholder="Enter a word to mute"
          />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <Checkbox
              checked={expiresIn === -1}
              label="Forever"
              name="forever"
              onChange={() => setExpiresIn(-1)}
            />
            <Checkbox
              checked={expiresIn === 1}
              label="24 hours"
              name="24hours"
              onChange={() => setExpiresIn(1)}
            />
            <Checkbox
              checked={expiresIn === 7}
              label="7 days"
              name="7days"
              onChange={() => setExpiresIn(7)}
            />
            <Checkbox
              checked={expiresIn === 30}
              label="30 days"
              name="30days"
              onChange={() => setExpiresIn(30)}
            />
          </div>
          <Button
            className="w-full"
            disabled={muting || !word}
            onClick={handleUpdateMutedWords}
            size="lg"
          >
            Mute word
          </Button>
        </div>
        <H5 className="mt-5">Your muted words</H5>
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
                  onClick={() => handleUnmuteWord(mutedWord.id)}
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
