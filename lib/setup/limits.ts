/**
 * Verified target limits for the Claude app (claude.ai) Projects feature.
 *
 * Sources checked 2026-07-01:
 *   https://support.claude.com/en/articles/8241126-upload-files-to-claude
 *   https://support.claude.com/en/articles/9517075-what-are-projects
 *   https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features
 */

/**
 * Maximum characters allowed in a Claude Project's custom instructions field.
 *
 * ASSUMPTION — no official number found as of 2026-07-01.
 * Anthropic's support and docs pages for Projects do not publish a hard character
 * cap for project instructions. Third-party sources suggest roughly 8 000 chars in
 * practice. Profile-level instructions are capped at 1 500 chars (a separate field).
 * 6 000 is chosen as a deliberately conservative floor; revisit against official docs
 * when Anthropic publishes an explicit limit. Value is well below the 25 000-char
 * "over limit" test fixture, satisfying the constraint that the real limit < 25 000.
 */
export const CLAUDE_APP_INSTRUCTION_MAX_CHARS = 6_000;

/**
 * Maximum number of files that can be added to a Claude Project's knowledge base.
 *
 * ASSUMPTION — no official hard count found as of 2026-07-01.
 * Official docs (support.claude.com/en/articles/8241126) state project knowledge
 * files are "unlimited" subject to the model's context window. The per-conversation
 * upload cap is 20 files; 20 is used here as a conservative practical floor until
 * Anthropic publishes an explicit per-project file-count limit.
 */
export const CLAUDE_APP_MAX_FILES = 20;

/**
 * Maximum size in bytes of a single file uploaded to Claude Project knowledge.
 *
 * Verified 2026-07-01 via support.claude.com/en/articles/8241126-upload-files-to-claude:
 * "For projects you can upload files up to 30MB each."
 * 30 MB = 30 × 1 024 × 1 024 = 31 457 280 bytes.
 */
export const CLAUDE_APP_MAX_FILE_BYTES = 30 * 1_024 * 1_024; // 31 457 280
