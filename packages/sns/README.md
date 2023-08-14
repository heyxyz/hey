# SNS service

## Clickhouse Schema

```sql
CREATE TABLE firehose (
  id Nullable(String),
  profileId Nullable(String),
  contentURI Nullable(String),
  metadata Nullable(String),
  collectModule Nullable(String),
  collectModuleReturnData Nullable(String),
  referenceModule Nullable(String),
  referenceModuleReturnData Nullable(String),
  likesCount Nullable(UInt32) DEFAULT 0,
  commentsCount Nullable(UInt32) DEFAULT 0,
  mirrorsCount Nullable(UInt32) DEFAULT 0,
  collectsCount Nullable(UInt32) DEFAULT 0,
  timestamp DateTime
) ENGINE = MergeTree
ORDER BY timestamp;
```
