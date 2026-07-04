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

// ─── ChatGPT (OpenAI) target limits ───────────────────────────────────────────
//
// Sources checked 2026-07-03: OpenAI Help Center pages for Custom GPTs and
// Custom Instructions. Official published hard numbers are sparse and shift, so
// every value below is a deliberately conservative floor marked ASSUMPTION —
// re-verify against OpenAI's docs before relaxing any of them.

/**
 * Maximum characters allowed in a Custom GPT's Instructions field.
 *
 * ASSUMPTION — verify against OpenAI docs (checked 2026-07-03).
 * The Custom GPT builder's Instructions field is widely reported at ~8 000
 * characters; the separate ChatGPT "Custom Instructions" boxes are ~1 500 chars
 * each. 8 000 is used as the target limit for the recommended Custom GPT path
 * (the no-builder path is a fallback that appends knowledge inline and is honest
 * about the trade-off). Conservative floor; revisit when OpenAI publishes an
 * explicit cap.
 */
export const CHATGPT_INSTRUCTION_MAX_CHARS = 8_000;

/**
 * Maximum number of knowledge files on a Custom GPT.
 *
 * ASSUMPTION — verify against OpenAI docs (checked 2026-07-03).
 * Custom GPTs are commonly documented at 20 knowledge files. 20 is used as a
 * conservative practical floor.
 */
export const CHATGPT_MAX_FILES = 20;

/**
 * Maximum size in bytes of a single Custom GPT knowledge file.
 *
 * ASSUMPTION — verify against OpenAI docs (checked 2026-07-03).
 * OpenAI's per-file ceiling for Custom GPT knowledge is higher than this, but a
 * 30 MB floor (matching the verified Claude value) is a safe conservative bound
 * until an explicit number is confirmed.
 */
export const CHATGPT_MAX_FILE_BYTES = 30 * 1_024 * 1_024; // 31 457 280

// ─── Claude Code target limits ────────────────────────────────────────────────
//
// Sources checked 2026-07-04: docs.anthropic.com/en/docs/claude-code (quickstart,
// memory, settings, and configuration reference pages). Anthropic does not publish
// explicit character or byte limits for Claude Code memory files (CLAUDE.md) or
// project knowledge files in its official documentation as of this date. All values
// below are conservative assumption floors; re-verify when Anthropic publishes
// explicit limits.

/**
 * Maximum characters allowed in a Claude Code project memory file (CLAUDE.md).
 *
 * ASSUMPTION — no official number found as of 2026-07-04.
 * Claude Code reads CLAUDE.md into context before every conversation. The model
 * context window is large (~200 K tokens), but memory files are recommended to be
 * concise and focused. 10 000 characters is a conservative practical floor that
 * keeps the memory file useful without crowding out the conversation; revisit
 * when Anthropic publishes explicit guidance on CLAUDE.md size limits.
 */
export const CLAUDE_CODE_INSTRUCTION_MAX_CHARS = 10_000;

/**
 * Maximum number of knowledge files that can be added to a Claude Code project.
 *
 * ASSUMPTION — no official hard count found as of 2026-07-04.
 * Claude Code can reference any file in the project directory. No published
 * file-count limit exists. 20 is used as a conservative practical floor
 * matching the other export targets.
 */
export const CLAUDE_CODE_MAX_FILES = 20;

/**
 * Maximum size in bytes of a single Claude Code knowledge file.
 *
 * ASSUMPTION — no official byte ceiling found as of 2026-07-04.
 * Files are served from the local filesystem; no hard upload limit applies in
 * the same way it does for cloud-hosted targets. 30 MB (= 30 × 1 024 × 1 024
 * bytes) is used as a conservative practical floor matching the other export
 * targets, and reflects a practical upper bound for content that can be read
 * usefully within a single conversation context.
 */
export const CLAUDE_CODE_MAX_FILE_BYTES = 30 * 1_024 * 1_024; // 31 457 280
