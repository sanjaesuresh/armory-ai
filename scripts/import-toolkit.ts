/**
 * One-time importer for sanjaesuresh/claude-code-toolkit (public, branch: main).
 * Generates data/member-posts/toolkit.generated.ts.
 *
 * Run with:  npx tsx scripts/import-toolkit.ts
 *
 * DETERMINISTIC / IDEMPOTENT — stable alphabetical sort, fixed date constant,
 * no Date.now() / Math.random(). Re-running overwrites the file identically.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import type { Setup, ArtifactFile, Capability, Category } from '../lib/setup/types';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// ─── Constants ────────────────────────────────────────────────────────────────

const REPO_OWNER = 'sanjaesuresh';
const REPO_NAME = 'claude-code-toolkit';
const REPO = `${REPO_OWNER}/${REPO_NAME}`;
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/main`;
const GITHUB_BASE = `https://github.com/${REPO}`;

/** One fixed ISO date for all generated items — no Date.now(). */
const CREATED_AT = '2026-07-05T00:00:00.000Z';

// ─── Skip lists (D6/D7) ───────────────────────────────────────────────────────

/** D6: Skills NOT authored in this toolkit — exclude from import (24 items). */
const SKIP_SKILLS = new Set([
  'brainstorming',
  'systematic-debugging',
  'writing-plans',
  'test-driven-development',
  'verification-before-completion',
  'executing-plans',
  'subagent-driven-development',
  'dispatching-parallel-agents',
  'using-git-worktrees',
  'finishing-a-development-branch',
  'careful',
  'freeze',
  'guard',
  'context-save',
  'context-restore',
  'health-check',
  'spec',
  'office-hours',
  'docs-generate',
  'plan-pipeline',
  'engineering-plan-review',
  'design-plan-review',
  'pre-pr-review',
  'product-plan-review',
]);

/** D7: Agents NOT authored in this toolkit — exclude from import (9 items). */
const SKIP_AGENTS = new Set([
  'security-reviewer',
  'debugger',
  'engineering-manager',
  'design-reviewer',
  'founder-reviewer',
  'pre-pr-reviewer',
  'health-checker',
  'release-manager',
  'qa-reviewer',
]);

/** Harness hook/helper scripts to include as non-primary artifact files. */
const HARNESS_SCRIPT_PATHS = [
  'scripts/block-dangerous-commands.sh',
  'scripts/freeze-edits.sh',
  'scripts/unfreeze-edits.sh',
  'scripts/notify.sh',
  'scripts/context-save.sh',
  'scripts/context-restore.sh',
  'scripts/health-check.sh',
  'bootstrap.sh',
];

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

async function fetchRaw(filePath: string): Promise<string> {
  const fetchUrl = `${RAW_BASE}/${filePath}`;
  const resp = await fetch(fetchUrl);
  if (!resp.ok) {
    throw new Error(`FETCH FAILED (${resp.status}): ${filePath}`);
  }
  return resp.text();
}

async function fetchRawOrNull(filePath: string): Promise<string | null> {
  const fetchUrl = `${RAW_BASE}/${filePath}`;
  const resp = await fetch(fetchUrl);
  if (!resp.ok) return null;
  return resp.text();
}

async function fetchTree(): Promise<Array<{ path: string; type: string }>> {
  const apiUrl = `https://api.github.com/repos/${REPO}/git/trees/main?recursive=1`;
  const resp = await fetch(apiUrl, {
    headers: process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {},
  });
  if (!resp.ok) throw new Error(`Tree fetch failed: ${resp.status}`);
  const json = (await resp.json()) as { tree: Array<{ path: string; type: string }> };
  return json.tree;
}

// ─── Frontmatter parser ───────────────────────────────────────────────────────

/**
 * Parses simple YAML frontmatter (the --- ... --- block at the top of a file).
 * Handles both single-line values and YAML folded block scalars (> and >-).
 * Returns a plain key→value map; values are plain strings.
 */
