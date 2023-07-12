import type { FC } from 'react';
import type { Category } from 'src/types/giphy';

interface CategoriesProps {
  categories: Category[];
  setSearchText: (searchText: string) => void;
}

const Categories: FC<CategoriesProps> = ({ categories, setSearchText }) => {
  return (
    <div className="flex h-[45vh] overflow-y-auto overflow-x-hidden">
      <div className="grid w-full grid-cols-2 gap-1">
        {categories?.map((category: Category) => (
          <button
            type="button"
            key={category.name_encoded}
            className="relative flex outline-none"
            onClick={() => setSearchText(category.name)}
          >
            <img
              className="h-32 w-full cursor-pointer object-cover"
              height={128}
              src={category.gif?.images?.original_still?.url}
              alt={category.name_encoded}
              draggable={false}
            />
            <div className="absolute bottom-0 right-0 w-full bg-gradient-to-b from-transparent to-gray-800 px-2 py-1 text-right text-lg font-bold text-white">
              <span className="capitalize">{category.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
