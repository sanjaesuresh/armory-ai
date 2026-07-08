import type { Setup } from '@/lib/setup/types';

export const dataAnalystSkills: Setup[] = [
  // ── 1. SQL Query Writer ──────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-sql-query-writer-v1',
    slug: 'data-analyst-sql-query-writer',
    name: 'SQL Query Writer',
    tagline: 'Turn plain-English questions into production-ready SQL queries',
    description:
      'Translate a plain-English data question into a clean, commented SQL query. ' +
      'Handles aggregations, joins, CTEs, and window functions. States the output grain ' +
      'and key assumptions upfront so you know exactly what the query returns before running it.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['sql', 'queries', 'data-analysis', 'business-intelligence', 'ctes', 'data'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a SQL query writer. Write all queries in {{sqlDialect}}.

Schema context provided by the user:
{{schemaContext}}

Target query complexity: {{queryComplexity}}.

Rules:
1. Open every query with a header comment: purpose, date range, grain (one row = one ...), and key assumptions.
2. Use named CTEs for each logical step. Never use SELECT *.
3. Never invent table names, column names, or business logic not present in the schema context; ask before writing if schema details are missing.
4. Never fabricate row counts, metric values, or query results — state all assumptions explicitly and flag nulls, gaps, or duplicates rather than silently excluding them.`,

    variables: [
      {
        key: 'sqlDialect',
        label: 'SQL dialect',
        type: 'select',
        options: ['PostgreSQL', 'MySQL', 'BigQuery', 'Snowflake', 'Amazon Redshift', 'SQLite'],
        default: 'PostgreSQL',
        required: true,
        helpText: 'Pick your database. Claude will use the correct date functions, string functions, and window-function syntax for this dialect.',
        group: 'Your environment',
      },
      {
        key: 'schemaContext',
        label: 'Schema context',
        type: 'multiline',
        required: true,
        helpText: 'List the tables and columns you work with most. Include table name, column names, and data types. Even partial coverage is useful — Claude will ask when it needs more.',
        group: 'Your environment',
      },
      {
        key: 'queryComplexity',
        label: 'Typical query complexity',
        type: 'select',
        options: ['Simple (single table, basic aggregation)', 'Moderate (joins, GROUP BY)', 'Complex (window functions, multi-level CTEs)'],
        default: 'Moderate (joins, GROUP BY)',
        required: true,
        helpText: 'This tells Claude how much to explain query logic and whether to default to simpler or more advanced SQL patterns.',
        group: 'Your preferences',
      },
    ],

    knowledgeFiles: [
      {
        name: 'SQL query standards reference card',
        purpose:
          'Gives Claude a compact checklist of query structure conventions — header comments, ' +
          'CTE naming, grain documentation, and null handling — so every query it produces ' +
          'follows the same readable, self-documenting pattern.',
        kind: 'starter',
        content: `# SQL query standards reference card

## Required query header (paste this as a comment block at the top of every query)
- Purpose: what question does this query answer?
- Date range: e.g., 2026-06-01 through 2026-06-30 UTC
- Grain: one row = one [user / order / day / event / session]
- Key assumptions: e.g., cancelled orders excluded; free trial users included

## CTE naming conventions
- Use plain-English names that describe WHAT the CTE produces: active_users, revenue_by_week, first_touch_events
- One logical step per CTE — do not combine two transformations into one CTE
- Order CTEs from raw → filtered → aggregated → final

## Null handling rules
- Document null treatment for every metric column (excluded, treated as zero, treated as unknown)
- Never silently coalesce nulls to zero without a comment explaining why
- Flag any column that is unexpectedly null in more than 5% of rows

## Common mistakes to avoid
- SELECT * in production queries (breaks when schema changes)
- Joining on a non-unique key without acknowledging fan-out
- Comparing dates without aligning timezones (UTC vs local)
- Filtering in a WHERE clause on a column that is nullable (use IS NOT NULL explicitly)
- Counting users across overlapping date windows without deduplication

## Row-count sanity checks
Add a final comment or a separate validation query that confirms:
- Total row count matches an expected baseline (±10%)
- No unexpected duplicates on the primary key of the output
- Date range covers exactly the intended window (min/max check)
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-sql-query-writer-scenario-1',
        title: 'Weekly signups by country',
        userInput:
          'I want to know how many users signed up each week in June 2026, broken down by country. ' +
          'I have a users table with columns: user_id, email, country, created_at (timestamptz). ' +
          'Write me a PostgreSQL query.',
        expectedBehavior:
          'Claude should produce a well-commented PostgreSQL query using a CTE to truncate created_at ' +
          'to the week, filter to June 2026, and GROUP BY week and country. The header comment must state ' +
          'the grain (one row = one country per week), the date range, and timezone assumptions. ' +
          'It should use date_trunc or equivalent and include an ORDER BY for readability.',
        mustContain: ['users table', 'created_at', 'June 2026', 'country'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-sql-query-writer-scenario-2',
        title: 'Revenue by country with user join',
        userInput:
          'Write a SQL query that joins the orders table (order_id, user_id, amount_cents, created_at) ' +
          'with the users table (user_id, email, country) to get total revenue by country for Q1 2026. ' +
          'Exclude orders with a null amount_cents. Use PostgreSQL.',
        expectedBehavior:
          'Claude should write a query with at least two CTEs: one filtering the orders table to Q1 2026 ' +
          'and excluding null amount_cents rows, and one joining to users and grouping by country. ' +
          'It should convert amount_cents to a dollar amount (dividing by 100) or clearly label the output column. ' +
          'The header comment must state the grain, date range, and the null exclusion assumption.',
        mustContain: ['orders table', 'amount_cents', 'country', 'Q1 2026'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 2. Chart & Viz Recommender ───────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-chart-viz-recommender-v1',
    slug: 'data-analyst-chart-viz-recommender',
    name: 'Chart & Viz Recommender',
    tagline: 'Pick the right chart for your data — explained in plain English',
    description:
      'Recommend the best chart type for a given dataset and question. Goes beyond naming ' +
      'a chart type: explains why it fits the data shape and audience, lists trade-offs ' +
      'of alternatives, and calls out any data prep required before building.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['data-visualization', 'charts', 'dashboards', 'reporting', 'data', 'bi'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a data visualization advisor. Your job is to recommend the right chart for a given dataset and question.

Default visualization tool: {{vizTool}}.
Primary audience for charts: {{chartAudience}}.

{{#if vizTool}}
When recommending a chart, include specific implementation notes for {{vizTool}} — chart type name, key settings, and any gotchas.
{{/if}}

Rules:
1. Name the single best chart type first, then list up to two alternatives with their trade-offs.
2. Explain why the recommended chart fits the specific data shape and audience — not just what the chart is.
3. Call out any data prep required before the chart can be built (aggregation, pivoting, deduplication, date alignment).
4. Never recommend a chart that implies a relationship or trend the data cannot support; state what the data must contain and flag when data is insufficient to draw a conclusion.`,

    variables: [
      {
        key: 'vizTool',
        label: 'Visualization tool',
        type: 'select',
        options: ['Tableau', 'Power BI', 'Looker', 'Google Looker Studio', 'Python (matplotlib / seaborn)', 'Excel / Google Sheets', 'Any / not specified'],
        default: 'Any / not specified',
        required: true,
        helpText: 'Select your charting tool. Claude will include tool-specific implementation notes in its recommendations.',
        group: 'Your setup',
      },
      {
        key: 'chartAudience',
        label: 'Chart audience',
        type: 'select',
        options: ['Executive / C-suite', 'Product or business analyst', 'Engineering', 'General business user'],
        default: 'Product or business analyst',
        required: true,
        helpText: 'Who will read these charts? Executives need simple, high-signal visuals; analysts can handle more complexity.',
        group: 'Your setup',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Chart type selection reference card',
        purpose:
          'Gives Claude a compact lookup of which chart type fits which data shape and question, ' +
          'so recommendations start from a principled baseline rather than default patterns.',
        kind: 'starter',
        content: `# Chart type selection reference card

## Match chart type to question

| Question type | Best chart | Common mistake |
|---|---|---|
| How does X change over time? | Line chart | Bar chart hides trend continuity |
| How do categories compare at a point in time? | Horizontal bar chart | Pie chart fails with > 5 slices |
| What share does each part contribute? | Stacked bar or treemap | Pie chart hard to compare non-adjacent slices |
| How are two variables related? | Scatter plot | Bar chart implies discrete grouping |
| How is a single variable distributed? | Histogram or box plot | Bar chart of averages hides distribution shape |
| How does a metric funnel step by step? | Funnel chart or waterfall | Line chart implies continuity between steps |
| How does X vary by two dimensions? | Heatmap or small multiples | 3D chart almost always wrong |

## Data prep checks before building any chart
- Aggregation: is the grain correct for the chart? (e.g., daily data for a weekly trend chart needs resampling)
- Deduplication: are there duplicate rows that will inflate counts?
- Null handling: decide how to represent nulls (gap in line, zero, excluded) and document the choice
- Date alignment: are all series in the same timezone?
- Outliers: should extreme values be shown, capped, or called out separately?

## Audience calibration
- Executive: one key number per chart, minimal labels, trend direction obvious at a glance
- Analyst: axes labelled, source and date range visible, data table available on hover or below
- Engineering: raw numbers preferred; log scale acceptable if range spans orders of magnitude

## Common mistakes
- Dual Y-axis charts: almost always misleading; use small multiples instead
- 3D charts: never; the depth axis distorts perception
- Truncated Y-axis: always start the Y-axis at zero for bar charts; for line charts, label clearly if truncated
- Color for decoration: use color only to encode a variable, not to make charts look interesting
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-chart-viz-recommender-scenario-1',
        title: 'Show revenue trend across five product lines',
        userInput:
          'I have monthly revenue data for 5 product lines going back 2 years. I want to show ' +
          'which product lines are growing and which are declining. What is the best chart type?',
        expectedBehavior:
          'Claude should recommend a line chart with one series per product line as the primary recommendation, ' +
          'explaining that line charts show trend continuity clearly across a 2-year window. It should offer ' +
          'a small-multiples alternative and note when a stacked area chart is and is not appropriate. ' +
          'It must mention that 5 series is near the perceptual limit for color discrimination and suggest ' +
          'labeling strategies. It should flag if any data prep is needed (monthly aggregation confirmed, ' +
          'consistent currency).',
        mustContain: ['monthly revenue', '5 product lines', 'growing', 'declining'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-chart-viz-recommender-scenario-2',
        title: 'Show plan tier distribution',
        userInput:
          'I want to show what percentage of our users fall into each plan tier: free, starter, ' +
          'pro, and enterprise. The numbers are: free 8000, starter 3200, pro 1100, enterprise 150. ' +
          'What is the best chart?',
        expectedBehavior:
          'Claude should recommend a horizontal bar chart ranked by size as the primary option, ' +
          'explaining that it makes the large gap between tiers immediately readable. It should ' +
          'acknowledge the pie chart is a common choice here but explain why the bar chart is clearer ' +
          'when values span different orders of magnitude. It should note that the data is already ' +
          'aggregated and ready to chart without further prep.',
        mustContain: ['free 8000', 'starter 3200', 'pro 1100', 'enterprise 150'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 3. Dashboard Spec Writer ─────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-dashboard-spec-v1',
    slug: 'data-analyst-dashboard-spec',
    name: 'Dashboard Spec Writer',
    tagline: 'Translate a business goal into a complete dashboard specification',
    description:
      'Produce a structured dashboard spec from a goal and audience — chart panels, metric definitions, ' +
      'grains, filters, alert thresholds, and data freshness requirements. Skips straight to implementation ' +
      'code only after the spec is agreed on.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['dashboards', 'business-intelligence', 'data', 'reporting', 'metrics', 'product'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a dashboard spec writer. Produce a complete, structured spec — not implementation code.

Dashboard goal: {{dashboardGoal}}
Key metric: {{keyMetric}}
Primary audience: {{primaryAudience}}
Refresh cadence: {{refreshCadence}}

Rules:
1. Define every metric in the spec in plain English before placing it on a panel.
2. State the grain (one row = one ...) and default date range for each chart panel.
3. List required filters, a data freshness requirement, and alert thresholds for the key metric.
4. Never assume data exists that has not been described; flag missing data needs as open questions at the end of the spec.`,

    variables: [
      {
        key: 'dashboardGoal',
        label: 'Dashboard goal',
        type: 'multiline',
        required: true,
        helpText: 'What decision or question should this dashboard answer? Be specific: "Track weekly feature adoption so the product team can prioritize the next sprint" is better than "show feature usage."',
        group: 'Dashboard context',
      },
      {
        key: 'keyMetric',
        label: 'Key metric',
        type: 'text',
        required: true,
        helpText: 'The single most important metric on this dashboard. Everything else should support it.',
        group: 'Dashboard context',
      },
      {
        key: 'primaryAudience',
        label: 'Primary audience',
        type: 'select',
        options: ['Executive / C-suite', 'Product manager', 'Engineering', 'Sales', 'Marketing', 'Operations'],
        default: 'Product manager',
        required: true,
        helpText: 'Who opens this dashboard most? The audience determines vocabulary, detail level, and how much context to embed in the charts.',
        group: 'Dashboard context',
      },
      {
        key: 'refreshCadence',
        label: 'Data refresh cadence',
        type: 'select',
        options: ['Real-time (< 5 min)', 'Hourly', 'Daily', 'Weekly', 'Monthly'],
        default: 'Daily',
        required: true,
        helpText: 'How fresh does the data need to be? This shapes which metrics are feasible and what infrastructure is required.',
        group: 'Dashboard context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Dashboard spec reference card',
        purpose:
          'Gives Claude a structured template for producing dashboard specs — panel list, ' +
          'metric definitions, filter requirements, freshness rules — so outputs are ' +
          'consistent and actionable for engineers who build the dashboard.',
        kind: 'starter',
        content: `# Dashboard spec reference card

## Required sections in every dashboard spec

### 1. Summary
- Dashboard name and purpose (one sentence)
- Primary audience and how they use it
- Primary metric and its definition

### 2. Metric definitions
For each metric, document:
- Plain-English definition
- Formula (in words, not code)
- Grain: one row = one [user / day / order / event]
- Default date range
- Inclusion / exclusion rules (e.g., trial users excluded, cancelled orders excluded)
- Known limitations or caveats

### 3. Panel inventory
For each panel:
- Panel title (includes metric name + date range — never just "Overview")
- Chart type and why it fits
- Grain and date range
- Filters that apply to this panel
- Comparison period (e.g., prior week, prior year)
- Alert threshold (if applicable)

### 4. Global filters
List all filters available across the entire dashboard:
- Date range picker (default window)
- Segment filters (e.g., plan tier, region, cohort)
- Note which filters affect all panels vs. individual panels

### 5. Data freshness
- Required lag: how stale can data be before the dashboard is misleading?
- Data freshness timestamp: must be visible on the dashboard
- Stale-data warning: specify what happens when data is > X hours old

### 6. Open questions / missing data
- Data that is needed but not confirmed to exist
- Metrics that cannot be calculated with the current schema
- Decisions the team needs to make before building

## Dashboard design rules
- Primary metric is the largest, most prominent element
- Every point-in-time number has a trend line or comparison period alongside it
- Filters are consistent across all panels
- "No data" and "loading" states are handled — not just the happy path
- Alert thresholds are documented on the dashboard, not just in someone's head
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-dashboard-spec-scenario-1',
        title: 'Weekly feature adoption dashboard for product team',
        userInput:
          'I need a dashboard for our product team to track weekly feature adoption. ' +
          'We want to know which features are being used, by how many users, and whether ' +
          'usage is growing week over week. Our key metric is weekly active feature users.',
        expectedBehavior:
          'Claude should produce a structured spec with at least four panels: a primary WAU per feature chart, ' +
          'a week-over-week change table, a per-feature trend sparkline, and a new-vs-returning breakdown. ' +
          'It must define "weekly active feature user" explicitly before placing it on any panel. ' +
          'It should include a feature filter, a date range picker defaulting to the last 12 weeks, ' +
          'and call out whether the events table must have a feature_name or feature_id column.',
        mustContain: ['product team', 'weekly feature adoption', 'week over week', 'weekly active feature users'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-dashboard-spec-scenario-2',
        title: 'Executive revenue dashboard spec',
        userInput:
          'Build me a spec for an executive revenue dashboard that shows MRR, new ARR, churn rate, ' +
          'and net revenue retention. The audience is our CEO and CFO who look at it every Monday morning.',
        expectedBehavior:
          'Claude should produce a spec with clear metric definitions for each of the four metrics ' +
          '(MRR, new ARR, churn rate, NRR) before describing any panel. The spec should note that ' +
          'the Monday morning cadence implies a weekly data refresh requirement. Panels should ' +
          'include month-over-month and year-over-year comparisons. It should flag which metrics ' +
          'require subscription-level data and ask whether trial revenue is included or excluded.',
        mustContain: ['MRR', 'churn rate', 'CEO and CFO', 'Monday morning'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 4. Insight Summary Writer ────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-insight-summary-writer-v1',
    slug: 'data-analyst-insight-summary-writer',
    name: 'Insight Summary Writer',
    tagline: 'Turn raw data findings into plain-language summaries that drive decisions',
    description:
      'Translate numbers and metric movements into crisp, action-oriented summaries matched ' +
      'to the audience. Leads with the insight and "so what," not the methodology. ' +
      'Calibrates vocabulary and depth to executives, product managers, or ops teams automatically.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['reporting', 'communication', 'data', 'insights', 'stakeholders', 'writing'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are an insight summary writer. Translate data findings into clear, action-oriented summaries for a {{audienceRole}} audience.

Finding type: {{findingType}}.

{{#if includeRecommendation}}
End every summary with a concrete recommendation or the single most important follow-up question for the team to answer.
{{/if}}

Rules:
1. Lead with the insight (what happened, magnitude, direction, time period) — never lead with methodology or caveats.
2. Include the exact numbers: magnitude, direction, and date range must appear in every summary.
3. State one clear "so what" — the decision or action the finding implies.
4. Never fabricate numbers or trends not present in the data provided. State assumptions explicitly and flag data gaps rather than filling them with guesses.`,

    variables: [
      {
        key: 'audienceRole',
        label: 'Audience role',
        type: 'select',
        options: ['Executive / C-suite', 'Product manager', 'Sales team', 'Marketing team', 'Operations team', 'Engineering'],
        default: 'Product manager',
        required: true,
        helpText: 'Who is reading this summary? The audience determines how much technical context to include and what action to highlight.',
        group: 'Your audience',
      },
      {
        key: 'findingType',
        label: 'Type of finding',
        type: 'select',
        options: ['Metric movement (up or down)', 'Segment comparison', 'Trend over time', 'Anomaly or outlier', 'Funnel drop-off'],
        default: 'Metric movement (up or down)',
        required: true,
        helpText: 'Pick the structure that matches your finding. Each type has a different narrative arc.',
        group: 'Your finding',
      },
      {
        key: 'includeRecommendation',
        label: 'Include a recommendation?',
        type: 'boolean',
        default: true,
        required: false,
        helpText: 'Turn on to end every summary with a concrete recommendation or key follow-up question.',
        group: 'Your preferences',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Insight summary writing reference card',
        purpose:
          'Gives Claude a set of narrative templates and quality checks for writing insight summaries — ' +
          'so every output has the right structure, leads with the finding, and ends with a clear action.',
        kind: 'starter',
        content: `# Insight summary writing reference card

## The four-sentence structure (use as a starting point)
1. **What happened:** [Metric] [increased / decreased] by [magnitude] [percentage or absolute] between [start date] and [end date].
2. **Why it matters:** This [confirms / contradicts / is consistent with] [prior trend / expectation / target].
3. **Likely cause (if known):** [One hypothesis, stated as a hypothesis — not a fact — if data supports it].
4. **So what / next step:** [The decision or action this finding implies, or the question the team must answer next].

## Audience calibration
- **Executive / C-suite:** Lead with business impact in dollars, percentage, or customer count. No SQL, no p-values, no jargon. One "so what" only.
- **Product manager:** Include segment breakdowns and trend context. Surface the feature or flow most likely responsible.
- **Sales team:** Frame findings in terms of pipeline, deal size, or win rate. Avoid data-layer details.
- **Marketing team:** Relate to campaign timing, channel mix, or conversion funnel steps.
- **Operations team:** Focus on efficiency metrics; flag if SLAs or volume thresholds were breached.
- **Engineering:** Include technical detail when relevant (e.g., error rates, latency percentiles).

## Quality checklist before sharing a summary
- [ ] The finding leads — methodology is mentioned only if it affects interpretation
- [ ] Exact numbers are present: magnitude, direction, date range
- [ ] The grain is clear (one number per user / per day / per cohort)
- [ ] A "so what" or follow-up question is present
- [ ] No numbers were invented or extrapolated from the data provided
- [ ] Assumptions are stated (e.g., "excluding free trial users")

## What NOT to do
- Never lead with "I ran a query and found that..."
- Never use "interesting" or "notable" — say what the finding means
- Never present a hypothesis as a fact without flagging uncertainty
- Never omit the time period for any number
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-insight-summary-writer-scenario-1',
        title: 'Summarize a DAU drop for the executive team',
        userInput:
          'DAU dropped from 42,000 to 31,000 between June 1 and June 14. The biggest single-day ' +
          'drop happened on June 8. Write a plain-English summary for our executive team.',
        expectedBehavior:
          'Claude should lead with the drop (magnitude, percentage, date range) in the first sentence. ' +
          'It should note the June 8 spike in the drop without inventing a cause — framing it as a ' +
          '"likely event boundary" worth investigating. The summary should end with a concrete next step ' +
          '(e.g., investigate what changed on June 8 — deploy, outage, marketing pause). ' +
          'It must not fabricate a root cause.',
        mustContain: ['42,000', '31,000', 'June 1', 'June 8', 'executive team'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-insight-summary-writer-scenario-2',
        title: 'Summarize an email open rate improvement',
        userInput:
          'Our email open rate went from 18% to 27% after we changed the subject line format ' +
          'last week. Write a plain-language summary for our marketing team.',
        expectedBehavior:
          'Claude should lead with the finding (18% to 27%, the 9-point or ~50% relative lift) ' +
          'and tie it to the subject line change as the most likely cause while noting this is ' +
          'observational, not a controlled test. It should flag that a single week is a short window ' +
          'and suggest confirming over a second week before attributing the lift to the format change. ' +
          'The "so what" should be actionable for a marketing team.',
        mustContain: ['18%', '27%', 'subject line format', 'marketing team'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 5. A/B Test Analyzer ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-ab-test-analyzer-v1',
    slug: 'data-analyst-ab-test-analyzer',
    name: 'A/B Test Analyzer',
    tagline: 'Interpret A/B test results with statistical rigor and clear ship/no-ship guidance',
    description:
      'Walk through A/B test results: statistical significance, practical significance, and ' +
      'threats to validity. Distinguishes a significant result from a shippable one, and ' +
      'flags peeking, segment imbalances, and multiple comparison problems before drawing conclusions.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['ab-testing', 'statistics', 'experimentation', 'data', 'product', 'conversion'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are an A/B test result interpreter. Required statistical confidence level: {{confidenceThreshold}}.

Primary test metric type: {{testMetricType}}.

Business context for this experiment program: {{businessContext}}

Rules:
1. State statistical significance at {{confidenceThreshold}} confidence as the first conclusion — before discussing implications.
2. Distinguish statistical significance from practical significance: a small but significant lift may not justify shipping.
3. List validity threats: segment imbalances, novelty effects, peeking, multiple comparison problems, and sample ratio mismatch.
4. Never fabricate p-values, confidence intervals, or effect sizes — compute only from the numbers provided. State all assumptions explicitly.`,

    variables: [
      {
        key: 'confidenceThreshold',
        label: 'Required confidence level',
        type: 'select',
        options: ['90%', '95%', '99%'],
        default: '95%',
        required: true,
        helpText: 'The statistical confidence threshold your team requires before shipping. 95% is the standard; use 99% for high-stakes or irreversible changes.',
        group: 'Statistical standards',
      },
      {
        key: 'testMetricType',
        label: 'Primary metric type',
        type: 'select',
        options: ['Conversion rate (proportion)', 'Revenue per user (continuous)', 'Click-through rate (proportion)', 'Session length (continuous)', 'Retention rate (proportion)'],
        default: 'Conversion rate (proportion)',
        required: true,
        helpText: 'Proportion metrics (conversion, CTR, retention) use different statistical tests than continuous metrics (revenue, session length). This helps Claude choose the right approach.',
        group: 'Statistical standards',
      },
      {
        key: 'businessContext',
        label: 'Business context',
        type: 'multiline',
        required: true,
        helpText: 'Describe what this experiment program is testing: what kind of changes, what the company cares about, and any constraints (e.g., "we never ship changes that hurt retention even if they help conversion").',
        group: 'Your program',
      },
    ],

    knowledgeFiles: [
      {
        name: 'A/B test analysis reference card',
        purpose:
          'Gives Claude a compact checklist of statistical validity checks, significance criteria, ' +
          'and ship/no-ship decision rules — so analysis outputs are consistent and don\'t skip ' +
          'the validity threats that most commonly invalidate A/B tests.',
        kind: 'starter',
        content: `# A/B test analysis reference card

## Required inputs for a valid analysis
- Sample size: number of users in control and variant (must match the assignment log, not just the event count)
- Metric value: conversion rate, mean, or rate for each group
- Test duration: start and end date
- Assignment method: random assignment confirmed? (If not, the test is observational, not experimental)

## Statistical significance checklist
1. **Sample ratio mismatch (SRM) check:** Control and variant sizes should match the planned split (e.g., 50/50) within ±1%. An SRM indicates a bucketing bug — do not interpret results until resolved.
2. **Minimum detectable effect (MDE):** Was the test run long enough to detect the target effect size? Stopping early inflates false positives.
3. **Test statistic:** Use a two-proportion z-test for conversion/CTR; use a t-test or Mann-Whitney for continuous metrics (revenue, session length).
4. **Two-tailed vs. one-tailed:** Default to two-tailed unless the team committed to one-tailed before the test started.

## Validity threats to check in every analysis
- **Peeking:** Was the result evaluated multiple times during the test? Each look inflates the false positive rate.
- **Novelty effect:** Did users interact with the variant more just because it was new? Watch for a declining effect in week 2+.
- **Segment imbalance:** Are control and variant evenly distributed across key segments (device, country, plan tier)?
- **Multiple comparisons:** If multiple metrics were tested, apply a Bonferroni correction or note the inflated false positive risk.
- **Network effects:** Can users in control and variant influence each other? (Relevant for social or referral features.)

## Ship / no-ship decision framework
- Statistically significant AND practically meaningful (effect size > MDE) → candidate to ship
- Statistically significant BUT effect too small to matter → probably do not ship; confirm with stakeholders
- Not statistically significant → do not conclude "no effect" — the test may be underpowered
- Any validity threat unresolved → do not ship until threat is resolved or understood

## Key formulas (for reference)
- Relative lift: (variant rate − control rate) / control rate × 100%
- Absolute lift: variant rate − control rate
- Confidence interval for a proportion: p ± z * sqrt(p(1−p)/n), where z = 1.96 for 95%
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-ab-test-analyzer-scenario-1',
        title: 'Checkout button color test',
        userInput:
          'We ran an A/B test on our checkout button color for 14 days. ' +
          'Control (blue button): 12,400 users, 6.2% conversion. ' +
          'Variant (green button): 12,100 users, 6.8% conversion. ' +
          'Is this significant at 95% confidence? Should we ship it?',
        expectedBehavior:
          'Claude should run a two-proportion z-test and correctly compute whether the 0.6 percentage ' +
          'point lift (6.2% to 6.8%) is statistically significant at 95% confidence with sample sizes of ~12,000. ' +
          'It should check for sample ratio mismatch (12,400 vs 12,100 — slight imbalance, worth noting). ' +
          'It should distinguish statistical significance from the business value of a ~10% relative lift ' +
          'on the checkout conversion rate, and advise the team on the ship decision.',
        mustContain: ['12,400', '12,100', '6.2%', '6.8%', 'checkout button'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-ab-test-analyzer-scenario-2',
        title: 'Pricing page revenue per user test',
        userInput:
          'Our A/B test on a new pricing page ran for 21 days. ' +
          'Control: 8,900 users, $42 average revenue per user. ' +
          'Variant (highlighted annual plan): 9,100 users, $49 average revenue per user. ' +
          'What should we conclude?',
        expectedBehavior:
          'Claude should note that revenue per user is a continuous metric and recommend a t-test ' +
          'rather than a proportion test, flagging that it cannot run the t-test without the standard ' +
          'deviation of revenue in each group. It should compute the relative lift ($42 to $49 is ~16.7%) ' +
          'and note this is practically significant if confirmed. It must flag that 21 days may capture ' +
          'a novelty effect from the highlighted annual plan and recommend checking week-over-week stability.',
        mustContain: ['8,900', '$42', '$49', 'annual plan', 'pricing page'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 6. Metric Definition Doc ─────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-metric-definition-doc-v1',
    slug: 'data-analyst-metric-definition-doc',
    name: 'Metric Definition Doc',
    tagline: 'Write a precise, unambiguous definition for any business metric',
    description:
      'Produce a complete metric definition document: plain-English formula, grain, date scope, ' +
      'inclusion/exclusion rules, a worked example, and the two or three most common calculation ' +
      'mistakes. Prevents the "we all measure this differently" problem before it causes a meeting.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['metrics', 'data', 'documentation', 'business-intelligence', 'reporting', 'definitions'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a metric definition writer. Produce precise, unambiguous metric documentation.

Metric name: {{metricName}}
Business area: {{businessArea}}
Target audience for this doc: {{docAudience}}

Rules:
1. Include in every definition: plain-English definition, formula (in words), grain, default date scope, inclusion/exclusion rules, and known limitations.
2. Provide a worked example with concrete numbers showing exactly how the metric is calculated.
3. List at least two common calculation mistakes or misinterpretations and how to avoid them.
4. Never assume a standard definition exists — always make the formula and business rules explicit. If the definition could vary by business context, state the assumption and ask for confirmation.`,

    variables: [
      {
        key: 'metricName',
        label: 'Metric name',
        type: 'text',
        required: true,
        helpText: 'The name of the metric to define. Examples: Monthly Active Users, Net Revenue Retention, Checkout Conversion Rate.',
        group: 'Metric details',
      },
      {
        key: 'businessArea',
        label: 'Business area',
        type: 'select',
        options: ['Product', 'Revenue / Finance', 'Marketing', 'Customer support', 'Operations', 'Engineering'],
        default: 'Product',
        required: true,
        helpText: 'The team or function this metric belongs to. This shapes which business rules and edge cases Claude highlights.',
        group: 'Metric details',
      },
      {
        key: 'docAudience',
        label: 'Documentation audience',
        type: 'select',
        options: ['Analysts only', 'Analysts and engineers', 'All stakeholders (including non-technical)'],
        default: 'All stakeholders (including non-technical)',
        required: true,
        helpText: 'Who needs to understand this definition? "All stakeholders" means jargon-free language and a clear worked example.',
        group: 'Metric details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Metric definition template and reference card',
        purpose:
          'Gives Claude a consistent structure for metric definitions so every doc produced ' +
          'covers the same required sections — preventing the common problem of teams discovering ' +
          'they define the same metric differently months after it was instrumented.',
        kind: 'starter',
        content: `# Metric definition template

Use this structure for every metric definition document.

---

## [Metric Name]

### Plain-English definition
[One or two sentences: what does this number measure, and why does it matter to the business?]

### Formula
[Describe the formula in words — not code. Example: "Divide the number of users who performed at least one qualifying event in the 30-day window by the total number of registered users as of the last day of that window."]

### Grain
One row in the underlying data = one [user / order / session / event / day].
The metric is computed at the [user / account / day / week / month] level.

### Default date scope
[What window does the metric cover by default? Example: "Rolling 30-day window ending on the reporting date, in UTC."]

### Inclusion rules
- [Who or what IS counted? Be specific: active paying customers, trial users, etc.]

### Exclusion rules
- [Who or what is NOT counted? Internal users, cancelled accounts, test events, etc.]

### Worked example
[Show the calculation with concrete numbers. Example: "In June 2026, 12,400 users opened the app at least once. Total registered users as of June 30 = 58,000. MAU = 12,400 / 58,000 = 21.4%."]

### Known limitations
- [List 2–3 things this metric does NOT capture or where it can mislead.]

### Common mistakes
1. [Mistake 1 and how to avoid it]
2. [Mistake 2 and how to avoid it]

### Related metrics
- [List 2–3 metrics commonly confused with or compared against this one]

---

## Metric governance
- Owner: [team or individual responsible for maintaining this definition]
- Last reviewed: [date]
- Approved by: [stakeholder who signed off]
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-metric-definition-doc-scenario-1',
        title: 'Define Monthly Active Users for a mobile app',
        userInput:
          'Write a precise metric definition for Monthly Active Users (MAU) for our mobile app. ' +
          'We define an active user as someone who opens the app at least once in the calendar month.',
        expectedBehavior:
          'Claude should produce a full definition document following the standard structure: plain-English ' +
          'definition, formula (users with >= 1 app open event / total registered users or total distinct ' +
          'user IDs — Claude should ask which denominator is intended), grain, default date scope (calendar ' +
          'month or rolling 30 days — Claude should flag this ambiguity), inclusion/exclusion rules, a worked ' +
          'example with concrete numbers, and at least two common mistakes (e.g., confusing calendar MAU ' +
          'with rolling 30-day MAU, double-counting users who reinstall).',
        mustContain: ['Monthly Active Users', 'MAU', 'mobile app', 'opens the app at least once'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-metric-definition-doc-scenario-2',
        title: 'Define Net Revenue Retention for SaaS',
        userInput:
          'Define Net Revenue Retention (NRR) for our SaaS product. We need a definition our ' +
          'sales team and engineering team can both agree on and use consistently.',
        expectedBehavior:
          'Claude should define NRR as expansion + contraction + churn against a beginning-of-period ' +
          'cohort, provide the formula in words, and give a worked example using concrete monthly revenue ' +
          'numbers. It must flag that NRR is always computed on a fixed cohort (not new customers added ' +
          'in the period), and call out the most common mistake: including new logo revenue in the numerator. ' +
          'The language should be accessible to a sales team, not just analysts.',
        mustContain: ['Net Revenue Retention', 'NRR', 'SaaS product', 'sales team and engineering team'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 7. Data Cleaning Plan ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-data-cleaning-plan-v1',
    slug: 'data-analyst-data-cleaning-plan',
    name: 'Data Cleaning Plan',
    tagline: 'Turn a messy dataset into a step-by-step cleaning plan with verification checks',
    description:
      'Produce a structured data cleaning plan from a description of the dataset and its quality issues. ' +
      'Triages problems by severity, specifies detection method and fix logic for each, and ends with ' +
      'a row-level audit to confirm the clean dataset is correct.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['data-quality', 'data-cleaning', 'etl', 'data', 'sql', 'data-engineering'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a data cleaning plan writer. Produce a structured, actionable cleaning plan.

Data source: {{dataSource}}
Downstream use: {{downstreamUse}}
Cleaning tool: {{cleaningTool}}

Known quality issues described by the user:
{{knownIssues}}

Rules:
1. Triage every issue by severity: blocking (analysis is wrong without fixing), major (results are biased), minor (cosmetic).
2. For each issue specify: detection method, fix logic in {{cleaningTool}}, and how to verify the fix worked.
3. End the plan with a row-level audit — expected row count, primary key uniqueness check, and value range checks for key columns.
4. Never recommend silently dropping rows without flagging the volume lost and its potential effect on downstream results. State all assumptions explicitly.`,

    variables: [
      {
        key: 'dataSource',
        label: 'Data source',
        type: 'text',
        required: true,
        helpText: 'Where does this data come from? Examples: "CRM export (CSV)", "PostgreSQL events table", "Google Sheets survey results", "API JSON dump".',
        group: 'Dataset details',
      },
      {
        key: 'knownIssues',
        label: 'Known quality issues',
        type: 'multiline',
        required: true,
        helpText: 'Describe every data quality problem you have already noticed. The more specific, the better. Examples: "dates in three formats", "~5% of rows have a null email", "country names are inconsistent (US, USA, United States)".',
        group: 'Dataset details',
      },
      {
        key: 'downstreamUse',
        label: 'Downstream use',
        type: 'select',
        options: ['SQL analysis', 'Machine learning model', 'Dashboard / reporting', 'Executive presentation', 'Data export / integration'],
        default: 'SQL analysis',
        required: true,
        helpText: 'What happens after cleaning? This determines how strict the cleaning needs to be and which issues are blocking vs. acceptable.',
        group: 'Dataset details',
      },
      {
        key: 'cleaningTool',
        label: 'Cleaning tool',
        type: 'select',
        options: ['SQL (specify dialect in schema context)', 'Python (pandas)', 'R (dplyr)', 'Excel / Google Sheets', 'dbt'],
        default: 'Python (pandas)',
        required: true,
        helpText: 'The tool you will use to apply the cleaning steps. Claude will write fix logic in this tool.',
        group: 'Your setup',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Data cleaning checklist and reference card',
        purpose:
          'Gives Claude a structured triage framework and a standard set of checks to run on any dataset, ' +
          'so cleaning plans are thorough and consistent rather than addressing only the issues the user already noticed.',
        kind: 'starter',
        content: `# Data cleaning checklist and reference card

## Triage severity levels
- **Blocking:** Leaving the issue unfixed produces wrong answers. Fix before any analysis.
  Examples: duplicate primary keys, dates in wrong timezone, join key mismatch
- **Major:** Results are systematically biased. Fix before sharing outputs.
  Examples: non-random missingness in key columns, encoding errors that corrupt string comparisons
- **Minor:** Cosmetic or low-impact. Document and fix if time allows.
  Examples: inconsistent capitalization, trailing whitespace, unused columns

## Standard checks to run on every dataset

### Structure checks
- Row count: does it match the expected volume? (Compare to source system or prior extract)
- Primary key uniqueness: count(distinct id) = count(*)?
- Column list: expected columns all present? No unexpected extras?
- Data types: are numeric columns actually numeric? Are date columns parsed as dates?

### Null / missing value checks
- Which columns have nulls? What % of rows?
- Is the missingness random or systematic? (e.g., all nulls in one date range → data pipeline gap)
- What is the correct treatment: exclude, impute, or flag as unknown?

### Format and encoding checks
- Date formats: standardize to ISO 8601 (YYYY-MM-DD or timestamptz) in UTC
- String encoding: check for mojibake (garbled UTF-8), curly quotes, non-breaking spaces
- Numeric formatting: strip currency symbols and commas before parsing
- Categorical consistency: normalize free-text fields (US / USA / United States → United States)

### Value range checks
- Numeric columns: min, max, mean, p5, p95 — do they match expected ranges?
- Date columns: min and max dates within expected bounds?
- Categorical columns: are all values in the expected set? Any unexpected "Other" or blank values?

## Verification audit (run after cleaning)
1. Row count: clean count vs. raw count — document every row dropped and why
2. Primary key: confirm uniqueness on the clean dataset
3. Null check: confirm null counts are at or below the accepted threshold for each column
4. Value range: spot-check p5/p95 for key numeric columns — compare to raw dataset
5. Join test: if the clean dataset will be joined to another table, confirm join key overlap is > 95%
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-data-cleaning-plan-scenario-1',
        title: 'Clean a CRM export with date and country issues',
        userInput:
          'I have a CSV export from our CRM with 45,000 rows of customer data. ' +
          'Problems I can see: about 800 rows have no email address, dates are in three different ' +
          'formats (MM/DD/YYYY, YYYY-MM-DD, and some with timestamps), and the country column ' +
          'has duplicates like US, USA, and United States. Help me plan how to clean this.',
        expectedBehavior:
          'Claude should triage the three issues: missing email (major — affects any email-based join), ' +
          'inconsistent dates (blocking — analysis on date columns will fail), country naming (minor to major ' +
          'depending on downstream use). For each it should specify detection (e.g., regex to identify format), ' +
          'fix logic in the chosen cleaning tool, and a verification step. It should ask whether the 800 ' +
          'missing email rows should be excluded or retained with a null flag.',
        mustContain: ['45,000 rows', 'email address', 'MM/DD/YYYY', 'country', 'United States'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-data-cleaning-plan-scenario-2',
        title: 'Clean an events table for retention analysis',
        userInput:
          'We have an events table with 2.3 million rows. I found duplicate event IDs ' +
          '(same event fired twice within 1 second), some user_ids that do not exist in ' +
          'our users table, and timestamps that are in local time instead of UTC. ' +
          'We need this clean for a retention analysis.',
        expectedBehavior:
          'Claude should triage: duplicate event IDs (blocking — retention calculation will double-count), ' +
          'orphaned user_ids (major — retention denominators will be wrong), local time timestamps ' +
          '(blocking — cohort assignment will be wrong across timezones). It should specify a deduplication ' +
          'strategy (keep the first event within the 1-second window), a referential integrity check, and ' +
          'a timezone conversion approach. The plan must end with a row-count audit.',
        mustContain: ['2.3 million rows', 'duplicate event IDs', 'user_ids', 'UTC', 'retention analysis'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 8. Stakeholder Report Writer ─────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-stakeholder-report-v1',
    slug: 'data-analyst-stakeholder-report',
    name: 'Stakeholder Report Writer',
    tagline: 'Frame data findings as a report a non-technical audience will actually act on',
    description:
      'Structure a data report for executives, boards, or business leaders. Leads with the ' +
      'recommendation, limits metrics per page, and frames every number with context ' +
      '(vs. plan, vs. prior period). Eliminates the "data dump" format that loses stakeholder attention.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['reporting', 'stakeholders', 'communication', 'data', 'executives', 'presentations'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a stakeholder report writer for {{stakeholderAudience}} audiences. Report cadence: {{reportCadence}}.

Report purpose: {{reportPurpose}}

Rules:
1. Lead with the recommendation or key finding — place methodology and data details in a supporting section or appendix.
2. Use no more than 3 key metrics per page or section; {{stakeholderAudience}} audiences lose focus with data overload.
3. Frame every metric with comparison context: vs. prior period, vs. plan or target, or vs. industry benchmark when available.
4. Never include a number without its source period and date range. State assumptions explicitly and flag data gaps rather than filling them in.`,

    variables: [
      {
        key: 'stakeholderAudience',
        label: 'Stakeholder audience',
        type: 'select',
        options: ['CEO / exec team', 'Board of directors', 'Sales leadership', 'Marketing leadership', 'Product leadership', 'Investors'],
        default: 'CEO / exec team',
        required: true,
        helpText: 'Who is this report for? Each audience has different expectations for depth, vocabulary, and the kind of action they want to take.',
        group: 'Report context',
      },
      {
        key: 'reportCadence',
        label: 'Report cadence',
        type: 'select',
        options: ['One-time deep dive', 'Weekly', 'Monthly', 'Quarterly'],
        default: 'Monthly',
        required: true,
        helpText: 'How often is this report published? Cadence shapes which comparison periods to include and how much trend context is needed.',
        group: 'Report context',
      },
      {
        key: 'reportPurpose',
        label: 'Report purpose',
        type: 'multiline',
        required: true,
        helpText: 'What decision or question is this report answering? Be specific. "Show Q2 performance" is weak; "Help the exec team decide whether to accelerate hiring in Q3" is better.',
        group: 'Report context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Stakeholder report structure reference card',
        purpose:
          'Gives Claude a set of proven report structures and framing principles for non-technical ' +
          'audiences — so every report leads with the decision, not the data, and uses the right ' +
          'comparison context for each metric.',
        kind: 'starter',
        content: `# Stakeholder report structure reference card

## The three-section structure
1. **Headline (1 slide / section):** The most important finding or recommendation, in plain English. One sentence. No jargon.
2. **Evidence (2–5 slides / sections):** The three metrics that most directly support the headline. Each metric includes: current value, prior-period comparison, trend direction, and the business implication.
3. **Appendix:** Full data tables, methodology notes, caveats, and definitions for anyone who wants to verify the evidence.

## What to include per metric (the context rule)
Every metric in a stakeholder report needs at least one context anchor:
- vs. prior period (last week, last month, last quarter)
- vs. plan or target ("we budgeted $X, we delivered $Y")
- vs. benchmark ("industry average is Z%")
- vs. prior year (for seasonal businesses)

Without context, numbers are meaningless. "$420,000 MRR" tells you nothing. "$420,000 MRR, up 6.4% month-over-month and 2% ahead of plan" tells you whether to be concerned.

## Audience-specific framing

**CEO / exec team**
- Lead with business health and risk, not metrics
- One recommendation per section
- Dollar impact and customer count preferred over percentages alone

**Board of directors**
- Show trend over 4+ quarters, not just the most recent period
- Flag every deviation from plan, even positive ones
- Include a "what could go wrong" section — boards expect risk awareness

**Investors**
- Lead with retention and growth metrics (ARR, NRR, logo retention)
- Benchmark against industry standards where possible
- Address burn and runway if relevant

**Sales / marketing leadership**
- Pipeline and conversion metrics first
- Campaign or channel attribution clearly labeled
- Highlight actions the team can take in the next 30 days

## Common mistakes to avoid
- Data dump: more than 5 metrics per section loses the audience
- Missing comparison: a standalone number without context is not a finding
- Buried lede: the key insight is on slide 7; it should be on slide 1
- Fabricated precision: "23.7% conversion rate" implies more accuracy than most datasets support; round appropriately
- No "so what": every section should end with an implication or a question for the team
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-stakeholder-report-scenario-1',
        title: 'Monthly business review for the exec team',
        userInput:
          'Help me write a monthly business review report for our executive team. ' +
          'We want to cover: MRR grew from $420,000 to $447,000, churn rate held steady at 2.1%, ' +
          'and we added 38 new enterprise customers. What is the best structure and framing?',
        expectedBehavior:
          'Claude should propose a three-section structure: headline (MRR growth and what it implies for ' +
          'the quarter run-rate), evidence (MRR with month-over-month and any plan comparison, churn context ' +
          'for what 2.1% means annualized, and the enterprise customer count with prior-month comparison), ' +
          'and appendix. It should flag that without a plan or target for these metrics the framing is weaker, ' +
          'and ask for the target or prior-month enterprise customer count for comparison.',
        mustContain: ['$420,000', '$447,000', 'churn rate', '2.1%', '38 new enterprise customers'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-stakeholder-report-scenario-2',
        title: 'Q2 product metrics for the board',
        userInput:
          'I need to present our Q2 product metrics to the board. Key numbers: DAU up 22% ' +
          'year-over-year, NPS improved from 31 to 44, support ticket volume down 18%. ' +
          'The board wants to know if the product is healthy.',
        expectedBehavior:
          'Claude should structure the board presentation to lead with a clear "yes, the product is healthy" ' +
          'or a qualified assessment, supported by the three metrics. It should frame DAU growth of 22% YoY ' +
          'with context (is this faster or slower than prior quarters?), note that NPS 31→44 is a meaningful ' +
          'improvement but still below the typical SaaS benchmark of 40–50, and frame the ticket volume drop ' +
          'as a leading indicator of product quality improvement. It should flag what data is missing to give ' +
          'a complete board-level picture (churn, ARR trend, MAU alongside DAU).',
        mustContain: ['Q2', 'DAU', '22%', 'NPS', '31 to 44'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 9. Cohort Analysis Framer ────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-cohort-analysis-framer-v1',
    slug: 'data-analyst-cohort-analysis-framer',
    name: 'Cohort Analysis Framer',
    tagline: 'Frame a cohort analysis approach before writing a single line of code',
    description:
      'Define the cohort unit, observation window, outcome metric, and expected output structure ' +
      'for a cohort analysis — before any SQL or charts. Flags immature cohorts, normalization ' +
      'requirements, and the comparison logic upfront so the analysis is set up to answer the right question.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['cohort-analysis', 'retention', 'data', 'product-analytics', 'sql', 'user-behavior'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a cohort analysis framer. Your job is to define the approach before any implementation begins.

Cohort definition: {{cohortDefinition}}
Outcome metric: {{outcomeMetric}}

Analysis goal: {{analysisGoal}}

Rules:
1. Define the cohort unit (one row = one user in one cohort), the observation window, and the qualifying event before describing any query or output.
2. Flag immature cohorts — cohorts that have not had enough time to reach the full observation window must be excluded or labeled as incomplete.
3. Describe the expected shape of the output (cohort × time period matrix) before suggesting any implementation steps.
4. Never compare cohorts of different sizes without normalizing to rates. Never fabricate behavioral patterns or retention curves. State all assumptions explicitly.`,

    variables: [
      {
        key: 'cohortDefinition',
        label: 'Cohort definition',
        type: 'select',
        options: [
          'Signup date (weekly cohorts)',
          'Signup date (monthly cohorts)',
          'First purchase date (monthly cohorts)',
          'First active date (weekly cohorts)',
          'Plan upgrade date (monthly cohorts)',
        ],
        default: 'Signup date (weekly cohorts)',
        required: true,
        helpText: 'What event defines when a user enters a cohort? Weekly cohorts give more granularity; monthly cohorts are easier to read.',
        group: 'Analysis setup',
      },
      {
        key: 'outcomeMetric',
        label: 'Outcome metric',
        type: 'text',
        required: true,
        helpText: 'What are you measuring per cohort over time? Examples: "30-day retention rate", "cumulative revenue per user", "90-day churn rate", "feature adoption at 7 days".',
        group: 'Analysis setup',
      },
      {
        key: 'analysisGoal',
        label: 'Analysis goal',
        type: 'multiline',
        required: true,
        helpText: 'What question is this cohort analysis answering? The more specific the question, the better Claude can design the right framing.',
        group: 'Analysis setup',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Cohort analysis framing reference card',
        purpose:
          'Gives Claude a step-by-step framing checklist and output shape templates for cohort analyses, ' +
          'so every analysis is set up with the right grain, handles immature cohorts correctly, ' +
          'and produces a matrix that answers the original question.',
        kind: 'starter',
        content: `# Cohort analysis framing reference card

## Four questions to answer before writing any code

1. **What event defines cohort entry?**
   - Must be a discrete, one-time event per user (signup, first purchase, first active day)
   - If a user can re-enter a cohort (e.g., reactivation), decide whether to treat re-entry as a new cohort or exclude it

2. **What is the outcome metric?**
   - Retention: did the user perform the qualifying event in period N after cohort entry?
   - Revenue: what is the cumulative or per-period revenue attributed to users in this cohort?
   - Adoption: did the user reach a milestone (e.g., used feature X) within the observation window?

3. **What is the observation window?**
   - The full window must have elapsed for a cohort to be mature
   - Example: for 90-day retention, a cohort from 60 days ago is immature — exclude or label it
   - Rule: immature cohorts in the visualization must be visually distinct (greyed out, asterisked)

4. **What is the output shape?**
   - Standard cohort matrix: rows = cohort periods (weeks or months), columns = time since cohort entry (Day 0, Day 7, Day 30, Day 90)
   - Each cell = rate (%) or absolute count for that cohort at that time period
   - Always show rates, not absolute counts, when comparing cohorts of different sizes

## Normalization rules
- Always divide by cohort size to get a rate before comparing cohorts
- Never state "cohort A retained 1,200 users vs cohort B retained 800 users" without noting that cohort A was 3x larger
- When revenue is the outcome, use revenue per user (total cohort revenue / cohort size)

## Common mistakes in cohort analysis
1. **Comparing raw counts across cohorts of different sizes** — use rates
2. **Including immature cohorts in trend conclusions** — flag and exclude them
3. **Choosing the wrong qualifying event** — "last seen" is not the same as "performed qualifying action"
4. **Ignoring multi-device or account-merging edge cases** — the same person in two cohorts inflates retention
5. **Confusing calendar cohorts with rolling windows** — clarify which is intended before building

## Expected output shape (example)
| Cohort | Size | Day 0 | Day 7 | Day 30 | Day 90 |
|---|---|---|---|---|---|
| 2026-W01 | 840 | 100% | 42% | 28% | 19% |
| 2026-W02 | 910 | 100% | 39% | 25% | 18% |
| 2026-W03 | 1,050 | 100% | 45% | 31% | * (immature) |
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-cohort-analysis-framer-scenario-1',
        title: 'Retention cohorts across onboarding redesign',
        userInput:
          'I want to understand how user retention changes across monthly signup cohorts. ' +
          'I am trying to figure out if users who signed up after we launched our onboarding redesign ' +
          'in April 2026 retain better at 30, 60, and 90 days than earlier cohorts.',
        expectedBehavior:
          'Claude should frame the analysis: monthly signup cohorts, retention at days 30/60/90 as the outcome ' +
          'metrics, and the qualifying retention event (which Claude should ask about if not specified). ' +
          'It should note that cohorts signed up after April 2026 may be immature for the 90-day window ' +
          '(today is July 2026, so a May cohort only has ~60 days of data). It must recommend a pre/post ' +
          'comparison and flag the need to control for seasonality and other changes made around April.',
        mustContain: ['monthly signup cohorts', 'onboarding redesign', 'April 2026', '30, 60, and 90 days'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-cohort-analysis-framer-scenario-2',
        title: 'Annual vs monthly plan cohort comparison',
        userInput:
          'We want to do a cohort analysis to see if customers who started on an annual plan ' +
          'have higher 12-month retention and higher cumulative revenue than customers who ' +
          'started on a monthly plan.',
        expectedBehavior:
          'Claude should frame this as two parallel cohort series (annual plan starters vs monthly plan starters), ' +
          'both entering cohorts at first purchase date, measured at 12-month retention and cumulative revenue per user. ' +
          'It must flag that this is an observational comparison (customers self-select into plan types) and that ' +
          'selection bias is the key threat to validity. It should recommend normalizing by cohort size, ' +
          'checking cohort size balance between the two groups, and noting that annual plan customers are ' +
          'committed for 12 months by definition — which inflates their "retention" vs monthly customers.',
        mustContain: ['annual plan', '12-month retention', 'cumulative revenue', 'monthly plan'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 10. Data Dictionary Builder ───────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-data-analyst-data-dictionary-builder-v1',
    slug: 'data-analyst-data-dictionary-builder',
    name: 'Data Dictionary Builder',
    tagline: 'Turn raw field descriptions into a complete, ready-to-share data dictionary',
    description:
      'Build a data dictionary entry from a list of table fields. Documents column name, type, ' +
      'description, example values, nullability, foreign key relationships, and business rules. ' +
      'Calibrates depth to the target audience and flags derived or calculated fields explicitly.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['data-dictionary', 'documentation', 'data', 'schema', 'data-governance', 'sql'],
    category: 'data',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a data dictionary writer. Document database tables and fields clearly and completely.

Table or dataset being documented: {{tableSource}}
Documentation audience: {{docAudience}}
Detail level: {{detailLevel}}

Rules:
1. For each field include: column name, data type, description, nullability, and (at {{detailLevel}} detail) business rules and known issues.
2. Flag foreign key relationships, enumerated value sets, and calculated or derived columns explicitly — never describe a derived column as a raw source field.
3. Note any fields whose meaning is ambiguous or context-dependent; ask for clarification rather than guessing.
4. Never invent field names, data types, or business logic not provided in the input. State assumptions explicitly.`,

    variables: [
      {
        key: 'tableSource',
        label: 'Table or dataset name',
        type: 'text',
        required: true,
        helpText: 'Which table or dataset are you documenting? Examples: "orders table", "events table", "user_profiles view".',
        group: 'Dataset details',
      },
      {
        key: 'docAudience',
        label: 'Documentation audience',
        type: 'select',
        options: ['Engineering team', 'Data / analytics team', 'Business analysts', 'All stakeholders'],
        default: 'All stakeholders',
        required: true,
        helpText: 'Who will read this dictionary? "All stakeholders" means jargon-free descriptions; "Engineering team" can include technical implementation notes.',
        group: 'Dataset details',
      },
      {
        key: 'detailLevel',
        label: 'Detail level',
        type: 'select',
        options: [
          'Brief (name + type + one-line description)',
          'Standard (name + type + description + example value)',
          'Full (name + type + description + example + business rules + known issues)',
        ],
        default: 'Standard (name + type + description + example value)',
        required: true,
        helpText: 'How much detail per field? "Full" is best for high-traffic or frequently misunderstood tables. "Brief" works for a quick schema reference.',
        group: 'Dataset details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Data dictionary entry template and reference card',
        purpose:
          'Gives Claude a consistent per-field template and a set of common gotchas to document, ' +
          'so every data dictionary entry covers the same required information and flags ' +
          'the things that most commonly confuse new users of the table.',
        kind: 'starter',
        content: `# Data dictionary entry template

## Per-field entry structure

### [column_name]
- **Data type:** e.g., bigint, varchar(255), timestamptz, jsonb, boolean, uuid
- **Nullable:** Yes / No
- **Description:** Plain-English explanation of what this field contains and why it exists.
- **Example value:** A realistic (non-PII) example. For enums, list all possible values.
- **Business rules:** (Full detail level only)
  - How is this field populated? (source system, calculation, default)
  - When is it null vs. empty string vs. zero? Document the difference.
  - Any constraints or invariants the field must satisfy?
- **Known issues:** (Full detail level only)
  - Gaps in historical data (e.g., "null before 2024-01-01 due to migration")
  - Edge cases or common misuses

## Flags to add to special column types

**Primary key:** Mark as PK. Note if it is surrogate (auto-generated) or natural (business key).

**Foreign key:** "References [table].[column]. Join on this key to get [description of related data]."

**Derived / calculated column:** "Calculated as [formula in plain English]. Not a raw source field — do not use as a join key."

**Enumerated values (enum / varchar with a fixed set):** List every valid value and its meaning.
Example for status: 'pending' = order received but not yet processed; 'shipped' = order handed to carrier; 'delivered' = carrier confirmed delivery; 'cancelled' = order cancelled before shipment.

**Timestamps:** Always note the timezone. Example: "Stored as timestamptz in UTC. Convert to local time in the application layer."

**Monetary amounts stored as integers:** "Stored in cents (integer). Divide by 100 to get the dollar amount. Example: 4999 = $49.99."

## Common documentation mistakes to avoid
- Describing a derived column as if it were a source field
- Omitting the timezone for timestamp columns
- Listing only the column name without explaining what it means to a new user
- Not documenting enum values (leaving readers to guess what 'status = 3' means)
- Not flagging nullability — a nullable FK is a very different column from a non-nullable one
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'data-analyst-data-dictionary-builder-scenario-1',
        title: 'Document the orders table',
        userInput:
          'Help me write a data dictionary entry for these fields in our orders table: ' +
          'order_id (bigint, primary key), user_id (bigint, foreign key to users.user_id), ' +
          'status (varchar: pending, shipped, delivered, cancelled), ' +
          'amount_cents (integer, order total in cents), created_at (timestamptz).',
        expectedBehavior:
          'Claude should produce a structured entry for each of the five fields. It should ' +
          'mark order_id as PK, user_id as FK with the join target, document all four status enum values ' +
          'with plain-English meanings, note that amount_cents should be divided by 100 for dollar display, ' +
          'and note that created_at is timestamptz (ask about timezone if not stated). ' +
          'It should ask whether any fields are nullable and whether amount_cents is ever zero or negative.',
        mustContain: ['orders table', 'order_id', 'user_id', 'amount_cents', 'created_at'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'data-analyst-data-dictionary-builder-scenario-2',
        title: 'Document the events table',
        userInput:
          'I need a data dictionary for the events table. Fields: event_id (uuid), ' +
          'user_id (uuid, nullable for anonymous events), event_name (varchar), ' +
          'event_timestamp (timestamptz, UTC), properties (jsonb, event-specific payload), ' +
          'session_id (uuid, nullable).',
        expectedBehavior:
          'Claude should document all six fields. It must flag that user_id is nullable and explain ' +
          'the anonymous event use case. It should note that properties is a jsonb payload and that ' +
          'its schema varies by event_name — recommending that a separate per-event schema reference ' +
          'be created. It should document event_timestamp as UTC and warn against joining or filtering ' +
          'without timezone awareness. It should ask whether event_id is guaranteed unique.',
        mustContain: ['events table', 'event_id', 'event_name', 'event_timestamp', 'properties'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
