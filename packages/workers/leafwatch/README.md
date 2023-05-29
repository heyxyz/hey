# Leafwatch worker

## Database

### Drop table if exists

```sql
DROP TABLE IF EXISTS events CASCADE;
```

### Create table

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  time TIMESTAMP DEFAULT NOW(),
  user_id VARCHAR(255),
  fingerprint VARCHAR(255),
  ip VARCHAR(255),
  country VARCHAR(255),
  user_agent VARCHAR(255),
  referrer VARCHAR(255),
  properties JSONB
);
```

### Create index

```sql
CREATE INDEX idx_events_name ON events (name);
```
