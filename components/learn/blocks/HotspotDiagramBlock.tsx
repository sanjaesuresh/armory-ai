'use client';

import { useState } from 'react';
import type { HotspotDiagramBlock as HotspotDiagramBlockData } from '@/lib/learn/types';
import { DIAGRAM_REGISTRY } from '../diagrams';

/**
 * HotspotDiagramBlock — owns the active-hotspot state. Renders the diagram from
 * the registry plus a live explanation panel. Clicking the active hotspot closes
 * it; the panel shows an idle prompt when nothing is open.
 */
export default function HotspotDiagramBlock({ block }: { block: HotspotDiagramBlockData }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const Diagram = DIAGRAM_REGISTRY[block.diagramId];
  const active = block.hotspots.find((h) => h.id === activeId) ?? null;

  const handleSelect = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="lblock hotspot-block">
      <Diagram activeHotspotId={activeId} onHotspotSelect={handleSelect} />
      <div className="hotspot-panel" aria-live="polite">
        {active ? (
          <>
            <p className="hp-title">{active.title}</p>
            <p className="hp-body">{active.body}</p>
          </>
        ) : (
          <p className="hp-idle">Select a numbered hotspot to see what occupies that part of the diagram.</p>
        )}
      </div>
    </section>
  );
}
