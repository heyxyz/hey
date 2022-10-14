import { CheckBox } from '@components/UI/CheckBox';
import type { ChangeEvent } from 'react';
import React from 'react';
import { useTimelinePersistStore } from 'src/store/timeline';

const FeedEventFilters = () => {
  const feedEventFilters = useTimelinePersistStore((state) => state.feedEventFilters);
  const setFeedEventFilters = useTimelinePersistStore((state) => state.setFeedEventFilters);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFeedEventFilters({ ...feedEventFilters, [e.target.name]: e.target.checked });
  };

  return (
    <div className="mt-2 flex justify-end">
      <div className="flex items-center space-x-4">
        <CheckBox onChange={handleChange} checked={feedEventFilters.posts} name="posts" label="Posts" />
        <CheckBox onChange={handleChange} checked={feedEventFilters.mirrors} name="mirrors" label="Mirrors" />
        <CheckBox
          onChange={handleChange}
          checked={feedEventFilters.collects}
          name="collects"
          label="Collects"
        />
        <CheckBox
          onChange={handleChange}
          checked={feedEventFilters.reactions}
          name="reactions"
          label="Reactions"
        />
      </div>
    </div>
  );
};

export default FeedEventFilters;
