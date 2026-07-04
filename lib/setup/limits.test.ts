import { describe, it, expect } from 'vitest';
import {
  CLAUDE_APP_INSTRUCTION_MAX_CHARS,
  CLAUDE_APP_MAX_FILES,
  CLAUDE_APP_MAX_FILE_BYTES,
  CLAUDE_CODE_INSTRUCTION_MAX_CHARS,
  CLAUDE_CODE_MAX_FILES,
  CLAUDE_CODE_MAX_FILE_BYTES,
} from './limits';

describe('target limits are present, positive, and documented', () => {
  it('CLAUDE_APP_INSTRUCTION_MAX_CHARS is a positive number', () => {
    expect(typeof CLAUDE_APP_INSTRUCTION_MAX_CHARS).toBe('number');
    expect(CLAUDE_APP_INSTRUCTION_MAX_CHARS).toBeGreaterThan(0);
  });

  it('CLAUDE_APP_MAX_FILES is a positive number', () => {
    expect(typeof CLAUDE_APP_MAX_FILES).toBe('number');
    expect(CLAUDE_APP_MAX_FILES).toBeGreaterThan(0);
  });

  it('CLAUDE_APP_MAX_FILE_BYTES is a positive number', () => {
    expect(typeof CLAUDE_APP_MAX_FILE_BYTES).toBe('number');
    expect(CLAUDE_APP_MAX_FILE_BYTES).toBeGreaterThan(0);
  });

  it('all three claude-app constants are exported from the module', () => {
    expect(CLAUDE_APP_INSTRUCTION_MAX_CHARS).toBeDefined();
    expect(CLAUDE_APP_MAX_FILES).toBeDefined();
    expect(CLAUDE_APP_MAX_FILE_BYTES).toBeDefined();
  });
});

describe('claude-code target limits are present and positive', () => {
  it('CLAUDE_CODE_INSTRUCTION_MAX_CHARS is a positive number', () => {
    expect(typeof CLAUDE_CODE_INSTRUCTION_MAX_CHARS).toBe('number');
    expect(CLAUDE_CODE_INSTRUCTION_MAX_CHARS).toBeGreaterThan(0);
  });

  it('CLAUDE_CODE_MAX_FILES is a positive number', () => {
    expect(typeof CLAUDE_CODE_MAX_FILES).toBe('number');
    expect(CLAUDE_CODE_MAX_FILES).toBeGreaterThan(0);
  });

  it('CLAUDE_CODE_MAX_FILE_BYTES is a positive number', () => {
    expect(typeof CLAUDE_CODE_MAX_FILE_BYTES).toBe('number');
    expect(CLAUDE_CODE_MAX_FILE_BYTES).toBeGreaterThan(0);
  });

  it('all three claude-code constants are exported from the module', () => {
    expect(CLAUDE_CODE_INSTRUCTION_MAX_CHARS).toBeDefined();
    expect(CLAUDE_CODE_MAX_FILES).toBeDefined();
    expect(CLAUDE_CODE_MAX_FILE_BYTES).toBeDefined();
  });
});
