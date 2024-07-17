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
  publication String,
  viewed DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY viewed;
