# Leafwatch worker

User telemetry tracking worker collecting crucial data points from the frontend for analytics and better understanding of user behavior.

## Table structure

```json
[
  { "name": "name", "type": "STRING", "mode": "REQUIRED" },
  { "name": "time", "type": "TIMESTAMP", "mode": "REQUIRED" },
  { "name": "user_id", "type": "STRING", "mode": "NULLABLE" },
  { "name": "fingerprint", "type": "STRING", "mode": "NULLABLE" },
  { "name": "country", "type": "STRING", "mode": "NULLABLE" },
  { "name": "referrer", "type": "STRING", "mode": "NULLABLE" },
  { "name": "platform", "type": "STRING", "mode": "NULLABLE" },
  { "name": "properties", "type": "JSON", "mode": "NULLABLE" }
]
```
