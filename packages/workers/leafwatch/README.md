# Leafwatch worker

## Clickhouse Schema

```sql
CREATE TABLE events (
  id UUID DEFAULT generateUUIDv4(),
  actor Nullable(String),
  name String,
  properties Nullable(String),
  fingerprint Nullable(String),
  referrer Nullable(String),
  url Nullable(String),
  platform String,
  browser Nullable(String),
  browser_version Nullable(String),
  os Nullable(String),
  city Nullable(String),
  region Nullable(String),
  country LowCardinality(String),
  created DateTime DEFAULT	now()
) ENGINE = MergeTree
ORDER BY created;
```
