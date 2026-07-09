/**
 * Diagram registry — maps every DIAGRAM_MANIFEST id to its inline-SVG component.
 *
 * The registry's key set is kept exactly in sync with DIAGRAM_MANIFEST by
 * registry.test.tsx. Each component renders the paper-craft SVG plus one
 * positioned, labeled hotspot button per manifest hotspot id (carrying a
 * data-hotspot-id attribute the parity test reads).
 */

import type { ComponentType } from 'react';
import type { DiagramId } from '@/lib/learn/diagramManifest';

import ChatFlowDiagram from './ChatFlowDiagram';
import ChatGptProjectAnatomyDiagram from './ChatGptProjectAnatomyDiagram';
import KnowledgeFileFlowDiagram from './KnowledgeFileFlowDiagram';
import ClaudeProjectAnatomyDiagram from './ClaudeProjectAnatomyDiagram';
import SubagentDelegationDiagram from './SubagentDelegationDiagram';
import HarnessAnatomyDiagram from './HarnessAnatomyDiagram';
import PromptAnatomyDiagram from './PromptAnatomyDiagram';
import ContextAssemblyDiagram from './ContextAssemblyDiagram';
import LoopCycleDiagram from './LoopCycleDiagram';

/** Props every diagram component accepts. Hotspot ownership lives in the block. */
export interface DiagramProps {
  /** The manifest hotspot id currently open, or null when the diagram is idle. */
  activeHotspotId: string | null;
  /** Called with a manifest hotspot id when its button is activated. */
  onHotspotSelect: (hotspotId: string) => void;
}

export type DiagramComponent = ComponentType<DiagramProps>;

export const DIAGRAM_REGISTRY: Record<DiagramId, DiagramComponent> = {
  'chat-flow': ChatFlowDiagram,
  'chatgpt-project-anatomy': ChatGptProjectAnatomyDiagram,
  'knowledge-file-flow': KnowledgeFileFlowDiagram,
  'claude-project-anatomy': ClaudeProjectAnatomyDiagram,
  'subagent-delegation': SubagentDelegationDiagram,
  'harness-anatomy': HarnessAnatomyDiagram,
  'prompt-anatomy': PromptAnatomyDiagram,
  'context-assembly': ContextAssemblyDiagram,
  'loop-cycle': LoopCycleDiagram,
};
