import type { PublicationViewCount } from '@hey/types/hey';

import { describe, expect, test } from 'vitest';

import getPublicationViewCountById from './getPublicationViewCountById';

describe('getPublicationViewCountById', () => {
  test('should return the view count for a given id', () => {
    const views: PublicationViewCount[] = [
      { id: '1', views: 10 },
      { id: '2', views: 5 },
      { id: '3', views: 15 }
    ];
    const id = '2';
    const result = getPublicationViewCountById(views, id);

    expect(result).toEqual(5);
  });

  test('should return 0 if the id is not found', () => {
    const views: PublicationViewCount[] = [
      { id: '1', views: 10 },
      { id: '2', views: 5 },
      { id: '3', views: 15 }
    ];
    const id = '4';
    const result = getPublicationViewCountById(views, id);

    expect(result).toEqual(0);
  });
});
