'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Setup, Answers } from '@/lib/setup/types';
import type { KnowledgeFile } from '@/lib/setup/types';
import SetupForm from './SetupForm';
import FileAttachment from './fields/FileAttachment';
import PreviewPanel from './PreviewPanel';
import {
  type AttachmentsMap,
  setAttachment,
  removeAttachment,
  missingRequiredAttachments,
} from '@/lib/attachments/state';

interface Props {
  setup: Setup;
}

export default function CustomizeView({ setup }: Props) {
  const router = useRouter();

  const [answers, setAnswers] = useState<Answers>({});
  const [complete, setComplete] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentsMap>({});
  const [exportError, setExportError] = useState<string | null>(null);

  const handleAnswersChange = useCallback(
    (nextAnswers: Answers, validity: { complete: boolean }) => {
      setAnswers(nextAnswers);
      setComplete(validity.complete);
    },
    [],
  );

  const userProvidedFiles = (setup.knowledgeFiles ?? []).filter(
    (f): f is KnowledgeFile & { kind: 'user-provided' } => f.kind === 'user-provided',
  );

  const missing = missingRequiredAttachments(setup.knowledgeFiles ?? [], attachments);
  const canExport = complete && missing.length === 0;

  let disabledReason: string | null = null;
  if (!complete) {
    disabledReason = 'Fill in the required fields above to continue.';
  } else if (missing.length > 0) {
    disabledReason =
      missing.length === 1
        ? `Attach the required file "${missing[0]}" to continue.`
        : `Attach the required files to continue: ${missing.join(', ')}.`;
  }

  function handleExport() {
    try {
      sessionStorage.setItem(
        'armory-export-state',
        JSON.stringify({ slug: setup.slug, answers, attachments }),
      );
    } catch {
      setExportError('Your attached file is too large to carry over. Try a smaller file.');
      return;
    }
    setExportError(null);
    router.push('/export?setup=' + setup.slug);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        alignItems: 'flex-start',
      }}
    >
      {/* Left column: form + attachments */}
      <div
        data-testid="customize-left"
        style={{ flex: '1 1 340px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        <SetupForm
          slug={setup.slug}
          variables={setup.variables}
          onAnswersChange={handleAnswersChange}
        />

        {userProvidedFiles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#555',
                margin: 0,
              }}
            >
              Your files
            </h3>
            {userProvidedFiles.map((kf) => (
              <FileAttachment
                key={kf.name}
                knowledgeFile={kf}
                value={attachments[kf.name]}
                onChange={(content) => {
                  if (content === null) {
                    setAttachments((prev) => removeAttachment(prev, kf.name));
                  } else {
                    setAttachments((prev) => setAttachment(prev, kf.name, content));
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            disabled={!canExport}
            onClick={handleExport}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              background: canExport ? '#1a1a1a' : '#ccc',
              color: canExport ? '#fff' : '#888',
              border: 'none',
              borderRadius: '6px',
              cursor: canExport ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              alignSelf: 'flex-start',
            }}
          >
            Get export instructions
          </button>

          {disabledReason && (
            <p
              data-testid="cta-reason"
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: '#666',
              }}
            >
              {disabledReason}
            </p>
          )}

          {exportError && (
            <p
              role="alert"
              data-testid="export-error"
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: '#c00',
              }}
            >
              {exportError}
            </p>
          )}
        </div>
      </div>

      {/* Right column: live preview */}
      <div
        data-testid="customize-right"
        style={{ flex: '1 1 340px', minWidth: 0 }}
      >
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            margin: '0 0 1rem',
            color: '#333',
          }}
        >
          Live preview
        </h2>
        <PreviewPanel setup={setup} answers={answers} />
      </div>
    </div>
  );
}
