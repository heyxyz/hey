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

CREATE TABLE moderation (
    id String,
    flagged Bool,
    harassment Bool,
    harassment_threatening Bool,
    sexual Bool,
    hate Bool,
    hate_threatening Bool,
    illicit Bool,
    illicit_violent Bool,
    self_harm_intent Bool,
    self_harm_instructions Bool,
    self_harm Bool,
    sexual_minors Bool,
    violence Bool,
    violence_graphic Bool,
    harassment_score Float32,
    harassment_threatening_score Float32,
    sexual_score Float32,
    hate_score Float32,
    hate_threatening_score Float32,
    illicit_score Float32,
    illicit_violent_score Float32,
    self_harm_intent_score Float32,
    self_harm_instructions_score Float32,
    self_harm_score Float32,
    sexual_minors_score Float32,
    violence_score Float32,
    violence_graphic_score Float32,
    created DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY created;