function parseFrontmatter(raw: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!raw.startsWith('---\n')) return result;
  // Find closing ---
  const closeIdx = raw.indexOf('\n---', 4);
  if (closeIdx === -1) return result;
  const block = raw.slice(4, closeIdx); // everything between the two --- markers
  const lines = block.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) {
      i++;
      continue;
    }
    const key = line.slice(0, colonIdx).trim();
    const valueStr = line.slice(colonIdx + 1).trim();

    if (valueStr === '>' || valueStr === '>-' || valueStr === '|' || valueStr === '|-') {
      // YAML block scalar — read indented continuation lines and fold into one string
      i++;
      const parts: string[] = [];
      while (i < lines.length) {
        const next = lines[i];
        if (next.startsWith('  ') || next.startsWith('\t')) {
          // Continuation line — trim leading whitespace and collect
          parts.push(next.trim());
          i++;
        } else if (next.trim() === '') {
          // Blank line inside block — treat as paragraph break (collect empty then continue)
          parts.push('');
          i++;
        } else {
          // Non-indented line — end of block scalar
          break;
        }
      }
      // Fold adjacent non-empty parts with a single space, drop leading/trailing blanks
      result[key] = parts
        .reduce<string[]>((acc, part) => {
          if (part === '') {
            // Paragraph break: push a single space separator then reset
            if (acc.length > 0 && acc[acc.length - 1] !== ' ') acc.push(' ');
          } else {
            if (acc.length > 0 && acc[acc.length - 1] !== ' ') acc.push(' ');
            acc.push(part);
          }
          return acc;
        }, [])
        .join('')
        .trim()
        .replace(/\s{2,}/g, ' ');
    } else {
      result[key] = valueStr;
      i++;
    }
  }
  return result;
}

// ─── String helpers ───────────────────────────────────────────────────────────

const ACRONYMS = new Set(['ai', 'pr', 'qa', 'ui', 'ux', 'api', 'cli', 'tdd']);

