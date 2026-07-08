import type { Setup } from '@/lib/setup/types';

export const tddLoopHarnessSetup: Setup = {
  kind: 'harness',
  id: 'curated-tdd-loop-harness-v1',
  slug: 'tdd-loop-harness',
  name: 'TDD Loop Harness',
  tagline: 'Enforce red-green-refactor discipline in every Claude Code session',
  description:
    'A starter Claude Code project config and README instructions that keep Claude in a ' +
    'test-first loop. Copy the settings to .claude/settings.json to gate tool permissions ' +
    'and add a PostToolUse hook that runs the test suite after every Write or Edit. The ' +
    'red-green-refactor discipline comes from Claude following the instructions, not from ' +
    'filesystem locks.',
  role: 'Engineering',
  industry: null,
  tags: ['tdd', 'testing', 'engineering', 'claude-code', 'harness', 'developer-tools'],
  category: 'devops',
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
      content: `# TDD Loop Harness

A Claude Code project configuration that guides Claude through strict test-driven development.

## What it does

When this harness is active, Claude Code follows the red-green-refactor loop without
shortcuts. The discipline is instruction-driven: Claude reads this README and treats
it as the working contract for the session.

1. **Red**, write a failing test that describes the intended behaviour.
2. **Green**, write the minimum code to make the test pass (nothing more).
3. **Refactor**, clean up the implementation while keeping all tests green.

The \`settings.json\` adds two practical nudges:
- **Permission gates** that restrict bash commands to test-related tools and block
  destructive operations.
- **A PostToolUse hook** that runs \`npm test\` automatically after every Write or Edit,
  so test results surface immediately without a manual run.

Neither of these prevents you from writing code in the wrong order, the discipline
comes from Claude following the instructions in this file.

## Files in this harness

| File | Purpose |
|------|---------|
| \`README.md\` | This guide, Claude reads it as its working instructions |
| \`settings.json\` | Claude Code project settings, copy to \`.claude/settings.json\` |

## Setup

1. Copy \`settings.json\` to \`.claude/settings.json\` in your project root.
2. Open your project in Claude Code. The permission gates and PostToolUse hook
   take effect as soon as the settings file is loaded.
3. Start a task by describing the behaviour you want. Claude will write the test first.

If your project already has a \`.claude/settings.json\`, merge the \`permissions\` and
\`hooks\` sections manually.

## Workflow reference

### Starting a new feature
Tell Claude: "Implement <feature description> using TDD."

Claude will:
- Confirm what the failing test should assert before writing it.
- Run the test suite to verify the new test fails (red state).
- Write the implementation only after the failure is confirmed.
- Run the suite again to verify green.
- Ask whether to refactor before moving on.

### Adding a test for existing code
Tell Claude: "Write a test for <function/module>."

Claude will write the test, run it, and, if it passes immediately, ask whether
the function has a gap worth testing instead. A test that passes without any code
change provides no safety net.

### Checking coverage
Tell Claude: "Check coverage for <module>."

Claude will run your coverage tool, list uncovered lines and branches, and propose
tests for the most important gaps.

## Commands

- \`/run-tdd <feature description>\`, Start a red-green-refactor cycle: write a failing
  test, implement to green, then refactor.
- \`/check-coverage <module or file>\`, Run coverage for a specific module and list
  uncovered lines and branches.
- \`/scaffold-test <function or component>\`, Generate a failing test file with the
  right imports and describe structure, ready for you to fill in the assertions.

## Allowed bash commands

The harness permits only test-related bash commands:

- \`npm test\`, \`npx vitest\`, \`npx jest\`, run the test suite
- \`npx tsc --noEmit\`, type-check without emitting
- \`npm run coverage\`, \`npx vitest --coverage\`, generate coverage reports

Write and Edit tools are unrestricted.
Destructive commands (\`rm -rf\`, \`git push\`, \`git reset --hard\`) are blocked.

## Customising the hook

To change the test command, edit the \`command\` value inside
\`hooks.PostToolUse[0].hooks[0]\` in \`settings.json\`. The default is \`npm test\`.
For a monorepo, scope it to the relevant workspace:
\`npm test --workspace=packages/api\`.

## Known limitations

- The harness does not prevent you from writing implementation code without a test;
  it enforces discipline through Claude's instructions, not filesystem locks.
- If you want a hard coverage gate, add a threshold check to your CI pipeline
  (e.g. \`npx vitest --coverage --coverage.thresholds.lines=80\`).
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
      "Bash(npm test*)",
      "Bash(npx vitest*)",
      "Bash(npx jest*)",
      "Bash(npx tsc --noEmit*)",
      "Bash(npm run coverage*)",
      "Bash(npx vitest --coverage*)",
      "Bash(git diff*)",
      "Bash(git status*)",
      "Bash(git log*)"
    ],
    "deny": [
      "Bash(git push*)",
      "Bash(git reset --hard*)",
      "Bash(git restore*)",
      "Bash(git clean*)",
      "Bash(rm -rf*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm test"
          }
        ]
      }
    ]
  }
}
`,
    },
  ],
  capabilities: [
    {
      command: '/run-tdd',
      description: 'Start a red-green-refactor cycle: write failing test, implement, refactor.',
    },
    {
      command: '/check-coverage',
      description: 'Run coverage for a module and list uncovered lines and branches.',
    },
    {
      command: '/scaffold-test',
      description: 'Generate a failing test file for a new function or component.',
    },
  ],
};
