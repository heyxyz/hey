# Leafwatch worker

## Table structure

```json
[
  { "name": "name", "type": "STRING", "mode": "REQUIRED" },
  { "name": "time", "type": "TIMESTAMP", "mode": "REQUIRED" },
  { "name": "user_id", "type": "STRING", "mode": "NULLABLE" },
  { "name": "fingerprint", "type": "STRING", "mode": "NULLABLE" },
  { "name": "country", "type": "STRING", "mode": "NULLABLE" },
  { "name": "browser", "type": "STRING", "mode": "NULLABLE" },
  { "name": "os", "type": "STRING", "mode": "NULLABLE" },
  { "name": "referrer", "type": "STRING", "mode": "NULLABLE" },
  { "name": "properties", "type": "JSON", "mode": "NULLABLE" }
]
```
