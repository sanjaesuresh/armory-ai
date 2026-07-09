/**
 * Widget registry — maps every WIDGET_IDS entry to its React component.
 *
 * The key set must exactly equal WIDGET_IDS from lib/learn/types.ts; this is
 * enforced by the registry parity test in widgets.test.tsx. Each widget is a
 * self-contained simulation that takes no props.
 */

import type { ComponentType } from 'react';
import type { WidgetId } from '@/lib/learn/types';

import ContextMeter from './ContextMeter';
import AgentLoop from './AgentLoop';
import SkillTrigger from './SkillTrigger';
import VendorMap from './VendorMap';
import InstructionSteering from './InstructionSteering';
import StyleSwitcher from './StyleSwitcher';
import ArtifactVsChat from './ArtifactVsChat';
import KnowledgeContext from './KnowledgeContext';
import GptVsProjectPicker from './GptVsProjectPicker';
import ProjectsSwitcher from './ProjectsSwitcher';

export type WidgetComponent = ComponentType;

export const WIDGET_REGISTRY: Record<WidgetId, WidgetComponent> = {
  'context-meter':         ContextMeter,
  'agent-loop':            AgentLoop,
  'skill-trigger':         SkillTrigger,
  'vendor-map':            VendorMap,
  'instruction-steering':  InstructionSteering,
  'style-switcher':        StyleSwitcher,
  'artifact-vs-chat':      ArtifactVsChat,
  'knowledge-context':     KnowledgeContext,
  'gpt-vs-project-picker': GptVsProjectPicker,
  'projects-switcher':     ProjectsSwitcher,
};
