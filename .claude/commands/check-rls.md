Verify that Row Level Security (RLS) is correctly configured on all Distill database tables.

## Steps:

### 1. Check RLS is enabled on all tables
Run this SQL against the Supabase database:
```sql
SELECT
  tablename,
  rowsecurity,
  CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```
Expected tables: `profiles`, `sessions`, `reflections`, `reflection_layers`, `resurfacing_queue`, `processed_webhook_events`
Every table must show `rowsecurity = true`.

### 2. Check RLS policies exist on each table
```sql
SELECT
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```
Every table that stores user data must have a policy using `auth.uid() = user_id`.

### 3. Check for any table missing a user_id policy
Flag any table that has RLS enabled but no policy referencing `auth.uid()`.

### 4. Verify nested resource authorization
For `reflection_layers` and `resurfacing_queue` — confirm the policy verifies the full ownership chain, not just the direct user_id column.

### 5. Test IDOR resistance (if possible)
If there are two test users available, confirm User A cannot query User B's reflections via the API.

## Output:
Print a table showing each table's RLS status and policy count. Flag any issues with specific remediation SQL to fix them.

## Quick fix if RLS is disabled on a table:
```sql
ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own data"
  ON tablename FOR ALL
  USING (auth.uid() = user_id);
```
