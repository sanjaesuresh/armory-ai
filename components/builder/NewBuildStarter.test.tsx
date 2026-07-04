/**
 * NewBuildStarter component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * When the handler fires, createSupabaseBrowserClient() throws immediately
 * because NEXT_PUBLIC_SUPABASE_URL is not set in the test environment. That
 * throw is caught by the component's try/catch and surfaces the role="alert"
 * error — no real network is hit.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewBuildStarter from './NewBuildStarter';

// useRouter is called at render time — provide a stable stub.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('NewBuildStarter', () => {
  it('shows a role="alert" error when draft creation throws', async () => {
    render(<NewBuildStarter />);

    // No error before the button is clicked
    expect(screen.queryByRole('alert')).toBeNull();

    fireEvent.click(screen.getByTestId('start-new-setup'));

    // createSupabaseBrowserClient() throws (missing env) → catch sets error state
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
