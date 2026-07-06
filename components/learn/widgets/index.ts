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

export type WidgetComponent = ComponentType;

export const WIDGET_REGISTRY: Record<WidgetId, WidgetComponent> = {
  'context-meter': ContextMeter,
  'agent-loop':    AgentLoop,
  'skill-trigger': SkillTrigger,
};
