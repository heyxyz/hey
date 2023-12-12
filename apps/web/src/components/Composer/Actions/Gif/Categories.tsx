import type { Category } from '@hey/types/giphy';
import type { FC } from 'react';

import { GIPHY_KEY } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface CategoriesProps {
  setSearchText: (searchText: string) => void;
}

const Categories: FC<CategoriesProps> = ({ setSearchText }) => {
  const fetchGiphyCategories = async () => {
    try {
      const response = await axios.get(
        'https://api.giphy.com/v1/gifs/categories',
        { params: { api_key: GIPHY_KEY } }
      );

      return response.data.data;
    } catch {
      return [];
    }
  };

  const { data: categories } = useQuery({
    queryFn: fetchGiphyCategories,
    queryKey: ['fetchGiphyCategories']
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
          <div className="absolute bottom-0 right-0 w-full bg-gradient-to-b from-transparent to-gray-800 px-2 py-1 text-right text-lg font-bold text-white">
            <span className="capitalize">{category.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Categories;
