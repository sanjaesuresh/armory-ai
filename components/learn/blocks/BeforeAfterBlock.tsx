'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import type { BeforeAfterBlock as BeforeAfterBlockData, Exchange } from '@/lib/learn/types';

/**
 * BeforeAfterBlock — a two-option tab toggle switching which exchange pane is
 * visible. Panes render as a mini chat transcript with visually distinct user
 * and ai bubbles. Standard tablist keyboard: arrow keys move the selection.
 */

function ChatTranscript({ exchanges }: { exchanges: Exchange[] }) {
  return (
    <div className="chat-exchange">
      {exchanges.map((ex, i) => (
        <p key={i} className={`chat-bub ${ex.speaker === 'user' ? 'cb-user' : 'cb-ai'}`}>
          {ex.text}
        </p>
      ))}
    </div>
  );
}

export default function BeforeAfterBlock({ block }: { block: BeforeAfterBlockData }) {
  const [pane, setPane] = useState<'before' | 'after'>('before');
  const id = useId();
  const beforeTab = `${id}-tab-before`;
  const afterTab = `${id}-tab-after`;
  const beforePanel = `${id}-panel-before`;
  const afterPanel = `${id}-panel-after`;

  const onTablistKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setPane('after');
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setPane('before');
    }
  };

  return (
    <section className="lblock">
      <div className="ba-tabs" role="tablist" aria-label="Before and after comparison" onKeyDown={onTablistKeyDown}>
        <button
          type="button"
          role="tab"
          id={beforeTab}
          className="ba-tab"
          aria-selected={pane === 'before'}
          aria-controls={beforePanel}
          tabIndex={pane === 'before' ? 0 : -1}
          onClick={() => setPane('before')}
        >
          {block.beforeLabel}
        </button>
        <button
          type="button"
          role="tab"
          id={afterTab}
          className="ba-tab"
          aria-selected={pane === 'after'}
          aria-controls={afterPanel}
          tabIndex={pane === 'after' ? 0 : -1}
          onClick={() => setPane('after')}
        >
          {block.afterLabel}
        </button>
      </div>

      <div className="ba-pane" role="tabpanel" id={beforePanel} aria-labelledby={beforeTab} hidden={pane !== 'before'}>
        <ChatTranscript exchanges={block.beforeExchanges} />
      </div>
      <div className="ba-pane" role="tabpanel" id={afterPanel} aria-labelledby={afterTab} hidden={pane !== 'after'}>
        <ChatTranscript exchanges={block.afterExchanges} />
      </div>
    </section>
  );
}
