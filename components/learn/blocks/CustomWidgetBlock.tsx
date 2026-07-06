'use client';

import type { CustomWidgetBlock as CustomWidgetBlockData } from '@/lib/learn/types';
import { WIDGET_REGISTRY } from '@/components/learn/widgets';

/**
 * CustomWidgetBlock — the escape hatch block that renders a bespoke interactive
 * component by id. Looks up the id in WIDGET_REGISTRY and renders it. Returns
 * null (no crash, no visible output) for any unknown id — the lesson validator
 * prevents unknown ids in shipped content, but this is a runtime-safe guard at
 * the component layer.
 */
export default function CustomWidgetBlock({ block }: { block: CustomWidgetBlockData }) {
  // Cast to allow unknown-id runtime check without TypeScript narrowing error.
  const Widget = (WIDGET_REGISTRY as Record<string, typeof WIDGET_REGISTRY[keyof typeof WIDGET_REGISTRY] | undefined>)[block.widgetId];
  if (!Widget) return null;
  return <Widget />;
}
