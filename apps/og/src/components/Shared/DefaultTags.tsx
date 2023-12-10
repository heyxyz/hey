import type { FC } from 'react';

import { APP_NAME, DEFAULT_OG, DESCRIPTION } from '@hey/data/constants';
import { BASE_URL } from 'src/constants';

import Tags from './Tags';

const DefaultTags: FC = () => {
  return (
    <>
      <Tags
        description={DESCRIPTION}
        image={DEFAULT_OG}
        title={APP_NAME}
        url={BASE_URL}
      />
      <div>{APP_NAME}</div>
    </>
  );
};

export default DefaultTags;
