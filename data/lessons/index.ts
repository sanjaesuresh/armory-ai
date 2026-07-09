/**
 * Lesson registry — the ordered array of all Learn AI lessons.
 *
 * Empty in Task 2; content is appended by Tasks 9–12 (one track per task).
 *
 * Import this array anywhere that needs the full lesson list (hub, player,
 * route static params, content validation suite).
 */

import type { Lesson } from '@/lib/learn/types';

// Task 9: Foundations track (lessons 1–3)
import { howAiChatWorks } from '@/data/lessons/how-ai-chat-works';
import { contextWindow } from '@/data/lessons/context-window';
import { instructionsSteering } from '@/data/lessons/instructions-steering';

// Task 10: ChatGPT track (lessons 1–4)
import { chatgptCustomInstructions } from '@/data/lessons/chatgpt-custom-instructions';
import { chatgptProjects } from '@/data/lessons/chatgpt-projects';
import { chatgptKnowledgeFiles } from '@/data/lessons/chatgpt-knowledge-files';
import { chatgptGptsVsProjects } from '@/data/lessons/chatgpt-gpts-vs-projects';

// Task 11: Claude App track (lessons 1–4)
import { claudeProjects } from '@/data/lessons/claude-projects';
import { claudeStyles } from '@/data/lessons/claude-styles';
import { claudeArtifacts } from '@/data/lessons/claude-artifacts';
import { claudeVsChatgptMap } from '@/data/lessons/claude-vs-chatgpt-map';

// Claude Code track (lessons 1–4)
import { claudeCodeIntro } from '@/data/lessons/claude-code-intro';
import { claudeCodeSkills } from '@/data/lessons/claude-code-skills';
import { claudeCodeAgents } from '@/data/lessons/claude-code-agents';
import { claudeCodeHarness } from '@/data/lessons/claude-code-harness';

// AI Engineering track (overview + three deep lessons)
import { aiEngineeringTypes } from '@/data/lessons/ai-engineering-types';
import { promptEngineering } from '@/data/lessons/prompt-engineering';
import { contextEngineering } from '@/data/lessons/context-engineering';
import { loopEngineering } from '@/data/lessons/loop-engineering';

export const ALL_LESSONS: Lesson[] = [
  // Foundations
  howAiChatWorks,
  contextWindow,
  instructionsSteering,

  // ChatGPT
  chatgptCustomInstructions,
  chatgptProjects,
  chatgptKnowledgeFiles,
  chatgptGptsVsProjects,

  // Claude App
  claudeProjects,
  claudeStyles,
  claudeArtifacts,
  claudeVsChatgptMap,

  // Claude Code
  claudeCodeIntro,
  claudeCodeSkills,
  claudeCodeAgents,
  claudeCodeHarness,

  // AI Engineering
  aiEngineeringTypes,
  promptEngineering,
  contextEngineering,
  loopEngineering,
];
