import type { Setup } from '@/lib/setup/types';

export const recruiterSkills: Setup[] = [
  // ── 1. Job Description Writer ──────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-jd-writer-v1',
    slug: 'recruiter-jd-writer',
    name: 'Job Description Writer',
    tagline: 'Turn a role brief into an inclusive, structured job description',
    description:
      'Converts a role brief into a publication-ready job description. ' +
      'Applies bias-aware language rules automatically, no rockstars, no ninja engineers, ' +
      'no years-of-experience proxies. Produces a consistent structure every time.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['job-descriptions', 'hiring', 'inclusion', 'recruiting', 'hr', 'talent-acquisition'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are an inclusive job description writer for {{companyName}}.

Write a complete, structured job description for the {{roleName}} role in the {{department}} team at {{seniorityLevel}} seniority.

Structure every JD in this order:
1. About {{companyName}} (2–3 sentences, factual, no superlatives)
2. About the role (2–4 sentences describing impact, not just tasks)
3. What you will do (5–6 bullet points, each starting with a verb)
4. What we are looking for (3–5 genuine requirements only, remove anything nice-to-have)
5. Nice to have (1–3 optional items, clearly labeled)
{{#if includeCompensation}}
6. Compensation and benefits (salary range, equity, bonus, PTO, notable perks)
{{/if}}

Bias-aware language rules, apply to every word:
- Gender-neutral language and job titles throughout; use "they/them" when pronoun is unknown.
- Avoid: rockstar, ninja, aggressive, dominant, digital native, recent graduate, energetic.
- Requirements must reflect actual job needs; do not use years-of-experience as a proxy for skill level.
- Do not mix nice-to-have items into the required list.
- Do not use language implying a preference for any age, background, or life stage.
- No discriminatory language; keep all role and candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name as it should appear in the job posting.',
        group: 'Role details',
      },
      {
        key: 'roleName',
        label: 'Job title',
        type: 'text',
        required: true,
        helpText: 'Exact job title for the role, e.g. "Senior Product Designer."',
        group: 'Role details',
      },
      {
        key: 'department',
        label: 'Team or department',
        type: 'text',
        required: true,
        helpText: 'Team or department this role sits in, e.g. "Product & Design."',
        group: 'Role details',
      },
      {
        key: 'seniorityLevel',
        label: 'Seniority level',
        type: 'select',
        options: ['Entry-level', 'Mid-level', 'Senior', 'Staff', 'Lead', 'Director'],
        default: 'Mid-level',
        required: true,
        helpText: 'The seniority level shapes the requirements and responsibilities language.',
        group: 'Role details',
      },
      {
        key: 'includeCompensation',
        label: 'Include a compensation and benefits section?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to include salary range, equity, and benefits. Leave off if company policy prohibits.',
        group: 'Options',
      },
    ],

    knowledgeFiles: [
      {
        name: 'JD writing reference card',
        purpose:
          'A quick-reference checklist and banned-phrase list the assistant consults before finalising ' +
          'any job description. Keeps language consistent and inclusive across all roles.',
        kind: 'starter',
        content: `# JD Writing Reference Card

## Banned phrases (never use these)
rockstar, ninja, wizard, guru, superhero, aggressive, dominant, digital native,
recent graduate, energetic, young team, fast-paced startup culture, work hard play hard

## Years-of-experience rule
Do NOT write "5+ years of experience in X." Write what the person must be able to DO.
✗ "5+ years of Python experience"
✓ "Can design and ship production-grade Python services independently"

## Gender-neutral titles
✗ Salesman, Manpower, Chairman, Stewardess
✓ Sales representative, Staffing, Chair, Flight attendant

## Requirements vs. nice-to-have
Put an item in requirements only if a candidate without it would be rejected.
Everything else goes in the Nice to have section.

## Structure checklist
- [ ] About the company: factual, no superlatives
- [ ] About the role: impact-first, not task-list
- [ ] What you will do: verb-first bullet points
- [ ] Requirements: genuine blockers only
- [ ] Nice to have: clearly separated and labeled
- [ ] Compensation (if included): salary range or "competitive, DOE"
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-jd-writer-scenario-1',
        title: 'Write a JD for a senior engineering role',
        userInput:
          'Write a job description for a Senior Backend Engineer on our Payments team. ' +
          'They will own the reliability and scalability of our payment processing service, ' +
          'work with a distributed team of five engineers, and report to the Engineering Manager. ' +
          'We use Go and PostgreSQL. Series B company, 90 employees.',
        expectedBehavior:
          'Claude should produce a complete JD with all five standard sections. ' +
          'Requirements should describe capabilities (not years of experience), use gender-neutral language, ' +
          'and avoid banned phrases. The JD should mention Go, PostgreSQL, the Payments team, ' +
          'and the cross-functional context. "Rockstar," "ninja," or similar words must not appear.',
        mustContain: ['Senior Backend Engineer', 'Go', 'PostgreSQL', 'Payments'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-jd-writer-scenario-2',
        title: 'Flag exclusionary language in an existing JD',
        userInput:
          'Review this job description for our Sales Manager role and flag any exclusionary language:\n\n' +
          '"We need a rockstar sales ninja who is aggressive, energetic, and a recent graduate with 3–5 years ' +
          'of SaaS sales experience. Join our young team and help us dominate the market."',
        expectedBehavior:
          'Claude should identify each problematic phrase specifically, rockstar, ninja, aggressive, energetic, ' +
          'recent graduate, young team, dominate, and explain why each may deter qualified candidates or ' +
          'reflect demographic bias. It should suggest neutral replacements for each flagged term.',
        mustContain: ['rockstar', 'ninja', 'aggressive', 'energetic'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 2. Boolean Search Builder ──────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-boolean-search-v1',
    slug: 'recruiter-boolean-search',
    name: 'Boolean Search Builder',
    tagline: 'Build a precise Boolean sourcing string from role criteria',
    description:
      'Generates a ready-to-paste Boolean search string for sourcing candidates on LinkedIn, GitHub, or ' +
      'Google X-ray. Explains each clause in plain English so recruiters can tune it without Boolean expertise.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['sourcing', 'boolean-search', 'recruiting', 'talent-acquisition', 'hr', 'linkedin'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a Boolean search specialist helping a recruiter source candidates.

Build a precise Boolean search string to find candidates for the {{targetRole}} role on {{searchPlatform}}.

Must-have skills or titles (match these): {{mustHaveSkills}}
Nice-to-have skills (boost these where possible): {{niceToHaveSkills}}
Terms to exclude from results: {{excludeTerms}}

Output format:
1. The Boolean string, ready to paste, no commentary inline
2. Clause-by-clause explanation in plain English (one sentence per clause)
3. A brief warning if any clause is likely too broad (overwhelms results) or too narrow (near-zero results)

Rules:
1. Use AND, OR, NOT, and quoted phrases for exact matches; group OR alternatives in parentheses.
2. Do not use demographic or protected-class terms as search filters.
3. Flag if the platform does not support a particular Boolean operator and suggest the platform-specific alternative.
4. Keep candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'targetRole',
        label: 'Role you are sourcing for',
        type: 'text',
        required: true,
        helpText: 'Job title or role type, e.g. "Senior Data Engineer" or "UX Researcher."',
        group: 'Search criteria',
      },
      {
        key: 'searchPlatform',
        label: 'Platform',
        type: 'select',
        options: ['LinkedIn', 'GitHub', 'Google X-ray', 'Indeed', 'Other'],
        default: 'LinkedIn',
        required: true,
        helpText: 'The platform where you will run this search.',
        group: 'Search criteria',
      },
      {
        key: 'mustHaveSkills',
        label: 'Must-have skills or titles',
        type: 'multiline',
        required: true,
        helpText:
          'List the skills, technologies, or alternative titles a candidate must have. ' +
          'One per line or comma-separated.',
        group: 'Search criteria',
      },
      {
        key: 'niceToHaveSkills',
        label: 'Nice-to-have skills',
        type: 'text',
        required: true,
        helpText: 'Optional skills that strengthen a candidate\'s profile. Comma-separated.',
        group: 'Search criteria',
      },
      {
        key: 'excludeTerms',
        label: 'Terms to exclude',
        type: 'text',
        required: true,
        helpText: 'Words or phrases to exclude, e.g. "recruiter, staffing agency, consultant." Comma-separated.',
        group: 'Search criteria',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Boolean search quick reference',
        purpose:
          'Operator reference and common title synonyms the assistant uses to build more complete search strings.',
        kind: 'starter',
        content: `# Boolean Search Quick Reference

## Operators
AND, both terms must appear: Python AND "machine learning"
OR, either term works (group in parentheses): (ML OR "machine learning" OR AI)
NOT, exclude a term: NOT recruiter
"", exact phrase match: "product manager"
(), group OR alternatives to control precedence

## LinkedIn-specific notes
- LinkedIn Recruiter supports AND, OR, NOT, and quotes.
- LinkedIn Basic search is limited; use quotes for titles and company names.
- LinkedIn does NOT support wildcard (*) inside field searches reliably.

## Common title synonyms to bundle with OR
Data Engineer: "data engineer" OR "data pipeline" OR "ETL engineer"
Product Manager: "product manager" OR "PM" OR "product owner"
UX Designer: "UX designer" OR "UX researcher" OR "product designer" OR "UI/UX"
Frontend Engineer: "frontend engineer" OR "front-end engineer" OR "React developer" OR "Vue developer"
Backend Engineer: "backend engineer" OR "back-end engineer" OR "software engineer"
DevOps: "DevOps engineer" OR "SRE" OR "platform engineer" OR "infrastructure engineer"

## Exclusion tips
Exclude agency and staff-aug profiles: NOT (recruiter OR staffing OR "contract to hire")
Exclude vendor/consultant noise: NOT (consultant OR freelance OR "self-employed")

## Google X-ray template
site:linkedin.com/in/ "job title" ("skill1" OR "skill2") -"term to exclude"
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-boolean-search-scenario-1',
        title: 'Build a LinkedIn search for a machine learning engineer',
        userInput:
          'Build a LinkedIn Boolean search for a Machine Learning Engineer. ' +
          'Must have: Python, PyTorch or TensorFlow, and experience deploying models to production. ' +
          'Nice to have: Kubernetes, MLflow. Exclude: recruiter, consultant, freelance.',
        expectedBehavior:
          'Claude should produce a ready-to-paste Boolean string that combines the must-have skills ' +
          'with AND, groups alternatives with OR and parentheses, and uses NOT to exclude the unwanted terms. ' +
          'The clause explanation must cover each part. It should flag if any clause seems too restrictive.',
        mustContain: ['Python', 'PyTorch', 'TensorFlow', 'Kubernetes'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-boolean-search-scenario-2',
        title: 'Build a Google X-ray search for a Head of Finance',
        userInput:
          'Build a Google X-ray search on LinkedIn for a Head of Finance or CFO at a Series B–D SaaS company. ' +
          'Must have: FP&A, SaaS metrics, fundraising experience. Exclude: staffing, recruiter.',
        expectedBehavior:
          'Claude should produce a Google X-ray string using the site:linkedin.com/in/ format, ' +
          'group the title alternatives (Head of Finance, CFO) with OR, include the required skills, ' +
          'and exclude the unwanted terms. The explanation should note that X-ray is Google-based, ' +
          'not the LinkedIn native search, and flag any operator differences.',
        mustContain: ['Head of Finance', 'CFO', 'FP&A', 'SaaS'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 3. Candidate Outreach ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-outreach-v1',
    slug: 'recruiter-outreach',
    name: 'Candidate Outreach',
    tagline: 'Write a personalized outreach message that passive candidates actually reply to',
    description:
      'Drafts a personalized candidate outreach message for LinkedIn InMail, email, or DM. ' +
      'Opens with a specific observation about the candidate\'s background, never a generic opener, ' +
      'and closes with a low-friction ask.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['outreach', 'sourcing', 'recruiting', 'linkedin', 'talent-acquisition', 'hr'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a recruiter at {{companyName}} writing a {{outreachChannel}} message to a passive candidate for the {{roleName}} role.

Candidate background to personalise the message around: {{candidateBackground}}

Target message length: {{messageLength}}

Rules:
1. Open with a specific, genuine observation about the candidate's background. Never open with "I came across your profile and was impressed" or any variation of it.
2. State the role and one concrete reason it may be relevant to this specific candidate, draw directly from the background notes.
3. Close with a low-friction ask: a 20-minute conversation, not a full application or interview.
4. Do not oversell urgency, exclusivity, or the company.
5. No discriminatory language; keep candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'The company you are recruiting for.',
        group: 'Context',
      },
      {
        key: 'roleName',
        label: 'Role name',
        type: 'text',
        required: true,
        helpText: 'The job title you are reaching out about.',
        group: 'Context',
      },
      {
        key: 'outreachChannel',
        label: 'Outreach channel',
        type: 'select',
        options: ['LinkedIn InMail', 'Email', 'Twitter/X DM', 'Other'],
        default: 'LinkedIn InMail',
        required: true,
        helpText: 'The channel shapes the tone, length norms, and formality of the message.',
        group: 'Context',
      },
      {
        key: 'candidateBackground',
        label: 'Candidate background notes',
        type: 'multiline',
        required: true,
        helpText:
          'Paste relevant highlights from the candidate\'s profile, current role, notable projects, skills, ' +
          'or anything you want to reference. The more specific, the better the personalisation.',
        group: 'Personalisation',
      },
      {
        key: 'messageLength',
        label: 'Target message length',
        type: 'select',
        options: ['Under 80 words', '80–150 words', '150–250 words'],
        default: 'Under 80 words',
        required: true,
        helpText: 'Shorter messages get higher reply rates for cold outreach. Use longer only for warm leads.',
        group: 'Options',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Outreach message reference card',
        purpose:
          'Openers to avoid, high-reply-rate structures, and a subject-line formula for email outreach.',
        kind: 'starter',
        content: `# Outreach Message Reference Card

## Openers that kill reply rates (never use these)
- "I came across your profile and was impressed."
- "I hope this message finds you well."
- "We're a fast-growing startup and I'd love to connect."
- "Are you open to new opportunities?"
- "Your background caught my eye."

## High-performing opener formula
Reference something SPECIFIC from the candidate's work:
  "[Specific observation about their project, company, or skill], that's exactly the kind of [X] we're building for at [Company]."

## Message structure that works
1. Specific opener (1 sentence)
2. Role + why it fits them (1–2 sentences)
3. Low-friction ask (1 sentence)
Total: under 100 words for cold InMail; under 150 for email

## Email subject line formula
"[Role] at [Company], [one-word or phrase that connects to their background]"
Example: "Staff Engineer at Acme, distributed systems background"

## Asks that work vs. asks that don't
✗ "Would you be open to a full interview process?"
✓ "Would a 20-minute call this week or next be worth your time?"
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-outreach-scenario-1',
        title: 'Draft a LinkedIn InMail to a passive data scientist',
        userInput:
          'Draft a LinkedIn InMail to a Senior Data Scientist currently at Spotify who has published ' +
          'work on recommendation systems and causal inference. We are hiring for a Staff Data Scientist ' +
          'role on our personalization team. Keep it under 80 words.',
        expectedBehavior:
          'Claude should produce a short InMail that opens with a specific reference to the candidate\'s ' +
          'published work on recommendation systems or causal inference, not a generic opener. ' +
          'It should name the Staff Data Scientist role and the personalization team, and close with a ' +
          'low-friction ask. It must stay under 80 words and avoid "I came across your profile."',
        mustContain: ['Spotify', 'recommendation systems', 'Staff Data Scientist'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-outreach-scenario-2',
        title: 'Write an email to a VP-level candidate',
        userInput:
          'Write a recruiting email to a VP of Marketing currently at a Series C fintech company. ' +
          'She led a rebrand that tripled organic traffic and scaled the team from 3 to 18 people. ' +
          'We are hiring a VP of Marketing for our B2B SaaS company. Length: 80–150 words.',
        expectedBehavior:
          'Claude should write an email that references the rebrand outcome (tripled organic traffic) ' +
          'or the team scaling (3 to 18 people) specifically. It should connect those achievements to ' +
          'why the VP of Marketing role at a B2B SaaS company is relevant. The close should be a ' +
          'low-friction ask, and the tone should be peer-level, not sales-y.',
        mustContain: ['VP of Marketing', 'B2B SaaS', 'organic traffic'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 4. Screening Question Set ──────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-screening-questions-v1',
    slug: 'recruiter-screening-questions',
    name: 'Screening Question Set',
    tagline: 'Generate a structured phone-screen question set for any role',
    description:
      'Builds a role-specific phone-screen question set with a brief note after each question on what a ' +
      'strong answer sounds like. Flags legally problematic questions before they go to candidates.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['screening', 'interviewing', 'recruiting', 'hr', 'talent-acquisition', 'phone-screen'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a recruiter building a phone-screen question set for the {{roleName}} role.

What this screen must confirm: {{screeningGoal}}

Generate {{questionCount}}.

{{#if includeLogisticsCheck}}
Begin with 1–2 logistics questions covering location, work authorisation, earliest available start date, and compensation range expectations, before any role-specific questions.
{{/if}}

Format: number each question, then add a one-sentence "Listen for:" note explaining what a strong answer covers.

Rules:
1. Questions must be role-relevant and behavioral where possible.
2. Flag any question that could be legally problematic in common hiring jurisdictions, questions about age, family status, national origin, health, religion, or childcare arrangements are off-limits.
3. Do not include questions that can be answered by reading the candidate's resume.
4. No discriminatory language; keep candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'roleName',
        label: 'Role name',
        type: 'text',
        required: true,
        helpText: 'The job title you are screening for, e.g. "Account Executive" or "Staff Engineer."',
        group: 'Role details',
      },
      {
        key: 'screeningGoal',
        label: 'What must this screen confirm?',
        type: 'multiline',
        required: true,
        helpText:
          'List the key things you need to verify, skills, scope of experience, ' +
          'motivation, or any must-haves the JD requires. Two to four items is typical.',
        group: 'Role details',
      },
      {
        key: 'questionCount',
        label: 'Number of questions',
        type: 'select',
        options: ['5 questions', '8 questions', '10 questions'],
        default: '8 questions',
        required: true,
        helpText: 'Match this to your available screen time, 5 for a 20-min screen, 8–10 for a 45-min screen.',
        group: 'Options',
      },
      {
        key: 'includeLogisticsCheck',
        label: 'Include logistics questions at the start?',
        type: 'boolean',
        default: true,
        required: false,
        helpText:
          'Turn on to add questions about location, work authorisation, start date, and compensation range ' +
          'before the role-specific questions.',
        group: 'Options',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Screening question guidelines',
        purpose:
          'A list of legally off-limits question topics, behavioral question stems, and a short rubric ' +
          'for what makes a strong screening answer.',
        kind: 'starter',
        content: `# Screening Question Guidelines

## Legally off-limits topics (never ask about these)
- Age or date of birth
- Family status, marital status, or childcare arrangements
- National origin, citizenship (can ask "authorised to work in [country]?", no more)
- Religion or religious observance
- Disability or health conditions
- Pregnancy or plans to have children
- Sexual orientation or gender identity

## Strong behavioral question stems
- "Tell me about a time you…"
- "Walk me through a situation where…"
- "Give me an example of when you had to…"
- "Describe a project where you…"

## What makes a strong screening answer
A strong answer follows a STAR-like pattern: describes the Situation briefly, explains the Action the candidate took, and shares a concrete Result. Vague answers ("I generally…", "We usually…") are weak signals.

## Logistics questions that are legal and useful
- "Are you authorised to work in [country] without sponsorship?"
- "What is your earliest available start date?"
- "What compensation range are you targeting?"
- "Is this role's location / remote arrangement workable for you?"
- "Are there any scheduling constraints we should know about before moving forward?"
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-screening-questions-scenario-1',
        title: 'Generate screening questions for a Customer Success Manager',
        userInput:
          'Generate 8 screening questions for a Customer Success Manager role at a B2B SaaS company. ' +
          'The screen must confirm: experience managing enterprise accounts (100k+ ARR), ' +
          'ability to drive expansion revenue, and comfort with data and CRM tools like Salesforce. ' +
          'Include logistics questions at the start.',
        expectedBehavior:
          'Claude should produce 8 numbered questions starting with 1–2 logistics questions ' +
          '(work authorisation, start date, or compensation range), followed by behavioral questions ' +
          'specific to enterprise account management, expansion revenue, and Salesforce. ' +
          'Each question must include a "Listen for:" note. No legally off-limits questions.',
        mustContain: ['Customer Success Manager', 'enterprise accounts', 'Salesforce'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-screening-questions-scenario-2',
        title: 'Flag a legally problematic question and suggest a replacement',
        userInput:
          'Here are three screening questions I planned to ask for a Project Manager role. ' +
          'Tell me if any are problematic:\n' +
          '1. How long have you been working in project management?\n' +
          '2. Do you have children and will that affect your availability for travel?\n' +
          '3. Walk me through a complex cross-functional project you managed end to end.',
        expectedBehavior:
          'Claude should flag question 2 as legally off-limits (family status / childcare arrangements) ' +
          'and explain why it is problematic. It should suggest a legal replacement (e.g., "Are you able to ' +
          'meet the travel requirements of this role?"). Questions 1 and 3 may each get a brief note, ' +
          'question 1 could be improved to ask about scope rather than tenure.',
        mustContain: ['Do you have children', 'Project Manager', 'travel'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 5. Interview Scorecard ─────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-interview-scorecard-v1',
    slug: 'recruiter-interview-scorecard',
    name: 'Interview Scorecard',
    tagline: 'Build a structured, rubric-based scorecard for any interview panel',
    description:
      'Generates a structured interview scorecard with behavioral questions and a rating rubric for each ' +
      'competency. Keeps evaluations consistent, objective, and legally defensible across interviewers.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['interviewing', 'scorecard', 'structured-hiring', 'hr', 'recruiting', 'talent-acquisition'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a recruiter building a structured interview scorecard for the {{roleName}} role.

Competency areas to evaluate: {{competencyAreas}}

Rating scale: {{ratingScale}}

Build one section per competency. Each section must include:
- 2–3 behavioral interview questions targeting that competency
- A rating rubric: what a low, mid, and high {{ratingScale}} score looks like in behavioral terms
{{#if includeRedFlags}}
- A "Watch out for:" note with 1–2 signals that indicate a poor fit for this specific competency
{{/if}}

Rules:
1. All questions must be behavioral (past-tense: "Tell me about a time…") and role-relevant.
2. Flag any question that could be legally problematic before including it.
3. Rubric anchors must be behavior-based, no inferences about personality, culture fit, or demographics.
4. No discriminatory language; keep candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'roleName',
        label: 'Role name',
        type: 'text',
        required: true,
        helpText: 'The job title this scorecard is for.',
        group: 'Role details',
      },
      {
        key: 'competencyAreas',
        label: 'Competency areas to assess',
        type: 'multiline',
        required: true,
        helpText:
          'List each competency on a new line, e.g.:\n' +
          'Stakeholder communication\nData analysis and judgment\nCross-functional collaboration',
        group: 'Scorecard design',
      },
      {
        key: 'ratingScale',
        label: 'Rating scale',
        type: 'select',
        options: ['1–3', '1–4', '1–5'],
        default: '1–4',
        required: true,
        helpText:
          '1–4 is recommended: it forces a lean/hire decision and avoids the middle-of-scale bias common with 1–5.',
        group: 'Scorecard design',
      },
      {
        key: 'includeRedFlags',
        label: 'Include "Watch out for" notes per competency?',
        type: 'boolean',
        default: true,
        required: false,
        helpText:
          'Adds a brief list of red-flag signals for each competency to help interviewers spot weak evidence.',
        group: 'Options',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Scorecard design reference',
        purpose:
          'Rating scale guidance, behavioral anchor examples, and a list of legally off-limits ' +
          'evaluation criteria for interviewers.',
        kind: 'starter',
        content: `# Interview Scorecard Design Reference

## Recommended rating scale: 1–4
1, Strong no-hire: clear evidence of absence for this competency
2, Lean no-hire: limited or inconsistent evidence; significant gaps remain
3, Lean hire: solid evidence with minor gaps; manageable with onboarding support
4, Strong hire: clear, specific evidence of high performance in this competency

## What a strong behavioral anchor looks like
Weak anchor: "Communicates well with stakeholders"
Strong anchor: "Describes a specific stakeholder conflict, names what they did to resolve it, and gives a measurable outcome"

## Off-limits evaluation criteria (never score or note these)
- Likeability or "vibe"
- Cultural fit defined by personality or style, not values and behaviors
- Communication style, accent, or manner of speaking
- Age or tenure signals
- Family or personal circumstance

## Red-flag examples by competency type
Problem-solving: Describes what others did rather than their own contribution; cannot name the outcome.
Communication: Speaks only in generalities ("we usually…"); cannot name a specific difficult conversation.
Ownership: Credits team exclusively with no individual action; no example of going beyond their job scope.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-interview-scorecard-scenario-1',
        title: 'Build a scorecard for a Product Manager panel interview',
        userInput:
          'Build a structured scorecard for a Product Manager panel interview. ' +
          'Competencies: product strategy and prioritization, data-driven decision making, ' +
          'cross-functional influence. Rating scale: 1–4. Include watch-out notes.',
        expectedBehavior:
          'Claude should produce three scorecard sections, one per competency, each with 2–3 behavioral ' +
          'questions and a four-point rubric (1 through 4) with behavior-based anchors at each level. ' +
          'Each section should also include a "Watch out for:" note with 1–2 specific signals. ' +
          'No legally off-limits evaluation criteria should appear.',
        mustContain: ['product strategy', 'data-driven', 'cross-functional influence'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-interview-scorecard-scenario-2',
        title: 'Build a scorecard for a Sales Executive with a 1–5 scale',
        userInput:
          'Build an interview scorecard for a Senior Sales Executive role. ' +
          'Competencies: enterprise deal management, objection handling, pipeline discipline. ' +
          'Rating scale: 1–5. No need for watch-out notes.',
        expectedBehavior:
          'Claude should produce three scorecard sections with behavioral questions and a 1–5 rubric. ' +
          'Anchors should describe observable behaviors at 1, 3, and 5 at minimum, with behavior-based language ' +
          'throughout. No "Watch out for:" notes since the user said to exclude them.',
        mustContain: ['enterprise deal management', 'objection handling', 'pipeline discipline'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 6. Offer Letter Draft ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-offer-letter-v1',
    slug: 'recruiter-offer-letter',
    name: 'Offer Letter Draft',
    tagline: 'Draft a clear, complete offer letter from compensation details',
    description:
      'Produces a professional offer letter draft that covers all material terms. Inserts clearly marked ' +
      'placeholders for any missing information so nothing is accidentally omitted before legal review.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['offer-letter', 'hiring', 'compensation', 'hr', 'recruiting', 'talent-acquisition'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a recruiter at {{companyName}} drafting an offer letter for {{candidateName}}.

Role: {{roleName}}
Compensation and terms provided: {{compensationDetails}}

Write a professional offer letter covering all of these sections in order:
1. Congratulations opening (2 sentences max)
2. Role title, start date, reporting structure
3. Compensation: base salary, bonus (if applicable), equity (if applicable)
4. Benefits summary (healthcare, PTO, notable perks, use what is provided)
5. Contingencies (background check, reference checks, drug screening, include only what applies)
{{#if includeAtWillClause}}
6. At-will employment clause
{{/if}}
7. Acceptance instructions and deadline

Rules:
1. Do not invent any term not provided. Use [INSERT MISSING FIELD] as a placeholder for anything not given.
2. The letter must be factually accurate to what was provided, do not promise what you were not told.
3. Flag in a separate note after the letter anything that should be reviewed by legal counsel before sending.
4. No discriminatory language; keep candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name as it should appear on the offer letter.',
        group: 'Letter details',
      },
      {
        key: 'candidateName',
        label: 'Candidate name',
        type: 'text',
        required: true,
        helpText: 'The candidate\'s full name for the salutation and addressee line.',
        group: 'Letter details',
      },
      {
        key: 'roleName',
        label: 'Job title being offered',
        type: 'text',
        required: true,
        helpText: 'Exact job title as it will appear on the offer and in the system.',
        group: 'Letter details',
      },
      {
        key: 'compensationDetails',
        label: 'Compensation and terms',
        type: 'multiline',
        required: true,
        helpText:
          'Paste all material terms: base salary, bonus, equity, start date, reporting manager, ' +
          'benefits highlights, and any contingencies. If a field is unknown, leave it out and a placeholder will appear.',
        group: 'Letter details',
      },
      {
        key: 'includeAtWillClause',
        label: 'Include an at-will employment clause?',
        type: 'boolean',
        default: true,
        required: false,
        helpText:
          'Standard for US offers. Turn off for jurisdictions or roles where at-will language does not apply.',
        group: 'Options',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Offer letter checklist',
        purpose:
          'A pre-send checklist of every material term an offer letter must cover, plus flags for ' +
          'clauses that require legal review before sending.',
        kind: 'starter',
        content: `# Offer Letter Checklist

## Required fields, every offer must have these
- [ ] Candidate full name and address (or email delivery note)
- [ ] Job title (exact match to what will appear in HRIS)
- [ ] Start date
- [ ] Reporting manager name and title
- [ ] Base salary (annual or hourly) and pay frequency
- [ ] Contingencies that apply (background check, reference checks, etc.)
- [ ] Offer expiration date and acceptance instructions

## Conditional fields, include if applicable
- [ ] Annual or quarterly bonus: target %, conditions, and when paid
- [ ] Equity: grant size, vesting schedule, cliff, exercise window
- [ ] Signing bonus: amount, vesting/clawback terms
- [ ] Remote or hybrid arrangement details
- [ ] Relocation assistance terms

## Legal review flags (send to legal before delivering the letter)
- Non-compete or non-solicitation clauses
- IP assignment or invention assignment provisions
- Clawback terms on equity or signing bonus
- Offers to candidates in jurisdictions outside the company's primary location
- Any language that could imply guaranteed employment duration

## Common mistakes
✗ Promising a start date before background check clears
✗ Including equity vesting terms without legal review
✗ Omitting the at-will clause in at-will employment states
✗ Using informal comp language ("around $X"), must be exact
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-offer-letter-scenario-1',
        title: 'Draft a complete offer letter for a senior engineer',
        userInput:
          'Draft an offer letter for Priya Sharma for the role of Senior Software Engineer at Acme Corp. ' +
          'Start date: August 4, 2026. Reports to: Nadia Chen, VP Engineering. ' +
          'Base salary: $195,000/year. Equity: 0.1% options, 4-year vest, 1-year cliff. ' +
          'Bonus: 10% annual target. Benefits: full medical/dental/vision, unlimited PTO. ' +
          'Contingent on background check. Include at-will clause.',
        expectedBehavior:
          'Claude should produce a complete offer letter to Priya Sharma covering all provided terms: ' +
          'Senior Software Engineer title, August 4 start date, Nadia Chen as manager, $195k salary, ' +
          'equity details, 10% bonus, benefits summary, background check contingency, and at-will clause. ' +
          'No invented terms. A legal review note should follow the letter.',
        mustContain: ['Priya Sharma', 'Senior Software Engineer', 'Nadia Chen', '$195,000'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-offer-letter-scenario-2',
        title: 'Handle an offer letter with missing fields',
        userInput:
          'Draft an offer letter for James Osei as Head of Growth at BrightPath. ' +
          'Start date: TBD. Base: $160,000. Equity: TBD. Reports to the CEO.',
        expectedBehavior:
          'Claude should produce an offer letter with [INSERT START DATE] and [INSERT EQUITY DETAILS] ' +
          'as clearly marked placeholders where information was not provided. It must not invent a start date ' +
          'or equity terms. The legal review note should flag the missing fields as items to confirm before sending.',
        mustContain: ['James Osei', 'Head of Growth', 'BrightPath', '$160,000'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 7. Rejection Email ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-rejection-email-v1',
    slug: 'recruiter-rejection-email',
    name: 'Rejection Email',
    tagline: 'Write a respectful, clear rejection that closes the loop without false hope',
    description:
      'Drafts a stage-appropriate rejection email that is warm, direct, and final. Calibrates tone and ' +
      'detail to the interview stage, a first-round rejection reads differently from a final-round one.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['rejection', 'candidate-communication', 'recruiting', 'hr', 'talent-acquisition'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a recruiter at {{companyName}} writing a rejection email for a candidate who applied to the {{roleName}} role and reached the {{hiringStage}} stage.

Write a rejection email appropriate for a candidate at the {{hiringStage}} stage:
- Application review rejection: brief and professional (2–3 sentences)
- Phone screen rejection: warm, slightly more personal (3–4 sentences)
- First or final interview rejection: genuine acknowledgment of their time; consider brief, non-committal positive note (4–5 sentences max)

{{#if allowFutureContact}}
Close with a genuine invitation to stay in touch for future roles, only write this if you mean it. Do not use boilerplate like "we'll keep your resume on file."
{{/if}}

Rules:
1. Be warm but clear. The candidate must not leave the email unsure whether they are rejected.
2. Do not imply reconsideration or future candidacy if there is none.
3. Do not reveal the reason for rejection unless the hiring manager has explicitly approved disclosing it.
4. Keep the email short, proportionate to the stage reached.
5. No discriminatory language; keep candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name for the email signature and salutation.',
        group: 'Email details',
      },
      {
        key: 'roleName',
        label: 'Role name',
        type: 'text',
        required: true,
        helpText: 'The role the candidate applied for.',
        group: 'Email details',
      },
      {
        key: 'hiringStage',
        label: 'Stage the candidate reached',
        type: 'select',
        options: ['Application review', 'Phone screen', 'First interview', 'Final interview'],
        default: 'Phone screen',
        required: true,
        helpText: 'The furthest stage the candidate completed before the decision was made.',
        group: 'Email details',
      },
      {
        key: 'allowFutureContact',
        label: 'Invite the candidate to stay in touch?',
        type: 'boolean',
        default: false,
        required: false,
        helpText:
          'Only turn this on if you genuinely expect to reach out for future roles. ' +
          'Hollow "we\'ll keep your resume on file" language does more harm than good.',
        group: 'Options',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Rejection email tone guide',
        purpose:
          'Stage-by-stage tone guidance and a list of phrases to avoid in rejection emails.',
        kind: 'starter',
        content: `# Rejection Email Tone Guide

## Stage-appropriate calibration

Application review (no interview yet)
- Keep it short: 2–3 sentences.
- No need to reference specific qualities, they did not interview.
- Example opening: "Thank you for your interest in the [Role] role at [Company]. After reviewing your application, we have decided to move forward with other candidates at this time."

Phone screen
- 3–4 sentences. Acknowledge their time on the call.
- Example: "Thank you for taking the time to speak with us about the [Role] role. We appreciated learning about your background. After careful consideration, we have decided to pursue other candidates whose experience more closely matches our current needs."

First or final interview
- 4–5 sentences. Acknowledge their effort and time more fully.
- It is appropriate to note a genuine strength, but do not raise expectations.
- Example: "Thank you for the time you invested in the interview process for the [Role] role at [Company]. We were impressed by [genuine specific quality]. After thoughtful deliberation, we have decided to move forward with another candidate for this particular role."

## Phrases to avoid
✗ "We'll keep your resume on file." (Unless you have a system and mean it)
✗ "We were blown away by your background." (Inconsistent with rejection)
✗ "It was a very tough decision." (Can feel like false comfort)
✗ "We might reach out in the future." (Unless genuinely true)
✗ Any vague language that leaves candidacy status unclear

## Rejection is final, write it that way
A rejection email should close the loop completely. The candidate should not need to follow up to confirm the status.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-rejection-email-scenario-1',
        title: 'Write a final-round rejection for a senior engineering candidate',
        userInput:
          'Write a final interview rejection email for a senior engineering candidate who interviewed ' +
          'for a Staff Engineer role at Luminary AI. They made it through three rounds. ' +
          'Do not invite future contact, we are not sure we would reach out again.',
        expectedBehavior:
          'Claude should produce a 4–5 sentence rejection email that acknowledges the three-round ' +
          'process and thanks the candidate genuinely for their time. It should be clear and final, ' +
          'no language implying reconsideration or future outreach. It must not include ' +
          '"we\'ll keep your resume on file" or equivalent.',
        mustContain: ['Staff Engineer', 'Luminary AI', 'three rounds'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-rejection-email-scenario-2',
        title: 'Write a post-screen rejection with an invitation to stay in touch',
        userInput:
          'Write a phone screen rejection email for a candidate who applied for a Marketing Manager role ' +
          'at Clearview. They were strong but we filled the role internally. ' +
          'We do want to stay in touch, she would be a good fit for future openings.',
        expectedBehavior:
          'Claude should produce a warm, 3–4 sentence rejection that mentions the phone screen, ' +
          'notes the role was filled internally, and includes a genuine (not boilerplate) invitation ' +
          'to stay in touch for future Marketing Manager openings. It must be clear the candidate is ' +
          'not moving forward for this specific role.',
        mustContain: ['Marketing Manager', 'Clearview', 'filled the role internally'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 8. Candidate Summary ───────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-candidate-summary-v1',
    slug: 'recruiter-candidate-summary',
    name: 'Candidate Summary',
    tagline: 'Synthesize interview notes into a clear hiring-manager summary',
    description:
      'Turns raw recruiter notes or resume highlights into a concise, structured candidate summary for ' +
      'a hiring manager or panel. Uses objective, behavior-based language and optionally closes with a hiring recommendation.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['candidate-summary', 'recruiting', 'hiring', 'hr', 'talent-acquisition', 'interviewing'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a recruiter writing a candidate summary for a {{audienceRole}} reviewing candidates for the {{roleName}} role.

Raw notes and highlights to synthesize: {{candidateNotes}}

Produce a structured summary covering:
1. Relevant experience and skills (2–3 sentences)
2. Standout moments or evidence from the interview (2–3 specific points)
3. Gaps or areas to probe in the next stage (1–2 items; write "None identified" if there are none)
{{#if includeRecommendation}}
4. Hiring recommendation: Advance / Hold / Decline, followed by one sentence explaining the reasoning
{{/if}}

Target length: 200–350 words.

Rules:
1. Base the summary only on what is in the notes, do not infer background, personality traits, or cultural fit from demographic signals.
2. Use objective, behavior-based language throughout.
3. Do not editorialize beyond what the evidence supports.
4. No discriminatory language; keep candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'audienceRole',
        label: 'Who will read this summary?',
        type: 'select',
        options: ['Hiring Manager', 'HR Business Partner', 'Executive', 'Full Panel'],
        default: 'Hiring Manager',
        required: true,
        helpText: 'Shapes the level of detail and what context to include or omit.',
        group: 'Context',
      },
      {
        key: 'roleName',
        label: 'Role name',
        type: 'text',
        required: true,
        helpText: 'The role the candidate is being considered for.',
        group: 'Context',
      },
      {
        key: 'candidateNotes',
        label: 'Raw interview notes or resume highlights',
        type: 'multiline',
        required: true,
        helpText:
          'Paste your notes from the screen or interview, resume highlights you want to reference, ' +
          'or any combination. The more specific, the more accurate the summary.',
        group: 'Notes',
      },
      {
        key: 'includeRecommendation',
        label: 'Include a hiring recommendation?',
        type: 'boolean',
        default: true,
        required: false,
        helpText:
          'Adds an Advance / Hold / Decline recommendation with a one-sentence rationale at the end of the summary.',
        group: 'Options',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Candidate summary writing guide',
        purpose:
          'Language guidelines for writing objective, bias-free candidate summaries that give hiring ' +
          'managers the evidence they need to decide.',
        kind: 'starter',
        content: `# Candidate Summary Writing Guide

## What a good summary does
- Translates raw notes into evidence, specific, behavior-based, attributable to the candidate
- Surfaces gaps honestly without editorializing
- Gives the reader enough to make or advance a decision without reading full notes

## What to AVOID
✗ "She was very likeable and would be a great culture fit." (Opinion, not evidence)
✗ "He seemed young but experienced." (Age signal, off-limits)
✗ "She was articulate and well-spoken." (Coded language, off-limits)
✗ "He didn't seem very confident." (Personality inference, not behavior-based)

## Preferred language patterns
✓ "Described managing a team of 8 engineers across two time zones during a product migration."
✓ "Gave a concrete example of building the company's first data pipeline from scratch; cited specific tools (dbt, Airflow)."
✓ "Could not give a clear example of managing up or influencing without direct authority, worth probing."

## Standout moment formula
Event → Action → Outcome (specific):
"Inherited a pipeline with 40% data quality errors, rebuilt ingestion layer over 6 weeks, reduced error rate to under 2%."

## Recommendation guidance
Advance: evidence is strong across key competencies; no blockers.
Hold: strong on some competencies but a gap remains, specify what needs clarification.
Decline: clear evidence of absence in one or more must-have competencies.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-candidate-summary-scenario-1',
        title: 'Summarize a strong data analyst candidate for a hiring manager',
        userInput:
          'Write a candidate summary for a Data Analyst role for the hiring manager. ' +
          'Notes: Ana Rodrigues, currently at Deliveroo. Owns weekly exec reporting, built the dashboard from scratch in Looker. ' +
          'Led migration from spreadsheets to BigQuery for three teams. Strong SQL. Struggled slightly on ' +
          'the Python question, knows basics but not confident with scripting. Asked good questions about team structure. ' +
          'Include a hiring recommendation.',
        expectedBehavior:
          'Claude should produce a 200–350 word summary with: a relevant experience section noting her Deliveroo role ' +
          'and dashboard/BigQuery work; standout moments citing the exec dashboard and migration; a gaps section flagging ' +
          'the Python gap specifically; and an Advance / Hold / Decline recommendation with a one-sentence rationale. ' +
          'Language must be behavior-based, not opinionated.',
        mustContain: ['Ana Rodrigues', 'Deliveroo', 'BigQuery', 'SQL'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-candidate-summary-scenario-2',
        title: 'Write a summary for an executive audience with no recommendation',
        userInput:
          'Write a candidate summary for a VP of Engineering role for the Executive team. ' +
          'No recommendation needed, just the evidence. ' +
          'Notes: Marcus Webb, 12 years in engineering leadership. Scaled an engineering org from 15 to 80 at a Series C. ' +
          'Led two M&A technical integrations. Strong on roadmap and stakeholder management. ' +
          'Panel had mixed views on his hands-on technical depth.',
        expectedBehavior:
          'Claude should write a concise, evidence-based summary for an executive audience, tighter and higher-level ' +
          'than a hiring-manager summary. It should cite the scaling achievement (15 to 80), the M&A integrations, ' +
          'and the panel disagreement on technical depth as a gap to probe. No recommendation section.',
        mustContain: ['Marcus Webb', 'VP of Engineering', 'M&A', 'technical depth'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 9. Sourcing Plan ───────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-sourcing-plan-v1',
    slug: 'recruiter-sourcing-plan',
    name: 'Sourcing Plan',
    tagline: 'Build a week-by-week sourcing plan for any open role',
    description:
      'Generates a structured sourcing plan for a specific role, prioritising channels by timeline and budget ' +
      'and providing weekly outreach targets. Flags when a timeline is likely too short to fill without trade-offs.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['sourcing', 'recruiting', 'talent-acquisition', 'hr', 'pipeline', 'hiring'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a recruiter building a sourcing plan for the {{roleName}} role.

Hiring timeline: {{hiringTimeline}}
Target channels: {{targetChannels}}
Budget constraint: {{budgetConstraint}}

Build a week-by-week sourcing plan covering:
1. Channel prioritization, which channels to activate first given the timeline and budget, and why
2. Weekly outreach targets per channel (realistic numbers, not aspirational)
3. Search strategy per channel (keywords, filters, or Boolean strings where helpful)
4. Midpoint check, what to do if pipeline is thin at the halfway point
5. Fallback channels to activate if primary channels underperform

Rules:
1. Only recommend paid channels if the budget constraint allows for them.
2. Do not recommend sourcing methods that rely on demographic filters or protected-class attributes.
3. Flag explicitly if the timeline is likely too short to fill the role without quality trade-offs, and explain why.
4. No discriminatory language; keep all role and candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'roleName',
        label: 'Role you are sourcing for',
        type: 'text',
        required: true,
        helpText: 'Job title or role type.',
        group: 'Role details',
      },
      {
        key: 'hiringTimeline',
        label: 'Hiring timeline',
        type: 'select',
        options: ['2 weeks', '1 month', '6 weeks', '3 months'],
        default: '6 weeks',
        required: true,
        helpText: 'The target timeline to fill the role from today.',
        group: 'Plan parameters',
      },
      {
        key: 'targetChannels',
        label: 'Channels to use',
        type: 'multiselect',
        options: [
          'LinkedIn',
          'Job boards (Indeed, Glassdoor)',
          'Employee referrals',
          'GitHub',
          'Events and meetups',
          'University partnerships',
          'Agency or RPO',
        ],
        default: ['LinkedIn', 'Employee referrals'],
        required: true,
        helpText: 'Select all channels available to you for this role.',
        group: 'Plan parameters',
      },
      {
        key: 'budgetConstraint',
        label: 'Budget constraint',
        type: 'select',
        options: ['No paid channels', 'Limited budget (LinkedIn Recruiter or 1–2 job posts)', 'Full budget available'],
        default: 'Limited budget (LinkedIn Recruiter or 1–2 job posts)',
        required: true,
        helpText: 'Controls which paid sourcing methods appear in the plan.',
        group: 'Plan parameters',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Sourcing channel reference',
        purpose:
          'Typical time-to-first-candidate, cost, and best-use notes for each common sourcing channel.',
        kind: 'starter',
        content: `# Sourcing Channel Reference

## Channel summary

### LinkedIn (paid, Recruiter seat or InMail credits)
Time to first candidate: 2–5 days
Best for: Experienced passive candidates, leadership roles, most professional functions
Limitations: High noise at senior IC+ levels; InMail reply rates average 15–25%

### Job boards (Indeed, Glassdoor, free and paid)
Time to first candidate: 1–3 days (active applicants)
Best for: Entry-to-mid roles, high-volume hiring, roles with clear title recognition
Limitations: High inbound volume requires screening capacity; passive candidates rarely apply

### Employee referrals
Time to first candidate: 3–7 days
Best for: Roles requiring trust, cultural alignment, or specialised networks
Limitations: Slow to generate volume; can reduce diversity if network is homogeneous

### GitHub (free, search + outreach)
Time to first candidate: 5–10 days
Best for: Engineers, especially open source contributors
Limitations: Requires manual research; reply rates vary significantly

### Events and meetups
Time to first candidate: 1–4 weeks
Best for: Long-term pipeline building; specialist roles in tight communities
Limitations: Slow; not suitable for urgent hires

### University partnerships
Time to first candidate: 4–8 weeks
Best for: Entry-level and internship pipelines; long-cycle planning only
Limitations: Not useful for experienced hire timelines under 6 weeks

### Agency or RPO
Time to first candidate: 3–7 days
Best for: Urgent fills; specialist or hard-to-source roles; when internal bandwidth is low
Limitations: Cost (typically 15–25% of first-year salary); variable quality

## Midpoint check trigger
If fewer than 3–5 qualified candidates are in active process at the halfway point, activate the fallback plan immediately.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-sourcing-plan-scenario-1',
        title: 'Build a sourcing plan for a Head of Design in 6 weeks',
        userInput:
          'Build a sourcing plan for a Head of Design role. Target timeline: 6 weeks. ' +
          'Channels: LinkedIn, employee referrals, design community events. ' +
          'Budget: limited (LinkedIn Recruiter seat only, no paid job boards).',
        expectedBehavior:
          'Claude should produce a week-by-week plan prioritizing LinkedIn and referrals in weeks 1–2, ' +
          'activating event outreach in weeks 2–4, and including a midpoint check at week 3. ' +
          'Weekly outreach targets per channel should be specific numbers. The plan should note that ' +
          'a 6-week timeline for a Head of Design is tight and explain the risk.',
        mustContain: ['Head of Design', 'LinkedIn', 'employee referrals', '6 weeks'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-sourcing-plan-scenario-2',
        title: 'Build a sourcing plan with a 2-week deadline and no paid channels',
        userInput:
          'Build a sourcing plan for a Customer Support Lead role. ' +
          'We need to fill it in 2 weeks. No paid channels, only employee referrals and free job boards. ' +
          'Budget: no paid channels.',
        expectedBehavior:
          'Claude should flag immediately that 2 weeks with no paid channels is an extremely tight window ' +
          'and explain what trade-offs that implies (likely inbound-only, limited passive sourcing). ' +
          'The plan should maximise employee referrals and free job-board postings, give realistic daily/weekly ' +
          'outreach targets, and recommend activating agency or paid channels as a fallback if the pipeline is thin by day 5.',
        mustContain: ['Customer Support Lead', '2 weeks', 'employee referrals', 'job boards'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 10. Interview Debrief Synthesizer ──────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-recruiter-debrief-synthesizer-v1',
    slug: 'recruiter-debrief-synthesizer',
    name: 'Interview Debrief Synthesizer',
    tagline: 'Synthesize panel feedback into a structured hiring recommendation',
    description:
      'Takes raw panel interview feedback and synthesizes it into a structured debrief document: ' +
      'competency-by-competency summary, panel alignment and disagreement, risks, and a hiring recommendation. ' +
      'Flags when feedback may reflect bias rather than job-relevant evidence.',
    role: 'Recruiter',
    industry: 'HR & People',
    tags: ['debrief', 'panel-interview', 'recruiting', 'hr', 'talent-acquisition', 'hiring-decision'],
    category: 'hr',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You are a recruiter synthesizing panel interview feedback for the {{roleName}} role.

Panel feedback to synthesize: {{panelFeedback}}
Key competencies for this role: {{keyCompetencies}}
Hiring decision needed by: {{decisionDeadline}}

Produce a structured debrief document with these sections:
1. Competency-by-competency summary, what the panel collectively said about each key competency (2–3 sentences per competency)
2. Points of alignment, where all or most interviewers agreed, and what evidence they cited
3. Points of disagreement, where panel members diverged, and what drove the difference
4. Risks and open questions, gaps in the evidence, areas not covered, or questions left unanswered
5. Hiring recommendation, Advance to offer / Hold for additional information / Decline, with a 2–3 sentence rationale

Rules:
1. Attribute diverging opinions to interviewer roles, not names, unless the hiring manager has explicitly approved named attribution.
2. Do not let any single interviewer's view dominate the synthesis, weight feedback by evidence quality, not volume or seniority.
3. Flag explicitly if any panel feedback appears to reflect demographic bias rather than job-relevant evidence.
4. No discriminatory language; keep candidate data confidential; write inclusively and bias-aware.`,

    variables: [
      {
        key: 'roleName',
        label: 'Role name',
        type: 'text',
        required: true,
        helpText: 'The role the candidate interviewed for.',
        group: 'Context',
      },
      {
        key: 'panelFeedback',
        label: 'Panel feedback',
        type: 'multiline',
        required: true,
        helpText:
          'Paste the raw feedback from each interviewer. Include their role or name and what competency they covered if known. ' +
          'The more specific the notes, the more useful the synthesis.',
        group: 'Feedback',
      },
      {
        key: 'keyCompetencies',
        label: 'Key competencies for this role',
        type: 'multiline',
        required: true,
        helpText:
          'List the competencies that matter most for this hire, one per line. ' +
          'These anchor the competency-by-competency summary section.',
        group: 'Feedback',
      },
      {
        key: 'decisionDeadline',
        label: 'Decision deadline',
        type: 'text',
        required: true,
        helpText: 'When the hiring team needs to make a decision, e.g. "End of day Friday" or "July 11, 2026."',
        group: 'Context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Debrief synthesis guide',
        purpose:
          'Guidance on weighting panel evidence, spotting bias in feedback, and structuring a fair hiring recommendation.',
        kind: 'starter',
        content: `# Debrief Synthesis Guide

## Evidence quality hierarchy (use this to weight conflicting feedback)
High quality: specific behavioral example + outcome cited by the interviewer
Medium quality: general impression with one specific example
Low quality: gut feeling, "vibe," likeability, or culture fit without behavioral evidence

Always weight high-quality evidence over low-quality evidence, regardless of who gave it.

## Common bias patterns in panel feedback (flag these)
"I just didn't feel a connection", not evidence; reflects likeability bias
"Seemed quiet / reserved", personality observation, not job-relevant behavior
"Not sure they'd fit our culture", without specific behavioral evidence, likely bias
"They were impressive for their background", demographic inference; remove from synthesis
"Reminded me of [colleague name]", affinity bias; flag immediately

## Debrief alignment vs. disagreement
Alignment: two or more interviewers cite independent evidence for the same conclusion → strong signal
Disagreement: interviewers contradict on the same competency → dig into evidence quality, not headcount

## Recommendation thresholds
Advance to offer: strong or solid evidence across all key competencies; no unresolved blockers
Hold: one or more competencies lack sufficient evidence; specify what additional data point would resolve it
Decline: clear evidence of absence in at least one must-have competency; or a blocker that cannot be mitigated

## Decision deadline note
Always state the decision deadline in the debrief so the hiring team knows the urgency.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'recruiter-debrief-synthesizer-scenario-1',
        title: 'Synthesize a split panel decision for a Head of Product',
        userInput:
          'Synthesize panel feedback for a Head of Product candidate. Decision needed by Friday.\n\n' +
          'Key competencies: product strategy, stakeholder alignment, team leadership.\n\n' +
          'Hiring Manager: "Really strong on strategy, laid out a clear product vision with data to back it up. ' +
          'A little uncertain on the team leadership question, gave a vague answer about managing underperformers."\n\n' +
          'Engineering Lead: "Great cross-functional instincts. Knew how to work with engineering without ' +
          'going around them. Strong hire."\n\n' +
          'CPO: "Impressive on strategy and roadmap. But I\'m not convinced on leadership depth, ' +
          'she\'s never managed a team larger than 4. That\'s a risk for a team of 12."',
        expectedBehavior:
          'Claude should produce a structured debrief with all five sections. The competency summary ' +
          'should reflect what each panel member said per competency. Alignment should note the strong consensus ' +
          'on product strategy. Disagreement should surface the split on leadership depth. ' +
          'Risks should flag the team-size gap. The recommendation should be Hold or Decline with a rationale ' +
          'citing the leadership evidence gap, not just one person\'s opinion.',
        mustContain: ['Head of Product', 'product strategy', 'team leadership', 'Friday'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'recruiter-debrief-synthesizer-scenario-2',
        title: 'Identify and flag biased panel feedback',
        userInput:
          'Synthesize this panel feedback for a Senior Engineer role. Decision needed by tomorrow.\n\n' +
          'Key competencies: system design, debugging and problem-solving, code quality.\n\n' +
          'Interviewer A: "Solid system design, walked through a distributed cache design clearly and handled follow-up questions well."\n\n' +
          'Interviewer B: "Good on debugging. Found the bug in the code review exercise in under 10 minutes."\n\n' +
          'Interviewer C: "I just didn\'t feel a connection. Not sure they\'d fit our culture. ' +
          'Also seemed quiet and reserved compared to the rest of our team."',
        expectedBehavior:
          'Claude should flag Interviewer C\'s feedback as likely bias, "didn\'t feel a connection," ' +
          '"quiet and reserved," and "fit our culture" without behavioral evidence are all bias signals. ' +
          'The competency summary should weight Interviewers A and B (high-quality evidence) heavily ' +
          'and note that no behavioral evidence was provided for culture fit. ' +
          'The recommendation should be based on the job-relevant evidence only.',
        mustContain: ['Senior Engineer', 'system design', 'quiet and reserved', 'culture'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
