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
  utm_source Nullable(String),
  utm_medium Nullable(String),
  utm_campaign Nullable(String),
  utm_term Nullable(String),
  utm_content Nullable(String),
  created DateTime DEFAULT	now()
) ENGINE = MergeTree
ORDER BY created;
```
