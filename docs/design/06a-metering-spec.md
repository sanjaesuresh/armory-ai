# Section 6a — Test-Drive Metering Spec

**Status:** APPROVED 2026-07-02 (Phase 2 Task 1 gate cleared). Decisions locked: **Runner model = Sonnet 4.6** · **Comparison = expected-behavior only** · **Caps = as proposed** (5/token/day, 20/IP/day, $10 global, 80% alert, 8k in / 700 out, 30-day cache TTL). Later tasks read the values below as config.

This is the concrete metering spec the roadmap requires before Phase 2 begins. Section 6 (`06-scenario-test-drive.md`) fixes the *policy*; this fixes the *numbers and mechanisms* every later task consumes as named config. Where a later task says "the spec cap," it means the value here.

Source of truth for: per-run caps, daily budget, anon-identity token, cache policy, kill switch, the runner model and its pricing, and the two mock-forced product decisions.

---

## 0. Two decisions this spec forces (need sign-off)

The mock renders two things Section 6's locked design does not, so the spec must resolve them before the UI is built.

### DECISION A — Runner model (and the per-run cost target) — RESOLVED: Sonnet 4.6

The test-drive is the "try before you trust" bet: the user judges whether the setup produces good output. Model choice trades **fidelity** (how close the preview is to what the user gets in their own Claude) against **cost** (how many free runs fit under the daily budget).

Per-run cost at the token caps below (~8k input, ~700 output):

| Model | ID | In $/1M | Out $/1M | ~Cost/run | Runs / $10 day | Note |
|---|---|---|---|---|---|---|
| Haiku 4.5 | `claude-haiku-4-5` | $1.00 | $5.00 | ~$0.012 | ~870 | Cheapest; lower fidelity |
| **Sonnet 4.6** (proposed) | `claude-sonnet-4-6` | $3.00 | $15.00 | ~$0.035 | ~290 | Best speed/quality balance |
| Opus 4.8 | `claude-opus-4-8` | $5.00 | $25.00 | ~$0.058 | ~170 | Highest fidelity; exceeds the 5¢/run target |

- **Per-run cost target (proposed): ≤ $0.05.** Sonnet and Haiku fit; Opus does not.
- **Recommendation: Sonnet 4.6.** Fidelity is the point of the feature — a weak Haiku output can make a good setup look bad, which poisons the exact judgment the test-drive exists to support. The caps + cache + daily budget already bound cost. Haiku is the defensible alternative if maximizing free-run volume matters more than fidelity while the bet is unproven.
- **Pricing is verified at implementation time** (Task 6) against Anthropic's current docs and stored in server config with a source-and-date comment, per the `limits.ts` convention. The numbers above are the current published rates (checked 2026-07-02).

### DECISION B — Comparison column: expected-behavior vs baseline — RESOLVED: expected-behavior only

`results.html` frames output as "baseline vs. your setup," which needs a **second, uncustomized model call per run** (~2× cost and ~2× the metered spend). The locked Section 6 design compares the streamed output against the author's **`expectedBehavior`** prose from the scenario instead — no extra call.

- **Recommendation: expected-behavior compare only (the locked default).** It's free, it's already authored per scenario, and it's what Section 6 specifies. The mock's baseline framing was an unreviewed visual flourish. If the baseline is ever wanted, it can be added later behind its own flag once the core proves out — do not pay 2× on an unproven bet now.
- If baseline is approved instead: every run makes two calls (one with the compiled instruction as system prompt, one with an empty/default system prompt), both counted against caps and budget; the per-run cost figures above double; the cache key must cover both calls.

---

## 1. Enforcement technology

- **Storage:** Supabase (no new infrastructure). Four new tables (Tasks 2–5): a runtime-config table, an anon-tokens table, a usage table, a cache table.
- **Trust boundary (corrected during Task 2–5 review):** the metered test-drive route runs **server-side and uses the `SUPABASE_SERVICE_ROLE_KEY`**. All test-drive tables (runtime-config, anon-tokens, usage, cache, meter-state) are **service-role only** — the browser anon key has no access to any of them. This is a deliberate, correct deviation from the Phase 1 "service key = scripts only" convention: Phase 2 is the first server-side privileged-write path, and an anon-callable write function is, by definition, browser-callable (which would let anyone flip the kill switch or poison the cache). Any `SECURITY DEFINER` helper functions `REVOKE EXECUTE FROM anon, public` and `SET search_path = ''`. The service-role key lives only in server env and, like `ANTHROPIC_API_KEY`, must never appear in the client bundle (Task 10 asserts zero hits for both).
- **Atomicity (Phase 2 scope):** the meter checks the three caps and then records the usage row — check-then-record, not a single atomic reserve. On this off-by-default, low-volume launch the only race that costs money is the global-budget boundary, where worst-case overage is a few cents against the $10 ceiling (a handful of concurrent requests each ~3.5¢). Accepted for Phase 2; a true atomic reserve-with-estimate-then-finalize is a Phase 3 hardening item.
- **Testability:** every module (`flags`, `anonToken`, `meter`, `cache`) takes an **injectable data source** (the catalog-repository pattern) plus an **injectable clock**. Unit tests use in-memory doubles and a stubbed clock; CI never touches a live database or the network.
- **All time math is UTC.** Daily caps reset at 00:00 UTC. "Resets at midnight UTC" is the user-facing wording.

