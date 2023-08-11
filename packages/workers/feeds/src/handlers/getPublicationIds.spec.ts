import { describe, expect, test } from 'vitest';

import { TEST_URL } from '../constants';

type Response = {
  ids: string[];
};

describe('getPublicationIds', () => {
  describe('k3l provider', () => {
    test('should return ids for k3l provider and recent strategy', async () => {
      const getRequest = await fetch(
        `${TEST_URL}/ids?provider=k3l&strategy=recent`
      );
      const response: Response = await getRequest.json();
      expect(response.ids.length).toBe(50);
    });

    test('should return ids for k3l provider and recommended strategy', async () => {
      const getRequest = await fetch(
        `${TEST_URL}/ids?provider=k3l&strategy=recommended`
      );
      const response: Response = await getRequest.json();
      expect(response.ids.length).toBe(50);
    });

    test('should return ids for k3l provider and popular strategy', async () => {
      const getRequest = await fetch(
        `${TEST_URL}/ids?provider=k3l&strategy=popular`
      );
      const response: Response = await getRequest.json();
      expect(response.ids.length).toBe(50);
    });

    test('should return ids for k3l provider and crowdsourced strategy', async () => {
      const getRequest = await fetch(
        `${TEST_URL}/ids?provider=k3l&strategy=crowdsourced`
      );
      const response: Response = await getRequest.json();
      expect(response.ids.length).toBe(50);
    });

    test('should return ids for k3l provider, following strategy and profile', async () => {
      const getRequest = await fetch(
        `${TEST_URL}/ids?provider=k3l&strategy=following&profile=yoginth.lens`
      );
      const response: Response = await getRequest.json();
      expect(response.ids.length).toBe(50);
    });
  });
});
