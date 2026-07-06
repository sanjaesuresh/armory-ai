/**
 * Lesson page — server component.
 *
 * Resolves the lesson from ALL_LESSONS by the [track] and [lesson] params.
 * Unknown pairs → standard Next.js not-found behavior via notFound(), mirroring
 * app/for/[role]/page.tsx.
 *
 * generateStaticParams returns every lesson so pages build statically.
 * While ALL_LESSONS is empty (Tasks 2–8 build the shell; Tasks 9–12 add
 * content), generateStaticParams returns [] — zero pages are pre-rendered,
 * and any request to /learn/[track]/[lesson] returns 404 because
 * dynamicParams = false. The build succeeds with an empty set.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_LESSONS } from '@/data/lessons/index';
import LessonPlayer from '@/components/learn/LessonPlayer';

interface Props {
  params: Promise<{ track: string; lesson: string }>;
}

// Only serve statically pre-rendered lesson paths. Any URL not in the
// generated set 404s automatically — no dynamic rendering required.
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_LESSONS.map((l) => ({ track: l.track, lesson: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track, lesson: lessonSlug } = await params;
  const lesson = ALL_LESSONS.find(
    (l) => l.track === track && l.slug === lessonSlug,
  );
  if (!lesson) return { title: 'Not Found · Armory' };
  return { title: `${lesson.title} · Learn AI · Armory` };
}

export default async function LessonPage({ params }: Props) {
  const { track, lesson: lessonSlug } = await params;

  const lesson = ALL_LESSONS.find(
    (l) => l.track === track && l.slug === lessonSlug,
  );

  if (!lesson) {
    notFound();
  }

  return (
    <main>
      <LessonPlayer lesson={lesson} />
    </main>
  );
}