---

## 2. Caps and budget (the named numbers)

| Name | Value | Rationale |
|---|---|---|
| Per-anon-token daily run cap | **5** | Enough for one pass over a setup's scenarios plus a couple of re-tweaks; cache hits don't count against it. |
| Per-IP daily run cap | **20** | Generous enough for a shared office/NAT IP; blunts single-IP abuse of the unauthenticated endpoint. |
| Global daily budget | **$10 USD** | Hard aggregate ceiling; graceful degradation past it (below). |
| Budget alert threshold | **80%** ($8) | First crossing fires a once-per-day alert. |
| Input token cap | **8,000 tokens** | Covers compiled instruction (≤6000 chars ≈ ~1.5k tok) + capped starter knowledge + scenario input. Over-cap requests are rejected **before** any model call. |
| Output token cap | **700 tokens** | `max_tokens` passed to the model call; bounds output cost and latency. |
| Starter-knowledge append cap | **4,000 tokens** (~16k chars) | Starter-file content appended to the system prompt is truncated to this so total input stays under the input cap. |

**Order of checks** (Task 4, first failure wins): flag → per-token daily cap → per-IP daily cap → global daily budget. Each denial returns a `MeterDecision` naming the reason (`flag-off` | `session-cap` | `ip-cap` | `global-budget`) and, for the daily caps, a `retryAt` of the next UTC midnight.

**Graceful degradation past budget:** the endpoint returns a friendly "test-drives are busy right now, try again later" state (Section 8 budget-busy), never an error or an unbounded bill. Cache hits still serve (they cost nothing).

---

## 3. Self-tracked accounting

The model API reports no real-time spend, so we price each run ourselves. On every completed (non-cached) run the runner writes one **usage row**: anon token, salted IP hash, input tokens, output tokens, `estimatedCostUsd`, `createdAt`. Cost is computed from a **server-side model-price config** (model id + input/output USD-per-1M, with a source-and-date comment). The global-budget check sums `estimatedCostUsd` over today's rows.

**Alert path (simplest honest version):** when today's summed cost first crosses 80% of the budget, the meter emits one structured log line (`testdrive.budget.alert`, once per day) and the daily figure is surfaced in the eval/report script's budget-status line (Task 8). Upgradeable to email/webhook later; not built now.

---

## 4. Anonymous identity token

The "lightweight anonymous browser-issued identity" the roadmap requires so the free, unauthenticated, paid endpoint is metered by something sturdier than a bare session cookie.

- **Format:** opaque, URL-safe, **128 bits** of CSPRNG randomness.
- **Issuance:** on a test-drive request with no valid token cookie, generate one, persist it (anon-tokens table: token id, createdAt, lastSeenAt), and set it.
- **Cookie:** `httpOnly`, `secure`, `sameSite=lax`, **1-year** expiry. Name: `armory_td` (namespaced, distinct from any future auth cookie).
- **Validation:** a present, well-formed token is returned unchanged and its `lastSeenAt` touched. A malformed/absent cookie is replaced; the old value never reaches the data source.
- **Rotation:** none in Phase 2 (1-year expiry, refreshed on use). The token is the meter's per-session key. It is **not** identity/auth — it's a rate-limit handle; clearing cookies resets it, which is acceptable (the per-IP cap and global budget are the backstops).

---

## 5. Cache policy

- **Key** (`cacheKeyFor`): a stable hash over the **resolved compiled instruction, the full `inputs` map, setup id + version, scenario id, model id, and the token caps**. Section 3's rule — the key derives from *all* inputs — so different customizations never collide.
- **Hits serve free and do not decrement any meter.** Labeled in the UI as an instant example.
- **TTL: 30 days.** Outputs are deterministic for a fixed (compiled instruction + scenario + model + caps); the key already includes setup **version** and **model id**, so a setup edit or model change invalidates naturally. 30 days maximizes the cost-saving lever for popular curated setups while any correction lands via a version bump. Tunable; an expired entry is a miss.
- **Knowledge in the prompt:** starter-file content is appended to the system prompt, truncated to the 4k-token append cap (§2). **User-provided files are always excluded** and the exclusion is labeled in the UI ("test-drive can't see files you attach — they stay on your device").

---

## 6. Kill switch + feature flag

- **Env default:** `TESTDRIVE_ENABLED` (off unless explicitly `true`). Ships **off in production** until deliberately flipped.
- **Two enforcement points, by concern (clarified during Task 7):**
  - **UI render gate** = the pure env flag only (`isTestDriveLaunched()`, no I/O). Env-off ⇒ **no test-drive entry point renders anywhere** (customize panel and preview button both gone). Keeping this env-only means the customize page never does a per-render Supabase round-trip and never hides the panel on a transient DB blip.
  - **Runtime kill switch** = the `testdrive.enabled` config row, enforced **server-side by the runner** (`createFlagChecker(...).isTestDriveEnabled()` = env **and** config row) before any model spend, cached in-process **≤ 60 seconds**. Flipping it to `false` makes runs return the feature-off state within one cache window — spend stops, the panel just shows "not available right now" rather than vanishing.
