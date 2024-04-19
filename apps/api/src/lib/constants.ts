// DB URLs
export const CLICKHOUSE_URL = 'http://clickhouse.hey.xyz:8123';

// DB Feature IDs
export const STAFF_FEATURE_ID = 'eea3b2d2-a60c-4e41-8130-1cb34cc37810';
export const STAFF_MODE_FEATURE_ID = '0e588583-b347-4752-9e1e-0ad4128348e8';
export const GARDENER_FEATURE_ID = '0a441129-182a-4a3f-83cf-a13c5ad8282b';
export const GARDENER_MODE_FEATURE_ID = '9f66a465-e1d7-4123-b329-ddd14fd85510';
export const VERIFIED_FEATURE_ID = 'a0d6d247-50ef-419f-a045-54fa96054922';
export const STAFF_PICK_FEATURE_ID = '73d2f48d-0291-4a36-adc2-9737057ad2b7';
export const SUSPENDED_FEATURE_ID = '8ed8b26a-279d-4111-9d39-a40164b273a0';

// Cache
// Cache for 1 second, stale for 30 days
export const SWR_CACHE_AGE_1_SEC_30_DAYS =
  'public, s-maxage=1, stale-while-revalidate=2592000';
// Cache for 10 seconds, stale for 30 days
export const SWR_CACHE_AGE_10_SECS_30_DAYS =
  'public, s-maxage=10, stale-while-revalidate=2592000';
// Cache for 10 minutes, stale for 30 days
export const SWR_CACHE_AGE_10_MINS_30_DAYS =
  'public, s-maxage=600, stale-while-revalidate=2592000';
// Cache for 30 days
export const CACHE_AGE_30_DAYS = 'public, s-maxage=2592000';
// Cache indefinitely
export const CACHE_AGE_INDEFINITE = 'public, max-age=31536000, immutable';
// Cache indefinitely on Disk
export const CACHE_AGE_INDEFINITE_ON_DISK =
  'public, s-maxage=31536000, max-age=31536000, must-revalidate';

// Tests
export const TEST_URL = 'http://127.0.0.1:4784';
export const SITEMAP_BATCH_SIZE = 50000;
