import type { Setup } from '@/lib/setup/types';

export const commitMessageSkillSetup: Setup = {
  kind: 'skill',
  id: 'curated-commit-message-skill-v1',
  slug: 'commit-message-skill',
  name: 'Commit Message Skill',
  tagline: 'Consistent, informative commit messages from your staged diff',
  description:
    'A Claude Code skill that reads your staged diff and produces a well-structured commit ' +
    'message following Conventional Commits format. The subject line is under 72 characters; ' +
    'the body explains the why, not just the what.',
  role: 'Engineering',
  industry: null,
  tags: ['git', 'commits', 'engineering', 'developer-tools', 'conventional-commits'],
  category: 'engineering',
  source: 'curated',
  author: null,
  version: '1.0.0',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  reviewStatus: 'approved',
  upvotes: 0,
  featured: 3,
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
      content: `# Commit Message Skill

## Purpose
Generate clear, consistent commit messages from staged changes, following the
Conventional Commits specification. The goal is a readable git history where
every commit answers: what changed, what type of change, and why.

## Trigger
Use this skill when asked to write, draft, or suggest a commit message.
Typical invocations:
- "Write a commit message for these changes"
- "Draft a commit message"
- \`/commit-msg\` in Claude Code

## Input
The skill expects one or both of:
1. The staged diff (output of \`git diff --staged\`)
2. A short description of what the change does

If neither is provided, ask for the diff before proceeding.

## Conventional Commits format

\`\`\`
<type>(<optional scope>): <short summary>

[optional body — explain WHY, not WHAT]

[optional footer — e.g. BREAKING CHANGE, closes #issue]
\`\`\`

### Type values

| Type | When to use |
|------|-------------|
| \`feat\` | A new feature visible to users or callers. |
| \`fix\` | A bug fix. |
| \`refactor\` | Internal restructure with no behaviour change. |
| \`test\` | Adding or improving tests only. |
| \`docs\` | Documentation only. |
| \`chore\` | Build scripts, config, dependency bumps with no production impact. |
| \`perf\` | Performance improvement with no behaviour change. |
| \`ci\` | CI/CD pipeline changes. |
| \`revert\` | Reverts a previous commit. |

### Rules for the subject line
- 72 characters maximum
- Imperative mood: "add X" not "added X" or "adding X"
- No trailing period
- Lowercase after the type/scope prefix

### Rules for the body (include when the why is not obvious)
- Wrap at 72 characters
- Explain the motivation and contrast with the previous behaviour
- Do not describe what you can already read in the diff

### Breaking changes
If the change breaks an existing API or contract, add a \`BREAKING CHANGE:\` footer
describing what changed and how callers should update.

## Output
Produce ONLY the commit message, inside a code block. Do not add commentary before or
after it unless explicitly asked. If you are uncertain about the type or scope, pick the
most likely and add a one-line note after the code block.

## Example output

\`\`\`
feat(auth): add OAuth 2.0 PKCE flow for mobile clients

The previous implicit grant flow is deprecated in OAuth 2.1 and blocked
by several mobile OS vendors. This replaces it with PKCE, which works
without a client secret and is safe for public clients.

closes #412
\`\`\`

## Commands (Claude Code)

- \`/commit-msg\` — Draft a commit message from the current staged diff.
- \`/commit-msg <description>\` — Draft a commit message from a prose description.
`,
    },
  ],
  capabilities: [
    {
      command: '/commit-msg',
      description: 'Draft a commit message from the staged diff or a prose description.',
    },
    {
      command: '/commit-msg <description>',
      description: 'Draft a commit message from a one-line description of the change.',
    },
  ],
};
