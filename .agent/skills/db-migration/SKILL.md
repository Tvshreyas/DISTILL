---
name: Database Migration
description: Create a new Supabase migration following Distill's schema conventions and security rules
---

# Database Migration

When adding or modifying database tables/columns.

## Steps

1. **Create migration file:**

   ```
   supabase/migrations/<NNN>_<description>.sql
   ```

   Use the next sequential number after existing migrations.

2. **Always enable RLS on new tables:**

   ```sql
   ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can only access own data"
     ON public.new_table
     FOR ALL
     USING (auth.uid() = user_id);
   ```

3. **Verify RLS after migration:**

   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public';
   -- ALL rows must show rowsecurity = true
   ```

4. **Test locally:**

   ```bash
   npx supabase db reset    # Apply all migrations fresh
   npm test                 # Ensure nothing broke
   ```

5. **Push to remote:**
   ```bash
   npx supabase db push
   ```

## Rules

- Every table MUST have `user_id` column with FK to `auth.users`
- Every table MUST have RLS enabled with `auth.uid() = user_id` policy
- Use soft deletes (`is_deleted` boolean) not hard deletes
- Add `created_at` and `updated_at` timestamps to every table
- Never create `pgvector` indexes in V1 (wait for 1000+ rows)
- Cascade deletes for child tables (e.g., layers → reflections)
