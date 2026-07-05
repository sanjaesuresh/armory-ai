import { notFound, redirect } from 'next/navigation';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { isRegistryKind } from '@/lib/setup/types';
import SetupDetail from '@/components/SetupDetail';
import Link from 'next/link';
import { getSessionUser, createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';
import { createSupabaseModerationStore } from '@/lib/community/moderation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SetupPage({ params }: Props) {
  const { slug } = await params;

  const repo = createCatalogRepository();
  let setup;
  try {
    setup = await repo.getSetupBySlug(slug);
  } catch (err) {
    console.error('[setup] failed to load setup:', err);
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
              <Link href="/professionals" className="btn btn-outline btn-sm">
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

  // Cross-redirect: registry items (agent, skill, harness) live at /dev/[slug].
  if (isRegistryKind(setup.kind)) {
    redirect(`/dev/${setup.slug}`);
  }

  // ── Optional signed-in affordances (never breaks the account-free guarantee) ─
  const user = await getSessionUser();

  let initialUpvoted = false;
  let isModerator = false;

  if (user) {
    // Run the upvote-state query and the moderator check in parallel; each
    // has its own silent-fallback default of false on rejection.
    const [upvoteResult, moderatorResult] = await Promise.allSettled([
      (async () => {
        const serverClient = await createSupabaseServerClient();
        const { data } = await serverClient
          .from('upvotes')
          .select('setup_id')
          .eq('user_id', user.id)
          .eq('setup_id', setup.id)
          .maybeSingle();
        return data !== null;
      })(),
      (async () => {
        const serviceClient = createSupabaseServiceClient();
        const modStore = createSupabaseModerationStore(serviceClient);
        return modStore.isModerator(user.id);
      })(),
    ]);

    if (upvoteResult.status === 'fulfilled') initialUpvoted = upvoteResult.value;
    if (moderatorResult.status === 'fulfilled') isModerator = moderatorResult.value;
  }

  return (
    <SetupDetail
      setup={setup}
      userId={user?.id ?? null}
      initialUpvoted={initialUpvoted}
      isModerator={isModerator}
    />
  );
}
