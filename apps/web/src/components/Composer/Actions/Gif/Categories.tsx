import { GIPHY_KEY } from "@hey/data/constants";
import type { Category } from "@hey/types/giphy";
import { H5 } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Dispatch, FC, SetStateAction } from "react";

const GET_GIPHY_CATEGORIES_QUERY_KEY = "getGiphyCategories";

interface CategoriesProps {
  setSearchText: Dispatch<SetStateAction<string>>;
}

const Categories: FC<CategoriesProps> = ({ setSearchText }) => {
  const getGiphyCategories = async () => {
    try {
      const { data } = await axios.get(
        "https://api.giphy.com/v1/gifs/categories",
        { params: { api_key: GIPHY_KEY } }
      );

      return data.data;
    } catch {
      return [];
    }
  };

  const { data: categories } = useQuery({
    queryFn: getGiphyCategories,
    queryKey: [GET_GIPHY_CATEGORIES_QUERY_KEY]
  });

  return (
    <div className="grid w-full grid-cols-2 gap-1 overflow-y-auto">
      {categories?.map((category: Category) => (
        <button
          className="relative flex outline-none"
          key={category.name_encoded}
          onClick={() => setSearchText(category.name)}
          type="button"
        >
          <img
            alt={category.name_encoded}
            className="h-32 w-full cursor-pointer object-cover"
            draggable={false}
            height={128}
            src={category.gif?.images?.original_still?.url}
          />
          <div className="absolute right-0 bottom-0 w-full bg-gradient-to-b from-transparent to-gray-800 px-2 py-1 text-right">
            <H5 className="text-white capitalize">{category.name}</H5>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Categories;
