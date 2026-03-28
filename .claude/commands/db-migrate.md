Create a new Supabase database migration for Distill. The migration name/description is: $ARGUMENTS

## Steps:

### 1. Determine next migration number

Check `supabase/migrations/` to find the highest existing migration number (e.g. 004_cron_jobs.sql → next is 005).

### 2. Create the migration file

Create `supabase/migrations/00N_$ARGUMENTS.sql` with:

- A header comment describing what this migration does
- The SQL for the migration
- At the bottom: verify RLS is still enabled on all affected tables

### 3. RLS reminder

After writing the SQL, explicitly check:

- If any NEW tables were created, add `ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;`
- Add the appropriate RLS policy: `CREATE POLICY "Users can only access own data" ON tablename FOR ALL USING (auth.uid() = user_id);`
- Never create a table without RLS

### 4. Apply locally

Run `npx supabase db reset` to apply all migrations to the local Supabase instance and confirm no errors.

### 5. Verify RLS

Run this SQL against the local DB to confirm all tables have RLS enabled:

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

All rows must show `rowsecurity = true`.

### 6. Summary

Report:

- Migration file created: `supabase/migrations/00N_name.sql`
- Tables affected
- RLS status on all tables
- Whether local apply succeeded
