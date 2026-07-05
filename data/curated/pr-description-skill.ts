import type { Setup } from '@/lib/setup/types';

export const prDescriptionSkillSetup: Setup = {
  kind: 'skill',
  id: 'curated-pr-description-skill-v1',
  slug: 'pr-description-skill',
  name: 'PR Description Skill',
  tagline: 'Pull request descriptions that give reviewers context fast',
  description:
    'A Claude Code skill that reads your branch diff and writes a pull request description ' +
    'with a summary of changes, motivation, and a test plan. Saves the author time and helps ' +
    'reviewers understand the scope before diving into the diff.',
  role: 'Engineering',
  industry: null,
  tags: ['git', 'pull-requests', 'engineering', 'developer-tools', 'code-review'],
  category: 'engineering',
  source: 'curated',
  author: null,
  version: '1.0.0',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  reviewStatus: 'approved',
  upvotes: 0,
  featured: null,
  targets: [],
  tier: 'core',
  instructionTemplate: '',
  variables: [],
  knowledgeFiles: [],
  scenarios: [],
  repoUrl: null,
  artifactFiles: [
    {
      name: 'SKILL.md',
      isPrimary: true,
      content: `# PR Description Skill

## Purpose
Write clear, complete pull request descriptions from a branch diff or a summary of changes.
A good PR description lets reviewers understand the what, why, and how to test — before they
read a single line of the diff.

## Trigger
Use this skill when asked to write or draft a PR description.
Typical invocations:
- "Write a PR description for this branch"
- "Draft a pull request description"
- \`/pr-desc\` in Claude Code

## Input
Provide one or more of:
1. The commit log or branch diff (\`git log main..HEAD --oneline\` or \`git diff main..HEAD\`)
2. A prose description of what the PR does
3. A linked issue or ticket number

If none of these are provided, ask for the diff before proceeding.

## Output format

Produce a PR description in Markdown using this structure:

\`\`\`markdown
## Summary
<!-- 2–5 bullet points covering the main changes. Each bullet is one sentence.
     Focus on what changed and why, not how. -->

- ...
- ...

## Motivation
<!-- One or two sentences: what problem does this PR solve, or what improvement does it make?
     If this closes an issue, say so here. -->

## Changes
<!-- Optional — include if the diff is large or touches multiple distinct areas.
     Group related changes together. Skip this section for small, focused PRs. -->

### <Area or component name>
- ...

## Test plan
<!-- Checklist of steps a reviewer can follow to verify the changes work correctly.
     Include both manual and automated test steps. -->

- [ ] ...
- [ ] ...

## Notes for reviewers
<!-- Optional — flag anything the reviewer should pay particular attention to:
     a tricky algorithm, a non-obvious design choice, a known limitation. -->
\`\`\`

## Rules

- Write in the imperative: "Add X" not "Added X".
- Keep the Summary bullets under 100 characters each.
- Do not pad the description — omit sections that genuinely don't apply.
- Never invent test steps you cannot derive from the diff or description.
- If the PR closes an issue, link it: "Closes #<number>" in the Motivation section.
- If the PR includes a breaking change, add a **Breaking change** section and describe
  the migration path explicitly.

## Example output

\`\`\`markdown
## Summary

- Add rate-limiting middleware to all public API routes
- Expose a new \`X-RateLimit-Remaining\` response header
- Return 429 with a Retry-After header when the limit is exceeded

## Motivation

Unauthenticated endpoints were being hammered by scrapers, causing intermittent
latency spikes for real users. This closes #387.

## Test plan

- [ ] \`npm test\` passes (new middleware unit tests included)
- [ ] Hit \`/api/search\` more than 60 times in a minute from a single IP — expect 429
- [ ] Verify \`X-RateLimit-Remaining\` decrements correctly in the response headers
- [ ] Authenticated requests are not affected (separate limit per user token)
\`\`\`

## Commands (Claude Code)

- \`/pr-desc\` — Draft a PR description from the current branch diff vs main.
- \`/pr-desc <summary>\` — Draft a PR description from a prose summary.
`,
    },
  ],
  capabilities: [
    {
      command: '/pr-desc',
      description: 'Draft a PR description from the current branch diff vs main.',
    },
    {
      command: '/pr-desc <summary>',
      description: 'Draft a PR description from a prose summary of the changes.',
    },
  ],
};