- **Precedence:** env-off means disabled regardless of the config row; env-on can be overridden to off by the config row at run time. (Config cannot force-on when env is off — off is always reachable.)

---

## 7. User-facing metering language (resolves the mock's "credits")

The product is **free, no paywall** (locked). So:

- Frame the quota as **"free test-drives," never "credits"** (credits implies a purchasable currency). Show remaining as **"N free test-drives left today"** with the mock's subtle bar.
- **Do not show a per-run dollar cost** to users (they aren't paying) — an approximate **time** cue ("~5 sec") is fine; a price is not.
- **Exhausted (per-token cap):** "You've used your 5 free test-drives for today — they reset at midnight UTC." Friendly, names the cap and the reset. Never a dead end.
- **Budget-busy (global cap):** "Test-drives are busy right now — try again in a little while." No cap-shaming, no error tone.
- Every quota state names when it recovers.

---

## 8. Environment variables (added this phase)

| Var | Scope | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | **server only** | The model key. Never in the client bundle (Task 10 asserts zero hits in built chunks). |
| `TESTDRIVE_ENABLED` | server | Feature-flag env default (off unless `true`). |
| `TESTDRIVE_IP_SALT` | server | Salt for IP hashing; raw IPs are never stored. |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Now also used by the test-drive route (previously scripts-only). Test-drive tables are service-role only; anon has no access. Never in the client bundle (Task 10 asserts). |

The four test-drive tables plus a meter-state table deny all anon access; the server route reads/writes them with the service-role key. Budget-alert bookkeeping lives in its own meter-state table, **not** in the flag/kill-switch `runtime_config` table, so the security-sensitive config table is never touched by per-run bookkeeping.

---

## 9. Self-check against Section 6's "Before Phase 2 starts" list

| Section 6 requirement | Where in this spec |
|---|---|
| Specific per-session and per-IP limits | §2 (5 / 20) |
| Global daily dollar budget | §2 ($10) + graceful degradation |
| Alert path at ~80% budget | §2 threshold + §3 alert path |
| Self-tracked token accounting | §3 (usage row priced from server config) |
| Enforcement technology | §1 (Supabase + SECURITY DEFINER fns + injectable sources) |
| Lightweight anonymous identity | §4 (128-bit token, httpOnly cookie, server table) |
| Token caps (input + output) | §2 (8k / 700) |
| Caching policy | §5 (key over all inputs, 30-day TTL, free hits) |
| Configurable model | §0A + §3 (server model-price config, verified at build) |
| Kill switch | §6 (config row, ≤60s cache, no redeploy) |
| Mock decision: metering language | §7 (free test-drives, no credits, no user-facing $) |
| Mock decision: baseline vs expected | §0B (expected-behavior only, recommended) |

Every Section 6 item maps to a section here.

---

## 10. Approval — RESOLVED 2026-07-02

1. **DECISION A** — runner model: **Sonnet 4.6** (`claude-sonnet-4-6`). ✓
2. **DECISION B** — comparison column: **expected-behavior only**. ✓
3. Proposed numbers in §2 (5 / 20 / $10 / 80% / 8k / 700 / 4k): **approved as-is**. ✓

This file is now the source of truth. If any number changes later, update it here first; the other tasks read it.

---

## 11. Phase 2 as-built notes & deferred items (recorded at commit)

**Delivered & verified in CI (no spend):** all metering primitives (flag, anon token, meter, cache) with hardened service-role-only DB access; the runner + `/api/test-drive` SSE route (model behind an injected interface); the test-drive UI (streaming, cancel, quota/budget/cached/flag-off states) verified by route-intercepted Playwright; the assertions checker; and the ChatGPT export target (adapter with both branches, validator dispatch, limits, target picker + walkthrough) verified by unit + component tests + a real-flow e2e. Full suite: 273 unit / 108 e2e, clean build, no server secret in client chunks.

**Deferred — require a credentialed environment (the user runs these before enabling the flag in prod):**
- Apply the new `supabase/schema.sql` (5 test-drive tables) to the Supabase project.
- Re-verify the model id + per-token pricing (`lib/testdrive/modelConfig.ts`) and the ChatGPT limits (`lib/setup/limits.ts`, marked ASSUMPTION) against current provider docs.
- The manual guarded real-API run (Task 6 Step 5 / Task 10 Step 4): stream one scenario, confirm the cache hit + friendly quota state, and flip the kill-switch config row.
- The eval harness's first real run (`RUN_EVAL=1 npm run eval`) against the curated catalog (Task 8 Step 4).

**Notable as-built decisions (rationale in the sections above):** render-gate is the pure env flag while the kill switch is enforced in the runner (§6); the meter is check-then-record, not atomic (§1, accepted for this off-by-default launch); the ChatGPT target picker is dormant until a multi-target curated setup exists, so its multi-target flow is covered by component tests rather than a Supabase-seeded e2e. The feature flag ships **off** in production.
