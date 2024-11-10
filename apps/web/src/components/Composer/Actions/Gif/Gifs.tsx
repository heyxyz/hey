import { GIPHY_KEY } from "@hey/data/constants";
import type { IGif } from "@hey/types/giphy";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Dispatch, FC, SetStateAction } from "react";

const GET_GIFS_QUERY_KEY = "getGifs";

interface GifsProps {
  debouncedGifInput: string;
  setGifAttachment: (gif: IGif) => void;
  setSearchText: Dispatch<SetStateAction<string>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const Gifs: FC<GifsProps> = ({
  debouncedGifInput,
  setGifAttachment,
  setSearchText,
  setShowModal
}) => {
  const handleSelectGif = (item: IGif) => {
    setGifAttachment(item);
    setSearchText("");
    setShowModal(false);
  };

  const getGifs = async (input: string): Promise<IGif[]> => {
    try {
      const { data } = await axios.get("https://api.giphy.com/v1/gifs/search", {
        params: { api_key: GIPHY_KEY, limit: 48, q: input }
      });

      return data.data;
    } catch {
      return [];
    }
  };

  const { data: gifs, isFetching } = useQuery({
    enabled: Boolean(debouncedGifInput),
    queryFn: () => getGifs(debouncedGifInput),
    queryKey: [GET_GIFS_QUERY_KEY, debouncedGifInput]
  });

  if (isFetching) {
    return (
      <div className="grid w-full grid-cols-3 gap-1 overflow-y-auto">
        {Array.from(Array(12).keys()).map((key) => (
          <div
            className="shimmer h-32 w-full cursor-pointer object-cover"
            key={key}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-3 gap-1 overflow-y-auto">
      {gifs?.map((gif: IGif) => (
        <button
          className="relative flex outline-none"
          key={gif.id}
          onClick={() => handleSelectGif(gif)}
          type="button"
        >
          <img
            alt={gif.slug}
            className="h-32 w-full cursor-pointer object-cover"
            draggable={false}
            height={128}
            src={gif?.images?.original?.url}
          />
        </button>
      ))}
    </div>
  );
};

export default Gifs;
