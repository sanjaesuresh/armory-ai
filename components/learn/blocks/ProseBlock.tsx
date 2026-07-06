import type { ProseBlock as ProseBlockData } from '@/lib/learn/types';

/**
 * ProseBlock — static heading + paragraph copy. No client state.
 */
export default function ProseBlock({ block }: { block: ProseBlockData }) {
  return (
    <section className="lblock">
      {block.heading ? <h2>{block.heading}</h2> : null}
      {block.paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </section>
  );
}
