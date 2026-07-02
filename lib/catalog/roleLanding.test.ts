/**
 * Parity test: every role in ROLES has a matching landing copy entry whose
 * headline and metaDescription contain the role's label.
 *
 * This guards against adding a new role to ROLES without adding its copy, and
 * against copy that drifts from the role label it is supposed to describe.
 */

import { describe, it, expect } from 'vitest';
import { ROLES } from './roles';
import { getRoleLandingCopy } from './roleLanding';

describe('roleLanding parity', () => {
  for (const role of ROLES) {
    it(`${role.id}: has copy with headline and metaDescription containing "${role.label}"`, () => {
      const copy = getRoleLandingCopy(role.id);

      expect(copy).not.toBeNull();
      if (!copy) return; // type narrowing; expect above already fails

      expect(copy.headline.toLowerCase()).toContain(role.label.toLowerCase());
      expect(copy.metaDescription.toLowerCase()).toContain(role.label.toLowerCase());
    });
  }
});
