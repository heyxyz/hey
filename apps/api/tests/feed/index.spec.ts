import { AlgorithmProvider } from '@hey/data/enums';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('feed/index', () => {
  test('should return most viewed ids from hey', async () => {
    const response = await axios.get(`${TEST_URL}/feed`, {
      params: { provider: AlgorithmProvider.HEY, strategy: 'mostviewed' }
    });

    expect(response.data.ids).toHaveLength(50);
  });

  test('should return most interacted ids from hey', async () => {
    const response = await axios.get(`${TEST_URL}/feed`, {
      params: { provider: AlgorithmProvider.HEY, strategy: 'mostinteracted' }
    });

    expect(response.data.ids).toHaveLength(50);
  });

  test('should return recommended ids from k3l', async () => {
    const response = await axios.get(`${TEST_URL}/feed`, {
      params: { provider: AlgorithmProvider.K3L, strategy: 'recommended' }
    });

    expect(response.data.ids).toHaveLength(50);
  });

  test('should return popular ids from k3l', async () => {
    const response = await axios.get(`${TEST_URL}/feed`, {
      params: { provider: AlgorithmProvider.K3L, strategy: 'popular' }
    });

    expect(response.data.ids).toHaveLength(50);
  });

  test('should return recent ids from k3l', async () => {
    const response = await axios.get(`${TEST_URL}/feed`, {
      params: { provider: AlgorithmProvider.K3L, strategy: 'recent' }
    });

    expect(response.data.ids).toHaveLength(50);
  });

  test('should return crowdsourced ids from k3l', async () => {
    const response = await axios.get(`${TEST_URL}/feed`, {
      params: { provider: AlgorithmProvider.K3L, strategy: 'crowdsourced' }
    });

    expect(response.data.ids).toHaveLength(50);
  });
});
