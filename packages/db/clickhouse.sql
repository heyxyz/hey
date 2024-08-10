-- Events
CREATE TABLE events (
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
ORDER BY created
TTL created + INTERVAL 1 YEAR
SETTINGS index_granularity = 8192;

-- Impressions
CREATE TABLE impressions (
  publication String,
  viewed DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(viewed)
ORDER BY viewed
SETTINGS index_granularity = 8192;

-- Total views per publication materialized view
CREATE MATERIALIZED VIEW total_impressions_per_publication_mv
ENGINE = SummingMergeTree()
ORDER BY publication
AS
SELECT publication, count() AS count
FROM impressions
GROUP BY publication;
