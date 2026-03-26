# Distill Leads Agent

Daily automated lead finder. Surfaces Reddit, Hacker News, and Twitter conversations where people need a tool like Distill. Runs as a self-hosted n8n workflow and emails a scored digest every morning at 8am IST.

## Quick Start

```bash
cd automation/leads-agent

# 1. Create .env from template
cp .env.example .env
# Edit .env with your Resend API key and email addresses

# 2. Start n8n
docker compose up -d

# 3. Open n8n UI
open http://localhost:5678
# Create your n8n account on first visit

# 4. Import the workflow
# Go to Workflows → Import from File → select n8n-workflow.json

# 5. Set up Resend credential
# Go to Credentials → Add Credential → Header Auth
# Name: "Resend API Key"
# Header Name: Authorization
# Header Value: Bearer re_your_actual_key_here

# 6. Test run
# Open the workflow → click "Execute Workflow"
# Check execution log — all 4 fetch nodes should return data (Twitter may be empty)

# 7. Activate the schedule
# Toggle the workflow to Active — next run at 08:00 IST tomorrow
```

## Architecture

```
Schedule (8am IST daily)
  ├── Reddit Subreddit Scraper (9 subs, last 24h)
  ├── Reddit Search Scraper (5 queries)
  ├── HN Algolia Search (7 queries)
  └── Twitter/Nitter Search (5 queries, graceful fallback)
        ↓
  Merge → Remove Empties → Deduplicate + Score (1-10)
        ↓
  Build Email HTML → Has Leads? → Send via Resend
```

## Scoring

Each lead gets a 1-10 score based on:
- **Keyword specificity** (0-3): High-intent phrases like "readwise alternative" score higher
- **Source weight**: HN +3, Reddit +2, Twitter +1
- **Engagement**: Score >10 gives +2, comments >5 gives +2
- **Recency**: Posted <6 hours ago gives +1

## Maintenance

- **Nitter instances** are unreliable — update the instance list in the Twitter node monthly
- **Add/remove subreddits and keywords** by editing Code nodes directly in n8n UI
- **Execution history** at `http://localhost:5678/executions`
- **Cross-day dedup** is not implemented — the same active thread may reappear across days

## Stopping

```bash
docker compose down        # Stop n8n (data persists in volume)
docker compose down -v     # Stop and delete all data
```
