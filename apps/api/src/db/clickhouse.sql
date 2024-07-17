-- Events
CREATE TABLE events (
  id UUID DEFAULT generateUUIDv4(),
  actor LowCardinality(Nullable(String)),
  fingerprint LowCardinality(Nullable(String)),
  name LowCardinality(String),
  properties Nullable(String),
  referrer Nullable(String),
  url Nullable(String),
  browser LowCardinality(Nullable(String)),
  ip Nullable(IPv6),
  city LowCardinality(Nullable(String)),
  country LowCardinality(Nullable(String)),
  created DateTime DEFAULT now()
) ENGINE = MergeTree
PARTITION BY toYYYYMM(created)
ORDER BY (created, id)
TTL created + INTERVAL 1 YEAR
SETTINGS index_granularity = 8192;

-- Impressions
CREATE TABLE impressions (
  id UUID,
  publication String,
  viewed DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY viewed;
