import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FileAttachment, { MAX_ATTACHMENT_CHARS } from './FileAttachment';
import { missingRequiredAttachments } from '@/lib/attachments/state';
import type { KnowledgeFile } from '@/lib/setup/types';

const userProvidedFile: KnowledgeFile = {
  name: 'Your brand guidelines',
  purpose: 'Brand voice guide',
  kind: 'user-provided',
  guidance: 'Attach your brand voice document here.',
  required: false,
};

const requiredUserProvidedFile: KnowledgeFile = {
  name: 'Required doc',
  purpose: 'A required document',
  kind: 'user-provided',
  guidance: 'This one is required.',
  required: true,
};

describe('FileAttachment', () => {
  it('reading a file exposes its text content in the attachments map', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <FileAttachment
        knowledgeFile={userProvidedFile}
        value={undefined}
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText(/your brand guidelines/i);
    const file = new File(['Hello brand guidelines content'], 'brand.txt', { type: 'text/plain' });

    await user.upload(input, file);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('Hello brand guidelines content');
    });
  });

  it('no network request is made when a file is attached', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response());
    const xhrOpenSpy = vi.spyOn(XMLHttpRequest.prototype, 'open');

    const onChange = vi.fn();

    render(
      <FileAttachment
        knowledgeFile={userProvidedFile}
        value={undefined}
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText(/your brand guidelines/i);
    const file = new File(['some content'], 'guide.txt', { type: 'text/plain' });

    await user.upload(input, file);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrOpenSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
    xhrOpenSpy.mockRestore();
  });

  it('the refresh-clears-attachments warning is shown', () => {
    render(
      <FileAttachment
        knowledgeFile={userProvidedFile}
        value={undefined}
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByText(/if you refresh the page/i)
    ).toBeInTheDocument();
  });

  it('shows an inline error and calls onChange(null) when file.text() rejects, then clears on success', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <FileAttachment
        knowledgeFile={userProvidedFile}
        value={undefined}
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText(/your brand guidelines/i);

    // First upload: stub text() to reject
    const badFile = new File([''], 'corrupt.txt', { type: 'text/plain' });
    vi.spyOn(badFile, 'text').mockRejectedValue(new Error('read error'));

    await user.upload(input, badFile);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(null);
    });

    expect(
      screen.getByRole('alert')
    ).toHaveTextContent(/couldn't read that file/i);

    // Second upload: successful attach clears the error
    onChange.mockClear();
    const goodFile = new File(['Good content'], 'good.txt', { type: 'text/plain' });

    await user.upload(input, goodFile);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('Good content');
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('rejects a file whose text exceeds the size cap and does not attach it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <FileAttachment
        knowledgeFile={userProvidedFile}
        value={undefined}
        onChange={onChange}
      />
    );

    const input = screen.getByLabelText(/your brand guidelines/i);
    const oversize = 'a'.repeat(MAX_ATTACHMENT_CHARS + 1);
    const file = new File([oversize], 'huge.txt', { type: 'text/plain' });

    await user.upload(input, file);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(null);
    });

    // Never attaches the content
    expect(onChange).not.toHaveBeenCalledWith(oversize);
    expect(screen.getByRole('alert')).toHaveTextContent(/too large/i);
  });

  it('shows attached file name and remove button when value is set', async () => {
    const onChange = vi.fn();
    render(
      <FileAttachment
        knowledgeFile={userProvidedFile}
        value="some content"
        onChange={onChange}
      />
    );

    expect(screen.getByText(/attached/i)).toBeInTheDocument();

    const removeBtn = screen.getByRole('button', { name: /remove/i });
    await userEvent.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

describe('missingRequiredAttachments', () => {
  it('a required user-provided file left empty is reported as missing', () => {
    const files: KnowledgeFile[] = [requiredUserProvidedFile];
    const map: Record<string, string> = {};
    expect(missingRequiredAttachments(files, map)).toEqual(['Required doc']);
  });

  it('does not report optional user-provided files', () => {
    const files: KnowledgeFile[] = [userProvidedFile];
    const map: Record<string, string> = {};
    expect(missingRequiredAttachments(files, map)).toEqual([]);
  });

  it('does not report required user-provided files that have content', () => {
    const files: KnowledgeFile[] = [requiredUserProvidedFile];
    const map: Record<string, string> = { 'Required doc': 'some content' };
    expect(missingRequiredAttachments(files, map)).toEqual([]);
  });

  it('does not report starter files', () => {
    const starterFile: KnowledgeFile = {
      name: 'Brand quick-facts',
      purpose: 'Quick facts',
      kind: 'starter',
      content: 'some starter content',
      required: true,
    };
    const map: Record<string, string> = {};
    expect(missingRequiredAttachments([starterFile], map)).toEqual([]);
  });
});

describe('FileAttachment — opt-in account storage (Task 5)', () => {
  it('shows no account-save control when signed out (default)', () => {
    render(
      <FileAttachment knowledgeFile={userProvidedFile} value="attached content" onChange={vi.fn()} />,
    );
    expect(screen.queryByTestId('stored-file-optin')).toBeNull();
    // The default in-browser-only warning is present.
    expect(screen.getByText(/Files stay in your browser/i)).toBeInTheDocument();
  });

  it('offers the opt-in save only when signed in AND a file is attached', () => {
    const { rerender } = render(
      <FileAttachment knowledgeFile={userProvidedFile} value={undefined} onChange={vi.fn()} signedIn userId="u1" />,
    );
    // Signed in but nothing attached yet — no save button (no implicit upload).
    expect(screen.queryByTestId('stored-file-save')).toBeNull();

    rerender(
      <FileAttachment knowledgeFile={userProvidedFile} value="attached content" onChange={vi.fn()} signedIn userId="u1" />,
    );
    expect(screen.getByTestId('stored-file-save')).toBeInTheDocument();
  });

  it('reflects an existing stored copy and swaps the refresh warning for a saved note', () => {
    render(
      <FileAttachment
        knowledgeFile={userProvidedFile}
        value={undefined}
        onChange={vi.fn()}
        signedIn
        userId="u1"
        savedMeta={{ id: 'f1', storagePath: 'u1/your-brand-guidelines' }}
      />,
    );
    expect(screen.getByTestId('stored-file-saved')).toBeInTheDocument();
    expect(screen.getByTestId('stored-file-remove')).toBeInTheDocument();
    // The in-browser-only warning is replaced by the saved-copy note.
    expect(screen.queryByText(/Files stay in your browser/i)).toBeNull();
    expect(screen.getByText(/used at export even after a refresh/i)).toBeInTheDocument();
  });
});
