import type { Setup } from '@/lib/setup/types';

export const docsWritingHarnessSetup: Setup = {
  kind: 'harness',
  id: 'curated-docs-writing-harness-v1',
  slug: 'docs-writing-harness',
  name: 'Docs Writing Harness',
  tagline: 'Keep documentation in sync with your code, automatically',
  description:
    'A Claude Code project config and reference guide for maintaining technical documentation ' +
    'alongside code. Claude follows a docs-as-code workflow: every code change that affects a ' +
    'public API, config value, or user-facing behaviour is accompanied by a docs update in the ' +
    'same session. The workflow is instruction-driven, Claude follows this guide, not a ' +
    'mechanical gate.',
  role: 'Engineering',
  industry: null,
  tags: ['documentation', 'docs-as-code', 'engineering', 'claude-code', 'harness', 'writing'],
  category: 'writing',
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
      name: 'README.md',
      isPrimary: true,
      content: `# Docs Writing Harness

A Claude Code project configuration for keeping technical documentation in sync with code.

## What it does

When this harness is active, Claude Code treats documentation as a first-class deliverable.
The workflow is instruction-driven: Claude reads this README and treats it as the working
contract for the session.

- Every change to a public function signature, config option, or user-facing behaviour
  prompts Claude to check and update the relevant docs before marking the task done.
- Claude drafts, edits, and checks documentation using the voice and structure rules below.
- There is no mechanical block, Claude follows these instructions, so be explicit with it
  if a session needs to skip a docs update.

## Files in this harness

| File | Purpose |
|------|---------|
| \`README.md\` | This guide, Claude reads it as its working instructions |
| \`settings.json\` | Claude Code project settings, copy to \`.claude/settings.json\` |

## Setup

1. Copy \`settings.json\` to \`.claude/settings.json\` in your project root.
2. Open your project in Claude Code. Permission gates take effect as soon as
   the settings file is loaded.
3. Tell Claude where your docs live: "Our documentation is in the \`docs/\` directory."
   Claude will use that as its reference for the session.

If you use a separate docs site (e.g. Docusaurus, MkDocs, Mintlify), tell Claude
the file format upfront: "Docs are MDX files in \`docs/\`."

## Docs workflow

### When implementing a new feature
After the code is written and tests pass, Claude will:
1. Identify every public API, config value, or UI behaviour added or changed.
2. Check whether existing docs cover it.
3. Draft new or updated documentation before marking the task done.

### When reviewing existing docs
Tell Claude: "Audit docs for <module or feature>."

Claude will read the relevant source files and docs together, list discrepancies
(outdated params, missing config options, wrong return types), and offer to update them.

### Drafting a new doc page
Tell Claude: "Write docs for <feature/API>."

Claude will follow this page structure:
1. **Overview**, what it does and when to use it.
2. **Parameters / Options**, every configurable field, its type, and its default.
3. **Examples**, at least one working example with the expected output.
4. **Troubleshooting**, common errors and how to resolve them.

## Voice and style rules

Follow these rules in every documentation update:

- **Present tense:** "Returns a list" not "Will return a list."
- **Second person for instructions:** "Run \`npm install\`" not "The user should run."
- **Active voice:** "The function validates input" not "Input is validated by the function."
- **No jargon without a definition** on first use.
- **Code blocks for every command, snippet, and file path.**
- **Short paragraphs:** three sentences maximum before a break or a list.

## Commands

- \`/draft-docs <feature or API>\`, Draft documentation for a new feature, API, or
  config option following the page structure above.
- \`/audit-docs <module or feature>\`, Read source code and existing docs together,
  list discrepancies, and offer to fix them.
- \`/update-docs\`, Review recent code changes and update any docs that are now stale.

## Allowed bash commands

The harness permits file operations and common doc-build tools:

- All \`Read\`, \`Write\`, \`Edit\`, unrestricted
- \`Bash(npm run docs*)\`, build or serve the docs site
- \`Bash(npx markdownlint*)\`, lint Markdown files
- \`Bash(git diff*)\`, \`Bash(git status*)\`, inspect current changes

Destructive commands (\`rm -rf\`, \`git reset --hard\`) are blocked.
`,
    },
    {
      name: 'settings.json',
      isPrimary: false,
      content: `{
  "permissions": {
    "allow": [
      "Read(**)",
      "Write(**)",
      "Edit(**)",
      "Bash(npm run docs*)",
      "Bash(npx markdownlint*)",
      "Bash(git diff*)",
      "Bash(git status*)",
      "Bash(git log*)"
    ],
    "deny": [
      "Bash(git push*)",
      "Bash(git reset --hard*)",
      "Bash(git restore*)",
      "Bash(rm -rf*)"
    ]
  }
}
`,
    },
  ],
  capabilities: [
    {
      command: '/draft-docs',
      description: 'Draft documentation for a feature, API, or config option.',
    },
    {
      command: '/audit-docs',
      description: 'Check existing docs against source code and list discrepancies.',
    },
    {
      command: '/update-docs',
      description: 'Update documentation to reflect recent code changes.',
    },
  ],
};
