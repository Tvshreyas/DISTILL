Start the full Distill development environment and verify everything is running.

## Steps:

### 1. Check prerequisites
- Verify Node.js is installed: `node --version`
- Verify npm packages are installed: check if `node_modules` exists, run `npm install` if not

### 2. Start Supabase local
Run `npx supabase start` in background. Wait for it to be ready. If already running, skip.

### 3. Start Next.js dev server
Run `npm run dev` in background. Confirm it starts on localhost:3000.

### 4. Health check
- Verify Supabase is reachable at the local URL
- Verify Next.js responds at http://localhost:3000
- Check `.env.local` exists and has required variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 5. Report
Print a status dashboard:
- Supabase: running/not running
- Next.js: running/not running
- Environment: configured/missing vars
- Last migration applied
- Ready to code: YES/NO
