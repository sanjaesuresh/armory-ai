import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const sendMock = vi.fn();

// Mock the 'resend' SDK so no network call is ever made in tests.
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

describe('sendEmail', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    sendMock.mockReset();
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('no-ops (never throws, never calls Resend) when RESEND_API_KEY is unset', async () => {
    delete process.env.RESEND_API_KEY;
    const { sendEmail } = await import('./client');
    const result = await sendEmail({ to: 'a@b.com', subject: 'S', html: '<p>x</p>', text: 'x' });
    expect(result.sent).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('calls Resend.emails.send with the expected payload when the key is set', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    sendMock.mockResolvedValue({ data: { id: 'abc' }, error: null });
    const { sendEmail } = await import('./client');
    const result = await sendEmail({ to: 'a@b.com', subject: 'Subject', html: '<p>x</p>', text: 'x' });
    expect(result.sent).toBe(true);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'a@b.com', subject: 'Subject', html: '<p>x</p>', text: 'x' }),
    );
  });

  it('uses EMAIL_FROM when set, else the default From address', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.EMAIL_FROM = 'Custom <custom@send.armoryhq.dev>';
    sendMock.mockResolvedValue({ data: { id: 'abc' }, error: null });
    const { sendEmail } = await import('./client');
    await sendEmail({ to: 'a@b.com', subject: 'S', html: '<p>x</p>', text: 'x' });
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'Custom <custom@send.armoryhq.dev>' }),
    );
  });

  it('returns sent:false (never throws) when Resend returns an error payload', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    sendMock.mockResolvedValue({ data: null, error: { message: 'invalid domain' } });
    const { sendEmail } = await import('./client');
    const result = await sendEmail({ to: 'a@b.com', subject: 'S', html: '<p>x</p>', text: 'x' });
    expect(result.sent).toBe(false);
  });

  it('returns sent:false (never throws) when Resend rejects', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    sendMock.mockRejectedValue(new Error('network down'));
    const { sendEmail } = await import('./client');
    const result = await sendEmail({ to: 'a@b.com', subject: 'S', html: '<p>x</p>', text: 'x' });
    expect(result.sent).toBe(false);
  });
});
