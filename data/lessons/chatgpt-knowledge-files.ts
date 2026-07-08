/**
 * Lesson: What really happens when you upload a file
 * Track: chatgpt | Order: 3 | Slug: chatgpt-knowledge-files
 *
 * Teaches the two mechanisms behind file uploads (full-context vs retrieval),
 * the retrieval flow diagram, and why specific questions outperform vague ones.
 */

import type { Lesson } from '@/lib/learn/types';

export const chatgptKnowledgeFiles: Lesson = {
  slug: 'chatgpt-knowledge-files',
  track: 'chatgpt',
  title: 'How file uploads work',
  tagline: 'Larger files are indexed, not read in full, the model sees only the most relevant passages, so specific questions get far better results than vague ones.',
  minutes: 5,
  order: 3,

  blocks: [
    // ─── Prose: two mechanisms ────────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'Not all uploads work the same way',
      paragraphs: [
        'When you upload a file to ChatGPT, you might assume the model reads every word before answering. For small files, that is roughly what happens, the whole document can fit in the context window (the amount of text the model can read at once) alongside your conversation, and the model sees it in full.',
        'For larger files, something different happens: the file is indexed. The content is split into chunks and stored in a way that makes it searchable. When you ask a question, the system retrieves only the chunks most likely to be relevant, and adds those to the context. The model then answers from those retrieved passages, not from the full document.',
        'This retrieval approach lets ChatGPT handle files much larger than would fit in the context window. But it also means the model is working from a selected excerpt. Broad or vague questions can miss information that is technically in the file, because the retrieval step did not pull the right chunks.',
      ],
    },

    // ─── Hotspot diagram: knowledge file flow ─────────────────────────────────
    {
      type: 'hotspotDiagram',
      diagramId: 'knowledge-file-flow',
      hotspots: [
        {
          id: 'your-file',
          title: 'Your file',
          body: 'The document you upload, a PDF, text file, spreadsheet, or other supported format. Once uploaded, it is processed and made available for the conversation.',
        },
        {
          id: 'index',
          title: 'Index',
          body: 'For larger files, the content is split into chunks and indexed, made searchable without loading the entire document into context. Think of it like the index at the back of a book: it maps topics to locations so the right sections can be found quickly.',
        },
        {
          id: 'question',
          title: 'Your question',
          body: 'When you ask something, your question is used to search the index. The system looks for the chunks of the file most likely to contain a relevant answer to what you asked.',
        },
        {
          id: 'retrieved-passages',
          title: 'Retrieved passages',
          body: 'The chunks the system selected as most relevant to your question. These are added to the context window alongside your question so the model can read them. Only these passages, not the whole file, are visible to the model for this turn.',
        },
        {
          id: 'answer',
          title: 'Answer',
          body: 'The model\'s response, based on the retrieved passages it was given. If the relevant information was in those chunks, the answer will be good. If the retrieval missed something important, the answer may be incomplete, even if the information is in the file.',
        },
      ],
    },

    // ─── Callout: retrieval gaps ──────────────────────────────────────────────
    {
      type: 'callout',
      tone: 'warning',
      passage: 'The model does not reread your entire file for every question, it works from the passages the retrieval step selected. If those passages missed something, the answer will too, even if the information is there. Specific questions ("What is the payment due date in clause 5?") retrieve more precisely than vague ones ("What should I know about this contract?"). When an answer seems incomplete, try rephrasing with more detail about exactly what you need.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'For a large uploaded file, what does ChatGPT actually read when answering a question?',
        choices: [
          'The entire file from beginning to end',
          'A fixed number of pages from the start of the file',
          'The passages retrieved from the file index that are most relevant to your question',
        ],
        correctIndex: 2,
        explanation:
          'Large files are indexed, split into chunks and made searchable. When you ask a question, the system retrieves the chunks most likely to answer it, and the model works from those retrieved passages. The whole file is not read in one go.',
      },
      {
        prompt: 'Why might ChatGPT miss something that is definitely in your uploaded file?',
        choices: [
          'ChatGPT only reads the first few pages of any file regardless of size',
          'The retrieval step may not have selected the passages containing that information',
          'Files are scanned for size and deleted if they are too large',
        ],
        correctIndex: 1,
        explanation:
          'The retrieval step selects passages based on relevance to your question. If the relevant chunk was not retrieved, because the question was too vague or the match was not strong, the model will not see it and cannot include it in the answer.',
      },
      {
        prompt: 'Which question is more likely to retrieve the right information from a contract?',
        choices: [
          '"What should I know about this contract?"',
          '"What is the payment schedule in this contract?"',
          'Both will perform equally well',
        ],
        correctIndex: 1,
        explanation:
          'Specific questions give the retrieval system a clear target. "What is the payment schedule?" searches for passages about payment terms and is likely to find them. Broad questions like "what should I know?" cast a wide net that may return general passages and miss the specifics you actually need.',
      },
      {
        prompt: 'What is the main reason file uploads are indexed rather than always placed directly into context?',
        choices: [
          'Indexed files are always more accurate than files read directly',
          'Indexing allows much larger files to be used than would fit in the context window',
          'It prevents the model from reading confidential sections of a document',
        ],
        correctIndex: 1,
        explanation:
          'A context window can only hold so much text. Indexing lets the system handle documents far too large to fit, it pulls only the relevant chunks into context rather than the whole file. The trade-off is that retrieval is not perfect: the model only sees what the retrieval step selects.',
      },
    ],
  },

  applyCta: null,
};
