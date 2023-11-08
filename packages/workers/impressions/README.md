# Impressions worker

## Clickhouse Schema

```sql
CREATE TABLE impressions (
  id UUID,
  viewer_id String,
  publication_id String,
  viewed_at DateTime64(3, 'UTC') DEFAULT now64(3)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(viewed_at)
ORDER BY (viewer_id, publication_id, viewed_at)
SETTINGS index_granularity = 8192;
```
