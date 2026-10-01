/**
 * Content for the six capability pages (/what-we-do/<slug>).
 * Everything here comes from the Native Media brief. No clients, case studies,
 * statistics or testimonials are included, and none should be added unless verified.
 */
export type Capability = {
  slug: string;
  title: string;
  art: 'signal' | 'contour' | 'frames' | 'lens' | 'pages' | 'grid';
  tagline: string;
  intro: string[];
  includesTitle: string;
  includes: string[];
  audiences: string[];
  process: { title: string; text: string }[];
  engagementTitle: string;
  engagement: { title: string; text: string }[];
  principles?: { title: string; text: string }[];
  principlesTitle?: string;
  workTitle: string;
  workNote: string;
  related: { label: string; href: string }[];
  topic: string; // preselected inquiry topic
};

export const capabilities: Capability[] = [
  {
    slug: 'narrative-engineering',
    title: 'Narrative Engineering',
    art: 'signal',
    tagline: 'Engineering the narratives that connect identity, objectives, evidence and audiences.',
    intro: [
      'Narrative Engineering is a central business function of Native Media. We work as a partner in developing strategic narratives, communicating institutional priorities, strengthening reputations and connecting organizations with the audiences that matter to them.',
      'Effective communication links four things: who an organization is, what it is trying to achieve, the evidence that supports it, and how it engages the public. Our work starts from that connection rather than from the channel or the format. We call this narrative engineering: building a narrative deliberately, from evidence, so that it holds up in public.',
    ],
    includesTitle: 'Areas of capability',
    includes: [
      'Corporate communications',
      'Institutional communications',
      'Strategic narrative development',
      'Corporate reputation management',
      'National and institutional positioning',
      'Stakeholder engagement',
      'Strategic content development',
      'Public information campaigns',
      'Executive communications',
      'Brand storytelling',
      'Communication strategy',
      'Digital communication',
      'Strategic media production',
    ],
    audiences: ['Corporate communications directors', 'CEOs and executives', 'Government institutions and agencies', 'Diplomatic missions', 'Chambers of commerce and business councils'],
    process: [
      { title: 'Understand', text: 'The organization, its context, its audiences and what it needs to achieve.' },
      { title: 'Gather evidence', text: 'Credible facts, data and research that support the story to be told.' },
      { title: 'Define the narrative', text: 'A clear strategic objective and a narrative built on evidence.' },
      { title: 'Create', text: 'Content, materials and productions that express the narrative.' },
      { title: 'Engage', text: 'Distribution through the channels that reach the intended stakeholders.' },
      { title: 'Review', text: 'Evaluation and refinement where measurable outcomes are available.' },
    ],
    engagementTitle: 'Possible engagement models',
    engagement: [
      { title: 'Project-based', text: 'A defined communication strategy, narrative or campaign with an agreed scope.' },
      { title: 'Advisory', text: 'Ongoing strategic counsel for leadership and communications teams.' },
      { title: 'Content and production', text: 'Executive communications, films, publications or digital content for a defined purpose.' },
    ],
    workTitle: 'Examples of work',
    workNote: 'Verified case studies will be shown here once projects and clients have confirmed they can be published. We do not display unverified work.',
    related: [
      { label: 'Research & Publications', href: '/research-and-publications' },
      { label: 'African Intelligence', href: '/african-intelligence' },
      { label: 'Creative Data', href: '/creative-data' },
    ],
    topic: 'Narrative engineering',
  },
];
