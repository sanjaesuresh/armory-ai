# Supabase setup for Armory

## 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New project. Note your project URL and anon key from Settings → API.

## 2. Set environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Both values are under **Settings → API** in the Supabase dashboard.

## 3. Apply the schema

In the Supabase dashboard: **Database → SQL Editor → New query**.
Paste the contents of `supabase/schema.sql` and click **Run**.

This creates the `setups` table and an RLS policy that lets anonymous users read approved setups only. No insert/update/delete policies are created — the table is read-only by design.

## 4. Seed the curated setups

Paste the contents of `supabase/seed.sql` into the SQL editor and click **Run**.

The file uses `ON CONFLICT (id) DO UPDATE` so it is safe to re-run. Regenerate it any time the curated fixtures change:

```
npm run seed
```

## 5. Verify

In the SQL editor, run:

```sql
select id, slug, review_status, featured from setups order by featured asc nulls last, name asc;
```

You should see the `marketing-manager` row with `review_status = 'approved'`.
