/**
 * Diagram registry parity test (dom project — jsdom).
 *
 * The registry's key set must exactly equal the manifest's, and every diagram
 * must render one hotspot button per manifest hotspot id, in manifest order.
 * This is the single source-of-truth guard the brief requires.
 */

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DIAGRAM_REGISTRY } from './index';
import { DIAGRAM_MANIFEST, type DiagramId } from '@/lib/learn/diagramManifest';

describe('DIAGRAM_REGISTRY', () => {
  it('key set exactly equals the manifest key set', () => {
    expect(Object.keys(DIAGRAM_REGISTRY).sort()).toEqual(Object.keys(DIAGRAM_MANIFEST).sort());
  });

  it('each diagram renders one hotspot button per manifest hotspot id, in manifest order', () => {
    for (const id of Object.keys(DIAGRAM_MANIFEST) as DiagramId[]) {
      const Diagram = DIAGRAM_REGISTRY[id];
      const { container, unmount } = render(
        <Diagram activeHotspotId={null} onHotspotSelect={() => {}} />,
      );
      const rendered = Array.from(container.querySelectorAll('[data-hotspot-id]')).map((el) =>
        el.getAttribute('data-hotspot-id'),
      );
      expect(rendered).toEqual([...DIAGRAM_MANIFEST[id]]);
      unmount();
    }
  });
});