function titleCase(s: string): string {
  return s
    .split('-')
    .map((w) =>
      ACRONYMS.has(w.toLowerCase())
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(' ');
}

/**
 * Derives a tagline from a (potentially long) description.
 * Takes the first sentence (up to ". " or end), max 120 chars.
 */
function toTagline(description: string): string {
  const periodIdx = description.indexOf('. ');
  if (periodIdx !== -1 && periodIdx < 120) return description.slice(0, periodIdx + 1);
  if (description.length <= 120) return description;
  return description.slice(0, 117).trimEnd() + '...';
}

// ─── Category / tag mapping ───────────────────────────────────────────────────

const CATEGORY_OVERRIDES: Record<string, Category> = {
  researcher: 'research',
  'deep-researcher': 'research',
  'product-strategist': 'product',
  standup: 'general',
};

function toCategory(name: string): Category {
  return CATEGORY_OVERRIDES[name] ?? 'engineering';
}

function toTags(name: string, kind: string): string[] {
  return [name, kind, 'claude-code'];
}

// ─── Skill importer ───────────────────────────────────────────────────────────

async function importSkills(
  tree: Array<{ path: string; type: string }>,
): Promise<Setup[]> {
  // Extract unique skill folder names from the tree
  const skillNames = [
    ...new Set(
      tree
        .filter((f) => f.path.startsWith('global/skills/') && f.path.endsWith('/SKILL.md'))
        .map((f) => f.path.replace('global/skills/', '').replace('/SKILL.md', '')),
    ),
  ].sort();

  const kept: Setup[] = [];
  const skipped: string[] = [];

  for (const name of skillNames) {
    if (SKIP_SKILLS.has(name)) {
      skipped.push(name);
      continue;
    }

    const skillPath = `global/skills/${name}/SKILL.md`;
    const raw = await fetchRaw(skillPath);
    const fm = parseFrontmatter(raw);

    const baseDescription = fm['description'] ?? name;

    // frontend-engineer D6 attribution
    const feAttribution =
      name === 'frontend-engineer'
        ? '\n\nAttribution: The bundled tell-catalog (ai-tells-catalog.md) and devibe_scan.py are adapted from Carter Johnson\'s vibecoded-design-tells (MIT License).'
        : '';

    const description = baseDescription + feAttribution;

    const artifactFiles: ArtifactFile[] = [
      { name: 'SKILL.md', content: raw, isPrimary: true },
    ];

    // frontend-engineer: include devibe_scan.py and the tell-catalog as additional files
    if (name === 'frontend-engineer') {
      const scan = await fetchRawOrNull(
        'global/skills/frontend-engineer/scripts/devibe_scan.py',
      );
      if (scan) {
        artifactFiles.push({ name: 'devibe_scan.py', content: scan, isPrimary: false });
      }
      const catalog = await fetchRawOrNull(
        'global/skills/frontend-engineer/references/ai-tells-catalog.md',
      );
      if (catalog) {
        artifactFiles.push({ name: 'ai-tells-catalog.md', content: catalog, isPrimary: false });
      }
    }

    const displayName = fm['name'] ? titleCase(fm['name']) : titleCase(name);
    const slug = `toolkit-${name}`;

    const capabilities: Capability[] = [
      {
        command: `/${name}`,
        description: toTagline(baseDescription),
      },
    ];

    const setup: Setup = {
      kind: 'skill',
      id: `${slug}-v1`,
      slug,
      name: displayName,
      tagline: toTagline(baseDescription),
      description,
      role: 'general',
      industry: null,
      tags: toTags(name, 'skill'),
      category: toCategory(name),
      source: 'community',
      author: 'sanjaesuresh',
      version: '1.0.0',
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
      reviewStatus: 'approved',
      upvotes: 0,
      featured: null,
      popularity: 0,
      targets: [],
      tier: 'core',
      instructionTemplate: '',
      variables: [],
      knowledgeFiles: [],
      scenarios: [],
      artifactFiles,
      repoUrl: `${GITHUB_BASE}/tree/main/global/skills/${name}`,
      githubStars: null,
      capabilities,
    };

    kept.push(setup);
    console.log(`  [skill] kept  → ${slug}`);
  }

  console.log(
    `  [skill] skipped (${skipped.length}): ${skipped.join(', ')}`,
  );

  return kept;
}

// ─── Agent importer ───────────────────────────────────────────────────────────

async function importAgents(
  tree: Array<{ path: string; type: string }>,
): Promise<Setup[]> {
  const agentFiles = tree
    .filter((f) => f.path.startsWith('global/agents/') && f.path.endsWith('.md'))
    .map((f) => f.path.replace('global/agents/', '').replace('.md', ''))
    .sort();

  const kept: Setup[] = [];
  const skipped: string[] = [];

  for (const name of agentFiles) {
    if (SKIP_AGENTS.has(name)) {
      skipped.push(name);
      continue;
    }

    const agentPath = `global/agents/${name}.md`;
    const raw = await fetchRaw(agentPath);
    const fm = parseFrontmatter(raw);

    const description = fm['description'] ?? name;
    const displayName = fm['name'] ? titleCase(fm['name']) : titleCase(name);
    const slug = `toolkit-agent-${name}`;

    const setup: Setup = {
      kind: 'agent',
      id: `${slug}-v1`,
      slug,
      name: displayName,
      tagline: toTagline(description),
      description,
      role: 'general',
      industry: null,
      tags: toTags(name, 'agent'),
      category: toCategory(name),
      source: 'community',
      author: 'sanjaesuresh',
      version: '1.0.0',
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
      reviewStatus: 'approved',
      upvotes: 0,
      featured: null,
      popularity: 0,
      targets: [],
      tier: 'core',
      instructionTemplate: '',
      variables: [],
      knowledgeFiles: [],
      scenarios: [],
      artifactFiles: [{ name: `${name}.md`, content: raw, isPrimary: true }],
      repoUrl: `${GITHUB_BASE}/blob/main/global/agents/${name}.md`,
      githubStars: null,
      capabilities: [],
    };

    kept.push(setup);
    console.log(`  [agent] kept  → ${slug}`);
  }

  console.log(
    `  [agent] skipped (${skipped.length}): ${skipped.join(', ')}`,
  );

  return kept;
}

// ─── Harness importer ─────────────────────────────────────────────────────────

async function importHarness(
  tree: Array<{ path: string; type: string }>,
): Promise<Setup> {
  const treePaths = new Set(tree.map((f) => f.path));

  // Primary file: global/CLAUDE.md
  const claudeMdRaw = await fetchRaw('global/CLAUDE.md');

  const artifactFiles: ArtifactFile[] = [
    { name: 'CLAUDE.md', content: claudeMdRaw, isPrimary: true },
  ];

  // settings.json
  const settingsRaw = await fetchRawOrNull('global/settings.json');
  if (settingsRaw) {
    artifactFiles.push({ name: 'settings.json', content: settingsRaw, isPrimary: false });
  }

  // Hook/helper scripts — include whichever exist in the tree
  for (const scriptPath of HARNESS_SCRIPT_PATHS) {
    if (!treePaths.has(scriptPath)) {
      console.log(`  [harness] script not in tree, skipping: ${scriptPath}`);
      continue;
    }
    const content = await fetchRawOrNull(scriptPath);
    if (content === null) {
      console.log(`  [harness] script fetch returned null: ${scriptPath}`);
      continue;
    }
    const fileName = scriptPath.split('/').pop()!;
    artifactFiles.push({ name: fileName, content, isPrimary: false });
  }

  console.log(`  [harness] files included: ${artifactFiles.map((f) => f.name).join(', ')}`);

  return {
    kind: 'harness',
    id: 'toolkit-harness-v1',
    slug: 'toolkit-harness',
    name: 'Claude Code Toolkit harness',
    tagline: 'Global CLAUDE.md + settings.json + hook scripts for Claude Code power users.',
    description:
      'The sanjaesuresh/claude-code-toolkit harness: a global CLAUDE.md (cross-project ' +
      'operating instructions), a settings.json with hook wiring, and shell hook scripts ' +
      '(block-dangerous-commands, freeze/unfreeze edits, context save/restore, notify, ' +
      'health-check). Provides the base config that the toolkit\'s skills and agents are ' +
      'designed to run on top of.',
    role: 'general',
    industry: null,
    tags: ['harness', 'claude-code', 'toolkit'],
    category: 'engineering',
    source: 'community',
    author: 'sanjaesuresh',
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    artifactFiles,
    repoUrl: GITHUB_BASE,
    githubStars: null,
    capabilities: [],
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`Fetching file tree for ${REPO} @ main…`);
  const tree = await fetchTree();
  console.log(`  Tree has ${tree.length} entries.`);

  console.log('\nImporting skills…');
  const skills = await importSkills(tree);

  console.log('\nImporting agents…');
  const agents = await importAgents(tree);

  console.log('\nImporting harness…');
  const harness = await importHarness(tree);

  // Sort: skills alpha, then agents alpha, then harness (deterministic)
  const allItems: Setup[] = [
    ...skills.sort((a, b) => a.slug.localeCompare(b.slug)),
    ...agents.sort((a, b) => a.slug.localeCompare(b.slug)),
    harness,
  ];

  // ── Validate expected counts ────────────────────────────────────────────────
  const skillCount = allItems.filter((x) => x.kind === 'skill').length;
  const agentCount = allItems.filter((x) => x.kind === 'agent').length;
  const harnessCount = allItems.filter((x) => x.kind === 'harness').length;

  console.log(`\nImport summary:`);
  console.log(`  Skills:  ${skillCount} (expected 16)`);
  console.log(`  Agents:  ${agentCount} (expected 11)`);
  console.log(`  Harness: ${harnessCount} (expected 1)`);
  console.log(`  Total:   ${allItems.length} (expected 28)`);

  if (skillCount !== 16 || agentCount !== 11 || harnessCount !== 1) {
    throw new Error(
      `Count mismatch — expected 16 skills + 11 agents + 1 harness = 28, ` +
        `got ${skillCount} + ${agentCount} + ${harnessCount} = ${allItems.length}. ` +
        `Aborting — do not write file.`,
    );
  }

  // ── Generate output file ────────────────────────────────────────────────────
  const json = JSON.stringify(allItems, null, 2);

  const fileContent = `// GENERATED by scripts/import-toolkit.ts — do not hand-edit.
// Re-run with: npx tsx scripts/import-toolkit.ts
// Sort: skills (alpha), agents (alpha), harness — deterministic.
import type { Setup } from '@/lib/setup/types';

export const toolkitItems: Setup[] = ${json};
`;

  const outPath = path.resolve(__dirname, '../data/member-posts/toolkit.generated.ts');
  fs.writeFileSync(outPath, fileContent, 'utf8');

  console.log(`\nWrote ${allItems.length} items to ${outPath}`);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
