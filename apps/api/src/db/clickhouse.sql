-- Events
CREATE TABLE events (
  id UUID DEFAULT generateUUIDv4(),
  actor Nullable(String),
  fingerprint Nullable(String),
  name String,
  properties Nullable(String),
  referrer Nullable(String),
  url Nullable(String),
  browser Nullable(String),
  os Nullable(String),
  ip Nullable(String),
  city Nullable(String),
  country LowCardinality(String),
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
  country LowCardinality(String),
  viewed_at DateTime64(3, 'UTC') DEFAULT now64(3)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(viewed_at)
ORDER BY (viewer_id, publication_id, viewed_at)
SETTINGS index_granularity = 8192;
