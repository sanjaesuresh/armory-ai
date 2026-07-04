import { notFound } from 'next/navigation';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { isTestDriveLaunched } from '@/lib/testdrive/flags';
import { getSessionUser } from '@/lib/supabase/server';
import CustomizeView from '@/components/CustomizeView';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CustomizePage({ params }: Props) {
  const { slug } = await params;

  const repo = createCatalogRepository();
  let setup;
  try {
    setup = await repo.getSetupBySlug(slug);
  } catch (err) {
    console.error('[customize] failed to load setup:', err);
    return (
      <main className="section-tight">
        <div className="wrap">
          <div
            className="error-banner"
            role="alert"
            style={{ maxWidth: '540px' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 4 2.8 19.5h18.4z" />
              <path d="M12 10v4.5M12 17.2v.1" />
            </svg>
            <div>
              <strong>We couldn&apos;t load this setup</strong>
              <p>Please try again in a moment.</p>
              <Link href="/catalog" className="btn btn-outline btn-sm">
                Back to catalog
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!setup) {
    notFound();
  }

  // Render-gate on the pure env flag (no per-render DB read). The runtime
  // config-row kill switch is enforced server-side by the runner before any
  // model spend — a kill flips runs to the feature-off state, it does not need
  // to hide the panel on every page load.
  const testDriveEnabled = isTestDriveLaunched();

  // Session lookup is for the optional "Save my setup" affordance only — it never
  // gates the page. Signed-out users get the full customize/export flow unchanged.
  const user = await getSessionUser();

  return (
    <main className="section-tight">
      <div className="wrap">
        <CustomizeView
          setup={setup}
          testDriveEnabled={testDriveEnabled}
          signedIn={Boolean(user)}
          userId={user?.id}
        />
      </div>
    </main>
  );
}
