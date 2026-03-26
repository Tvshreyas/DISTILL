Debug Stripe integration issues in Distill. Issue: $ARGUMENTS

## Stripe-specific debugging:

### 1. Check configuration
- Verify environment variables are set (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, price IDs)
- Verify STRIPE_SECRET_KEY is NOT in any NEXT_PUBLIC_ variable
- Check that Stripe client is initialized correctly in `lib/stripe.ts`

### 2. Webhook debugging
- Check `app/api/stripe/webhook/route.ts` for proper signature verification
- Verify idempotency: `processed_webhook_events` table is being checked
- Test webhook flow: event received → signature verified → idempotency checked → DB mutated
- Common issues:
  - Raw body not being passed (Next.js parses JSON by default)
  - Wrong webhook secret (test vs live)
  - Missing event types in the switch statement

### 3. Checkout flow
- Verify `create-checkout/route.ts` creates sessions with correct price IDs
- Check PPP pricing: `getPriceId(country, interval)` in `lib/pricing.ts`
- Verify success/cancel URLs point to correct routes

### 4. Subscription lifecycle
- Check handling of: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Verify `profiles.plan` is updated on subscription changes
- Verify `profiles.stripe_customer_id` is stored

### 5. Free tier enforcement
- Confirm limit is checked server-side in `POST /api/reflections`
- Confirm downgrade (pro → free) resets limits correctly
- Confirm upgrade (free → pro) removes limits immediately

### 6. Report findings with specific fixes
