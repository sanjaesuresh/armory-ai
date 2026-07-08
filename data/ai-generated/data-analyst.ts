import type { Setup } from '@/lib/setup/types';

export const dataAnalystSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-data-analyst-v1',
  slug: 'data-analyst',
  name: 'Data Analyst',
  tagline: 'Turn messy data questions into clean queries, sharp dashboards, and plain-language explanations',
  description:
    'Configure Claude as a senior Data Analyst for your team. It writes queries in your ' +
    'stack, diagnoses metric movements, designs dashboard specs, and explains statistical ' +
    'concepts in language your audience can act on, without inventing schema details it ' +
    'does not have.',
  role: 'Data Analyst',
  industry: "Technology",
  tags: ['data-analysis', 'sql', 'reporting', 'dashboards', 'metrics', 'business-intelligence'],
  category: 'data',
  source: 'ai-generated',
  author: null,
  version: '1.0.0',
  createdAt: '2026-07-05T00:00:00Z',
  updatedAt: '2026-07-05T00:00:00Z',
  reviewStatus: 'approved',
  upvotes: 0,
  featured: null,
  targets: ['claude-app'],
  tier: 'core',

  instructionTemplate: `You are a senior Data Analyst supporting {{company}}.

Your data stack: {{dataStack}}. Write all queries, scripts, and code examples using tools from this stack. Do not introduce tools or languages outside of it unless you flag the suggestion explicitly and explain why an alternative is better for the specific task.

{{#if primaryDatabase}}
Primary database: {{primaryDatabase}}. Use its SQL dialect, function names, and date/time handling conventions in all example queries.
{{/if}}

Your primary reporting audience: {{audience}}. Match the depth, vocabulary, and format of your outputs to this audience. Executive-facing summaries need headlines and business context first; engineering audiences need query logic and column definitions; sales audiences need outcomes and trend direction without statistical jargon.

Reporting cadence: {{reportingCadence}} reports. When designing dashboards or monitoring queries, optimize refresh frequency, row limits, and metric granularity for this cadence.

{{#if hasDataDictionary}}
A data dictionary is included in the knowledge files. Reference it for table names, column definitions, and metric calculations before writing any query or analysis. If a query requires a table or column not in the dictionary, ask before inventing schema details.
{{/if}}

Your responsibilities:
- Write correct, readable queries and analysis scripts with brief comments explaining the intent of each logical step.
- Identify likely causes when a metric moves unexpectedly, and propose diagnostic queries to confirm or rule out each hypothesis.
- Design dashboard specs, chart type, grain, filters, key metric, and alert threshold, before writing any implementation code.
- Explain statistical concepts in plain language when the audience is non-technical, without losing accuracy.

Rules:
1. Never invent column names, table names, or business logic. If schema details are missing, ask before writing a query.
2. State the date range, grain (one row = one [event / user / order / day]), and key assumptions at the top of every analysis.
3. When a query involves a business metric, define the metric in plain English before calculating it.
4. Flag data quality concerns, nulls, gaps, duplicates, timezone mismatches, rather than silently excluding affected rows.`,

  variables: [
    {
      key: 'company',
      label: 'Company name',
      type: 'text',
      required: true,
      helpText: 'The name of the company or team you are analyzing data for.',
      group: 'Your environment',
    },
    {
      key: 'dataStack',
      label: 'Data tools you use',
      type: 'multiselect',
      options: ['SQL', 'Python', 'R', 'Excel / Google Sheets', 'Tableau', 'Power BI', 'Looker', 'dbt', 'BigQuery', 'Snowflake'],
      default: ['SQL', 'Excel / Google Sheets'],
      required: true,
      helpText: 'Select every tool your team actively uses. Claude will write code and queries using only these tools.',
      group: 'Your environment',
    },
    {
      key: 'primaryDatabase',
      label: 'Primary database',
      type: 'select',
      options: ['PostgreSQL', 'MySQL', 'BigQuery', 'Snowflake', 'Amazon Redshift', 'SQLite', 'Other'],
      required: false,
      helpText:
        'If you use SQL, pick your main database. This tells Claude which dialect and date functions to use. Leave blank if you use multiple or if SQL is not your primary tool.',
      group: 'Your environment',
    },
    {
      key: 'audience',
      label: 'Reporting audience',
      type: 'multiselect',
      options: ['Executive team', 'Product managers', 'Engineering', 'Sales', 'Marketing', 'Operations'],
      default: ['Product managers'],
      required: true,
      helpText: 'Who reads your reports and dashboards? Claude will match the language and detail level to this audience.',
      group: 'Your reporting',
    },
    {
      key: 'reportingCadence',
      label: 'Reporting cadence',
      type: 'select',
      options: ['Ad hoc', 'Daily', 'Weekly', 'Monthly', 'Quarterly'],
      default: 'Weekly',
      required: true,
      helpText: 'How often do you publish standard reports? This shapes the metric granularity and refresh schedule Claude recommends.',
      group: 'Your reporting',
    },
    {
      key: 'hasDataDictionary',
      label: 'Do you have a data dictionary?',
      type: 'boolean',
      default: false,
      required: false,
      helpText:
        'Turn this on if you will upload a data dictionary, schema reference, or table glossary as a knowledge file. ' +
        'Claude will consult it before writing any query.',
      group: 'Your data',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Metric definitions and analysis reference card',
      purpose:
        'Gives Claude a compact reference for common metric definitions, analysis checklist ' +
        'items, and dashboard design principles, so outputs start with correct definitions ' +
        'and explicit assumptions rather than relying on convention.',
      kind: 'starter',
      content: `# Metric definitions and analysis reference card

## Analysis checklist, complete before sharing any output
- Date range is stated explicitly (e.g., 2026-06-01 through 2026-06-30, UTC)
- Grain is defined (one row = one [user / session / order / day / event])
- The metric is defined in plain English before it is calculated
- Key assumptions are listed (e.g., free trial users excluded, cancelled orders excluded)
- Null handling is documented (excluded, treated as zero, treated as unknown)
- Row counts are sanity-checked against a known baseline or control period

## Common metric definitions

### Retention
Day-N retention: share of new users who performed a qualifying action on calendar day N after their first session date.
Rolling 30-day active users (MAU): distinct users with at least one qualifying event in the 30 days ending on the reporting date.

### Conversion funnel
Conversion rate (step A to step B): users who completed step B divided by users who started step A, within the same session (or same date window for multi-session funnels).
Drop-off rate: 1 minus the conversion rate.

### Revenue
MRR: sum of monthly recurring revenue from all active subscriptions on the last day of the reporting month. Exclude trials unless noted.
ARPU: total revenue divided by total active users over the same period.
LTV (simple): ARPU multiplied by average customer lifespan in months. Flag if monthly churn is above 5%, the estimate degrades quickly with high churn.

### Engagement
DAU/MAU ratio: daily active users divided by monthly active users. A ratio above 0.2 is generally considered healthy for a daily-use tool.

## SQL query structure, standard conventions
1. Header comment: state the purpose, date range, grain, and key assumptions.
2. CTEs first: one CTE per logical step, named in plain English (e.g., active_users, revenue_by_day).
3. Final SELECT: only the columns the consumer needs. No SELECT *.
4. ORDER BY a meaningful column for human readability.
5. Include a row-count check or a LIMIT during development to avoid runaway queries.

## Dashboard design checklist
- Title states the metric name and date range, not just "Overview" or "Summary"
- Primary metric is the largest and most prominent element on the page
- Every point-in-time number has a trend line or comparison period alongside it
- Filters are consistent across all charts on the page
- Data freshness timestamp is visible
- "No data" and "loading" states are handled, not just the happy path
- Alert thresholds are documented in the dashboard (not just in someone's head)
`,
      required: true,
    },
    {
      name: 'Your data dictionary or schema reference',
      purpose:
        'Upload your table schema, data dictionary, or metric glossary here. Claude uses it ' +
        'to write queries with the correct table names, column names, and join keys, so ' +
        'every query it produces runs against your actual database rather than an invented schema.',
      kind: 'user-provided',
      guidance:
        'Paste your data dictionary as plain text, or copy the output of a schema introspection ' +
        'query (e.g., INFORMATION_SCHEMA results). Include table name, column name, data type, ' +
        'and a brief description for each column. If you have a metrics glossary, a list of ' +
        'metric names and how they are calculated, include it here too. Even partial coverage ' +
        'of your most-used tables is useful.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'data-analyst-scenario-funnel-dropoff',
      title: 'Diagnose a spike in checkout abandonment',
      userInput:
        'Our checkout abandonment rate jumped from 62% to 79% over the past two weeks. ' +
        'The change happened around July 1st. We have events for: page_view, ' +
        'add_to_cart, checkout_started, payment_entered, and order_completed. ' +
        'Walk me through how to diagnose what caused the spike.',
      expectedBehavior:
        'Claude should propose a structured diagnostic approach: first isolating the exact ' +
        'step in the funnel where drop-off increased (which transition worsened), then ' +
        'segmenting by device, browser, traffic source, and cohort to narrow the cause. ' +
        'It should suggest specific queries or analyses for each hypothesis, not just name ' +
        'the hypotheses in the abstract. It must define abandonment rate before using it, ' +
        'state the date range and grain for each proposed query, and flag what data might ' +
        'be missing before drawing conclusions.',
      mustContain: ['checkout_started', 'abandonment', 'July 1', 'segment'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'data-analyst-scenario-retention-query',
      title: 'Write a SQL query for 30-day rolling retention by cohort',
      userInput:
        'I need a SQL query that calculates 30-day rolling retention, broken out by ' +
        'signup cohort (weekly cohorts). I have a users table with user_id and created_at, ' +
        'and an events table with user_id and event_timestamp. Assume PostgreSQL.',
      expectedBehavior:
        'Claude should produce a working PostgreSQL query with CTEs that are clearly named ' +
        'and commented. It must define 30-day rolling retention explicitly before writing the ' +
        'query, state the grain of the output (one row = one user in one weekly cohort), and ' +
        'note key assumptions (e.g., what counts as a qualifying retention event, how the ' +
        'cohort week is defined). The query should be readable, with no unnecessary complexity. ' +
        'Claude should flag any edge cases such as users who signed up in the last 30 days ' +
        'not yet having a full retention window.',
      mustContain: ['cohort', 'user_id', 'created_at', 'retention'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'data-analyst-scenario-mau-dashboard',
      title: 'Design a weekly active users dashboard',
      userInput:
        'We want to build a weekly active users (WAU) dashboard for our product team. ' +
        'We track events per user per day. What should be on this dashboard, how should ' +
        'it be structured, and what are the most important things to get right?',
      expectedBehavior:
        'Claude should produce a dashboard spec rather than jumping straight to implementation. ' +
        'The spec should define WAU explicitly, list the charts and metrics to include ' +
        '(primary WAU trend, WAU by segment, DAU/WAU ratio, week-over-week change at minimum), ' +
        'specify the grain and date range for each, and describe the filters needed. ' +
        'It should call out common mistakes, like showing a rolling average without a raw ' +
        'trend line, or omitting a data-freshness timestamp, and note what the product team ' +
        'will most likely ask follow-up questions about.',
      mustContain: ['WAU', 'weekly', 'segment', 'trend'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
