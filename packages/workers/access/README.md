# Access worker

## Tables

### Rights

```sql
CREATE TABLE rights (
  id String,
  is_staff Boolean DEFAULT 0,
  is_gardener Boolean DEFAULT 0,
  is_trusted_member Boolean DEFAULT 0,
  created DateTime DEFAULT now()
) ENGINE = MergeTree
ORDER BY created;
```
