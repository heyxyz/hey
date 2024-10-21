-- Events
CREATE TABLE events (
  actor LowCardinality(Nullable(String)),
  fingerprint LowCardinality(Nullable(String)),
  name LowCardinality(String),
  properties Nullable(String),
  referrer LowCardinality(Nullable(String)),
  url LowCardinality(Nullable(String)),
  browser LowCardinality(Nullable(String)),
  ip Nullable(IPv6),
  city LowCardinality(Nullable(String)),
  country LowCardinality(Nullable(String)),
  created DateTime DEFAULT now()
) ENGINE = MergeTree
ORDER BY created
SETTINGS index_granularity = 16384;

-- Impressions
CREATE TABLE impressions (
  publication LowCardinality(String),
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
