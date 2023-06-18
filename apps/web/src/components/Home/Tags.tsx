import Beta from '@components/Shared/Badges/Beta';
import { TagIcon } from '@heroicons/react/outline';
import { Card } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import { useExploreStore } from 'src/store/explore';

const Title = () => {
  return (
    <div className="mb-2 flex items-center gap-2 px-5 sm:px-0">
      <TagIcon className="h-4 w-4 text-pink-500" />
      <div>
        <Trans>Tags</Trans>
      </div>
      <Beta />
    </div>
  );
};

const Tags: FC = () => {
  const selectedTag = useExploreStore((state) => state.selectedTag);
  const setSelectedTag = useExploreStore((state) => state.setSelectedTag);

  const tags = [
    { tag: 'arts_&_culture', name: 'Arts & Culture' },
    { tag: 'business_&_entrepreneurs', name: 'Business & Entrepreneurs' },
    { tag: 'celebrity_&_pop_culture', name: 'Celebrity & Pop Culture' },
    { tag: 'diaries_&_daily_life', name: 'Diaries & Daily Life' },
    { tag: 'family', name: 'Family' },
    { tag: 'fashion_&_style', name: 'Fashion & Style' },
    { tag: 'filmtv&_video', name: 'Film & Video' },
    { tag: 'fitness_&_health', name: 'Fitness & Health' },
    { tag: 'food_&_dining', name: 'Food & Dining' },
    { tag: 'gaming', name: 'Gaming' },
    { tag: 'learning_&_educational', name: 'Learning & Educational' },
    { tag: 'music', name: 'Music' },
    { tag: 'news_&_social_concern', name: 'News & Social Concern' },
    { tag: 'other_hobbies', name: 'Other Hobbies' },
    { tag: 'relationships', name: 'Relationships' },
    { tag: 'science_&_technology', name: 'Science & Technology' },
    { tag: 'sports', name: 'Sports' },
    { tag: 'travel_&_adventure', name: 'Travel & Adventure' },
    { tag: 'youth_&_student_life', name: 'Youth & Student Life' }
  ];

  return (
    <>
      <Title />
      <Card as="aside" className="mb-4 space-y-4 p-5">
        {tags.map((tag) => (
          <div key={tag.tag}>
            <button
              onClick={() => {
                // Leafwatch.track(MISCELLANEOUS.OPEN_TRENDING_TAG, {
                //   trending_tag: tag.tag
                // });
                setSelectedTag(tag.tag);
              }}
            >
              <div
                className={clsx(
                  selectedTag === tag.tag ? 'text-pink-500' : 'text-gray-500',
                  'font-bold'
                )}
              >
                {tag.name}
              </div>
            </button>
          </div>
        ))}
      </Card>
    </>
  );
};

export default Tags;
