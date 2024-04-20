-- Events
CREATE TABLE events (
  id UUID DEFAULT generateUUIDv4(),
  actor Nullable(String),
  wallet Nullable(String),
  fingerprint Nullable(String),
  name String,
  properties Nullable(String),
  referrer Nullable(String),
  url Nullable(String),
  platform String,
  browser Nullable(String),
  browser_version Nullable(String),
  os Nullable(String),
  ip Nullable(String),
  city Nullable(String),
  region Nullable(String),
  country LowCardinality(String),
  utm_source Nullable(String),
  utm_medium Nullable(String),
  utm_campaign Nullable(String),
  utm_term Nullable(String),
  utm_content Nullable(String),
  created DateTime DEFAULT now()
) ENGINE = MergeTree
ORDER BY created;

-- Impressions
CREATE TABLE impressions (
  id UUID,
  viewer_id String,
  publication_id String,
  ip Nullable(String),
  city Nullable(String),
  region Nullable(String),
  country LowCardinality(String),
  viewed_at DateTime64(3, 'UTC') DEFAULT now64(3)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(viewed_at)
ORDER BY (viewer_id, publication_id, viewed_at)
SETTINGS index_granularity = 8192;

-- Signups
CREATE TABLE signups (
  id UUID DEFAULT generateUUIDv4(),
  handle String,
  address String,
  email String,
  order_number String,
  hash String,
  created DateTime DEFAULT now()
) ENGINE = MergeTree
ORDER BY created;

-- Publications
CREATE TABLE publications (
  id String,
  block_timestamp String,
  block_number Float32,
  content String,
  content_vector String
) ENGINE = MergeTree
ORDER BY block_number;
