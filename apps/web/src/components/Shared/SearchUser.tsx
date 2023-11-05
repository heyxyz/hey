import type { Profile, ProfileSearchRequest } from '@hey/lens';
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesLazyQuery
} from '@hey/lens';
import { Card, Input, Spinner } from '@hey/ui';
import { motion } from 'framer-motion';
import { type ChangeEvent, type FC, memo } from 'react';

import SmallUserProfile from './SmallUserProfile';

interface SearchUserProps {
  onProfileSelected: (profile: Profile) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  hideDropdown?: boolean;
  error?: boolean;
}

const SearchUser: FC<SearchUserProps> = ({
  onProfileSelected,
  onChange,
  value,
  placeholder = 'Search…',
  hideDropdown = false,
  error = false
}) => {
  const [searchUsers, { data, loading }] = useSearchProfilesLazyQuery();

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);

    const keyword = event.target.value;
    const request: ProfileSearchRequest = {
      where: { customFilters: [CustomFiltersType.Gardeners] },
      query: keyword,
      limit: LimitType.Ten
    };

    searchUsers({ variables: { request } });
  };

  const profiles = data?.searchProfiles.items as Profile[];

  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder={placeholder}
        onChange={handleSearch}
        value={value}
        error={error}
      />
      {!hideDropdown && value.length > 0 ? (
        <div className="absolute mt-2 flex w-[94%] max-w-md flex-col">
          <Card className="z-[2] max-h-[80vh] overflow-y-auto py-2">
            {loading ? (
              <div className="space-y-2 px-4 py-2 text-center text-sm font-bold">
                <Spinner size="sm" className="mx-auto" />
                <div>Searching users</div>
              </div>
            ) : (
              <>
                {profiles.slice(0, 7).map((profile) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={profile.id}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      if (onProfileSelected) {
                        onProfileSelected(profile);
                      }
                    }}
                  >
                    <SmallUserProfile profile={profile} />
                  </motion.div>
                ))}
                {profiles.length === 0 ? (
                  <div className="px-4 py-2">No matching users</div>
                ) : null}
              </>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default memo(SearchUser);
