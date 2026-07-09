/**
 * Diagram manifest — maps each diagram id to its declared hotspot ids.
 *
 * The validator and the diagram components both read from this single source of truth.
 * Adding a diagram here requires a matching component in components/learn/diagrams/.
 */

export const DIAGRAM_MANIFEST = {
  'chat-flow': ['your-message', 'conversation-history', 'the-model', 'response'],
  'chatgpt-project-anatomy': ['project-instructions', 'project-files', 'chats', 'outside-chat'],
  'knowledge-file-flow': ['your-file', 'index', 'question', 'retrieved-passages', 'answer'],
  'claude-project-anatomy': ['project-instructions', 'knowledge-files', 'project-chats'],
  'subagent-delegation': ['main-agent', 'task-handoff', 'subagent-context', 'returned-summary'],
  'harness-anatomy': ['model', 'tools', 'permissions', 'claude-md', 'hooks', 'loop'],
  'prompt-anatomy': ['role', 'task', 'constraints', 'format', 'examples'],
  'context-assembly': ['instructions', 'files', 'history', 'retrieval', 'window'],
  'loop-cycle': ['decide', 'act', 'observe', 'verify', 'iterate'],
} as const satisfies Record<string, ReadonlyArray<string>>;

export type DiagramId = keyof typeof DIAGRAM_MANIFEST;
