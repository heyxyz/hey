# Leafwatch worker

## Clickhouse Schema

```sql
CREATE TABLE events (
  id UUID DEFAULT generateUUIDv4(),
  actor Nullable(String),
  name String,
  properties Nullable(String),
  fingerprint Nullable(String),
  country LowCardinality(String),
  referrer Nullable(String),
  user_agent Nullable(String),
  platform String,
  created Datetime DEFAULT now()
) ENGINE = MergeTree
ORDER BY created;
```
