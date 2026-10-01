import { defineField, defineType } from 'sanity';
import { imageWithAlt, sourcesField, verificationField, workflowField } from './shared';

const slug = (source = 'title') => defineField({ name: 'slug', type: 'slug', options: { source, maxLength: 96 }, validation: (r) => r.required() });
const req = (name: string, title: string, type = 'string') => defineField({ name, title, type, validation: (r) => r.required() });
const wfPreview = { select: { title: 'title', status: 'workflow.status' }, prepare: ({ title, status }: any) => ({ title, subtitle: `Workflow: ${status ?? 'draft'}` }) };

export const author = defineType({ name: 'author', title: 'Author', type: 'document', fields: [
  req('name', 'Name'), defineField({ name: 'role', title: 'Role', type: 'string' }), defineField({ name: 'bio', title: 'Approved biography', type: 'text' }),
  imageWithAlt('photo', 'Photograph'), defineField({ name: 'links', title: 'Public professional links', type: 'array', of: [{ type: 'linkItem' }] }) ], preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } } });

export const guest = defineType({ name: 'guest', title: 'Podcast guest', type: 'document', fields: [
  req('name', 'Name'), slug('name'), req('role', 'Role or title'), defineField({ name: 'organization', type: 'string' }),
  defineField({ name: 'bio', title: 'Approved biography', type: 'text', validation: (r) => r.required() }),
  defineField({ name: 'bioApproved', title: 'Guest has approved this biography', type: 'boolean', initialValue: false, validation: (r) => r.custom((v: any) => (v === true ? true : 'Confirm the guest approved their biography before publishing.')) }),
  imageWithAlt('photo', 'Photograph'), defineField({ name: 'links', type: 'array', of: [{ type: 'linkItem' }] }), workflowField ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } } });

export const episode = defineType({ name: 'episode', title: 'African Intelligence episode', type: 'document', fields: [
  req('title', 'Title'), slug(), defineField({ name: 'number', title: 'Episode number', type: 'number', validation: (r) => r.required().integer().min(1) }),
  defineField({ name: 'guest', type: 'reference', to: [{ type: 'guest' }], validation: (r) => r.required() }),
  req('publishDate', 'Publish date', 'date'), defineField({ name: 'summary', title: 'Short summary (cards and search)', type: 'text', rows: 3, validation: (r) => r.required().max(400) }),
  imageWithAlt('cover', 'Cover artwork', true),
  defineField({ name: 'topics', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
  defineField({ name: 'themes', title: 'In this episode, we explore', type: 'array', of: [{ type: 'string' }] }),
  defineField({ name: 'format', type: 'string', initialValue: 'interview', options: { list: ['interview', 'conversation'] } }),
  defineField({ name: 'duration', type: 'string', description: 'For example "42 min".' }),
  defineField({ name: 'youtubeUrl', title: 'YouTube link for this episode', type: 'url' }), defineField({ name: 'rssUrl', title: 'RSS.com link for this episode', type: 'url' }),
  defineField({ name: 'spotifyUrl', type: 'url' }), defineField({ name: 'appleUrl', title: 'Apple Podcasts link', type: 'url' }), defineField({ name: 'amazonUrl', title: 'Amazon Music link', type: 'url' }),
  defineField({ name: 'transcript', title: 'Transcript available', type: 'boolean', initialValue: false }),
  defineField({ name: 'body', title: 'Episode description', type: 'body' }), workflowField ],
  orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'publishDate', direction: 'desc' }] }],
  preview: { select: { title: 'title', num: 'number', status: 'workflow.status', media: 'cover' }, prepare: ({ title, num, status, media }: any) => ({ title: `${num ? `Ep ${num}: ` : ''}${title}`, subtitle: `Workflow: ${status ?? 'draft'}`, media }) } });

export const story = defineType({ name: 'story', title: 'Story', type: 'document', fields: [
  req('title', 'Headline'), slug(), req('subtitle', 'Subtitle'),
  defineField({ name: 'section', title: 'Section', type: 'string', validation: (r) => r.required(), options: { list: [
    { title: 'African Stories', value: 'african-stories' }, { title: 'Thought Leadership', value: 'thought-leadership' }, { title: 'Stories of Opportunity', value: 'opportunities' }] } }),
  defineField({ name: 'sub', title: 'Sub-category', type: 'string', description: 'African Stories and Stories of Opportunity need one. Thought Leadership has none.',
    validation: (r) => r.custom((v: any, ctx: any) => { const sec = ctx.document?.section; const af = ['business-and-economics','african-affairs','history','geopolitics','technology','infrastructure','society-and-culture']; const op = ['scholarships','fellowships','other-opportunities'];
      if (sec === 'african-stories') return af.includes(v) ? true : 'Choose an African Stories sub-category.';
      if (sec === 'opportunities') return op.includes(v) ? true : 'Choose an opportunity type.';
      return v ? 'Thought Leadership has no sub-category.' : true; }),
    options: { list: [
      { title: 'African Stories: Business & Economics', value: 'business-and-economics' }, { title: 'African Stories: African Affairs', value: 'african-affairs' }, { title: 'African Stories: History', value: 'history' }, { title: 'African Stories: Geopolitics', value: 'geopolitics' },
      { title: 'African Stories: Technology', value: 'technology' }, { title: 'African Stories: Infrastructure', value: 'infrastructure' }, { title: 'African Stories: Society & Culture', value: 'society-and-culture' },
      { title: 'Opportunity: Scholarships', value: 'scholarships' }, { title: 'Opportunity: Fellowships', value: 'fellowships' }, { title: 'Opportunity: Other', value: 'other-opportunities' }] } }),
  defineField({ name: 'opportunity', title: 'Opportunity details (Stories of Opportunity only)', type: 'object', fields: [
    defineField({ name: 'organization', type: 'string' }), defineField({ name: 'deadline', type: 'string', description: 'Check this against the official source.' }),
    defineField({ name: 'eligibility', type: 'string' }), defineField({ name: 'location', type: 'string' }), defineField({ name: 'applyUrl', title: 'Official link', type: 'url' })] }),
  defineField({ name: 'kind', title: 'Content type (always shown to readers)', type: 'string', validation: (r) => r.required(), options: { list: [
    { title: 'Reporting', value: 'reporting' }, { title: 'Research-based analysis', value: 'research-analysis' }, { title: 'Opinion', value: 'opinion' },
    { title: 'Institutional statement', value: 'institutional-statement' }, { title: 'Sponsored content', value: 'sponsored' }] } }),
  defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }], validation: (r) => r.required() }),
  defineField({ name: 'date', title: 'Publication date', type: 'date' }), defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  imageWithAlt('heroImage', 'Featured image', true), defineField({ name: 'body', type: 'body', validation: (r) => r.required() }),
  { ...sourcesField, description: 'Required for reporting and research-based analysis.', validation: (r: any) => r.custom((v: any, ctx: any) => (['reporting', 'research-analysis'].includes(ctx.document?.kind) && !(v && v.length) ? 'Add at least one source.' : true)) },
  defineField({ name: 'sponsor', title: 'Sponsor (required for sponsored content)', type: 'reference', to: [{ type: 'sponsor' }], validation: (r) => r.custom((v: any, ctx: any) => (ctx.document?.kind === 'sponsored' && !v ? 'Sponsored content must name its sponsor.' : true)) }),
  workflowField ], preview: wfPreview });

export const researchOutput = defineType({ name: 'researchOutput', title: 'Intelligence briefing / research paper', type: 'document', fields: [
  req('title', 'Title'), slug(), defineField({ name: 'kind', type: 'string', validation: (r) => r.required(), options: { list: [{ title: 'Briefing', value: 'briefing' }, { title: 'Research paper', value: 'paper' }, { title: 'Institutional report', value: 'report' }, { title: 'Data-led feature', value: 'feature' }] } }),
  req('subject', 'Subject'), req('publishDate', 'Publication date', 'date'), req('reportingPeriod', 'Reporting period'),
  defineField({ name: 'authors', title: 'Author or research team (verified)', type: 'array', of: [{ type: 'reference', to: [{ type: 'author' }] }] }),
  defineField({ name: 'executiveSummary', type: 'text', validation: (r) => r.required() }),
  defineField({ name: 'findings', title: 'Main findings', type: 'array', of: [{ type: 'string' }] }),
  defineField({ name: 'projections', title: 'External projections (identified source required)', type: 'array', of: [{ type: 'source' }] }),
  defineField({ name: 'limitations', type: 'text', validation: (r) => r.required() }), { ...sourcesField, validation: (r: any) => r.required().min(1) },
  defineField({ name: 'body', type: 'body' }), verificationField, workflowField ], preview: wfPreview });

export const publication = defineType({ name: 'publication', title: 'Publication', type: 'document', fields: [
  req('title', 'Title'), slug(), defineField({ name: 'type', type: 'string', options: { list: ['Annual review', 'Research paper', 'Institutional report', 'Directory', 'Industry report', 'Thematic study', 'Digital reference'] } }),
  defineField({ name: 'description', type: 'text', validation: (r) => r.required() }), imageWithAlt('cover', 'Cover'),
  defineField({ name: 'status', title: 'Publication status', type: 'string', initialValue: 'proposed', options: { list: [{ title: 'Proposed', value: 'proposed' }, { title: 'Forthcoming', value: 'forthcoming' }, { title: 'Published', value: 'published' }] } }),
  defineField({ name: 'nativeMediaPublication', title: 'Confirm: a Native Media publication, not an official government publication', type: 'boolean', initialValue: true }),
  workflowField ], preview: wfPreview });

export const edition = defineType({ name: 'edition', title: 'Publication edition', type: 'document', fields: [
  defineField({ name: 'publication', type: 'reference', to: [{ type: 'publication' }], validation: (r) => r.required() }), req('label', 'Edition label (e.g. Edition 01 · 2026/27)'), slug('label'),
  defineField({ name: 'status', title: 'Edition status', type: 'string', initialValue: 'proposed', options: { list: [{ title: 'Proposed', value: 'proposed' }, { title: 'Draft for verification', value: 'draft' }, { title: 'Forthcoming', value: 'forthcoming' }, { title: 'Published', value: 'published' }] } }),
  defineField({ name: 'publishDate', type: 'date' }), defineField({ name: 'reportingPeriod', type: 'string' }), defineField({ name: 'pdf', title: 'PDF download (when approved)', type: 'file', options: { accept: 'application/pdf' } }),
  defineField({ name: 'summary', type: 'text' }), defineField({ name: 'updateHistory', title: 'Update history', type: 'array', of: [{ type: 'object', fields: [{ name: 'date', type: 'date' }, { name: 'change', type: 'string' }] }] }),
  verificationField, workflowField ], preview: { select: { title: 'label', subtitle: 'status' } } });

export const chapter = defineType({ name: 'chapter', title: 'Edition chapter', type: 'document', fields: [
  defineField({ name: 'edition', type: 'reference', to: [{ type: 'edition' }], validation: (r) => r.required() }), defineField({ name: 'number', type: 'number', validation: (r) => r.required() }), req('title', 'Title'), slug(),
  defineField({ name: 'executiveSummary', type: 'text' }), defineField({ name: 'keyFindings', type: 'array', of: [{ type: 'string' }] }), req('reportingPeriod', 'Reporting period'), defineField({ name: 'dataCutoff', type: 'date', validation: (r) => r.required() }),
  defineField({ name: 'body', type: 'body' }), sourcesField, verificationField, workflowField ], preview: wfPreview });

export const embassyProfile = defineType({ name: 'embassyProfile', title: 'Embassy / partner profile', type: 'document', fields: [
  req('country', 'Country'), slug('country'), defineField({ name: 'region', type: 'string', validation: (r) => r.required(), options: { list: ['Africa', 'Middle East', 'Asia-Pacific', 'Europe', 'Americas'] } }),
  defineField({ name: 'edition', type: 'reference', to: [{ type: 'edition' }] }),
  defineField({ name: 'participation', title: 'Participation', type: 'string', initialValue: 'invited', options: { list: [{ title: 'Invited (not participation)', value: 'invited' }, { title: 'Confirmed, permission to publish given', value: 'confirmed' }] } }),
  defineField({ name: 'signoff', title: 'Mission sign-off', type: 'object', fields: [defineField({ name: 'signedOff', title: 'The mission has checked and signed off this profile', type: 'boolean', initialValue: false }), defineField({ name: 'contactName', type: 'string' }), defineField({ name: 'contactRole', type: 'string' }), defineField({ name: 'date', type: 'date' }), defineField({ name: 'evidence', title: 'Where the sign-off is recorded', type: 'string' })] }),
  defineField({ name: 'sponsored', title: 'This profile is sponsored (must be labelled)', type: 'boolean', initialValue: false }),
  defineField({ name: 'relationsStart', title: 'Diplomatic relations commenced (year)', type: 'number' }),
  defineField({ name: 'ambassadorName', type: 'string' }), defineField({ name: 'ambassadorTitle', type: 'string' }), defineField({ name: 'missionAddress', type: 'text', rows: 2 }),
  ...[['ambassadorMessage', 'Ambassador’s Message (only if supplied and signed)'], ['relationship', 'Relationship at a Glance'], ['trade', 'Bilateral Trade'], ['investment', 'Investment'], ['projects', 'Flagship Projects'], ['agreementsText', 'Agreements'], ['opportunities', 'Opportunities'], ['peopleCulture', 'People and Culture'], ['contacts', 'Contacts (public only)']].map(([n, t]) => defineField({ name: n, title: t, type: 'body' })),
  sourcesField, verificationField, workflowField,
], validation: (r) => r.custom((d: any) => {
    if (d?.workflow?.status !== 'approved') return true;
    if (d.participation !== 'confirmed') return 'Only confirmed participants can be published. Set participation to Confirmed.';
    if (!d.signoff?.signedOff) return 'The mission must sign off this profile before it is published.';
    if (d.verification?.status !== 'verified') return 'Data must be verified before publishing.';
    return true; }),
  preview: { select: { title: 'country', subtitle: 'region' } } });

export const agreement = defineType({ name: 'agreement', title: 'Bilateral agreement', type: 'document', fields: [
  req('title', 'Title'), slug(), req('partner', 'Partner country or institution'), defineField({ name: 'type', type: 'string', options: { list: ['Treaty', 'Memorandum of understanding', 'Joint communiqué', 'Programme', 'Other'] } }),
  defineField({ name: 'dateSigned', type: 'date' }), defineField({ name: 'summary', type: 'text' }), { ...sourcesField, validation: (r: any) => r.required().min(1) }, verificationField, workflowField ], preview: wfPreview });

export const dataset = defineType({ name: 'dataset', title: 'Dataset', type: 'document', fields: [
  req('title', 'Title'), slug(), req('indicator', 'Indicator'), req('units', 'Units'), req('period', 'Reporting period'), defineField({ name: 'file', title: 'CSV file', type: 'file', options: { accept: '.csv,text/csv' } }),
  defineField({ name: 'notes', title: 'Explanatory notes', type: 'text' }), { ...sourcesField, validation: (r: any) => r.required().min(1) },
  defineField({ name: 'isSample', title: 'Sample / illustrative data (never publish as fact)', type: 'boolean', initialValue: false }), verificationField, workflowField ], preview: wfPreview });

export const exhibit = defineType({ name: 'exhibit', title: 'Data exhibit', type: 'document', fields: [
  req('title', 'Title'), slug(), defineField({ name: 'dataset', type: 'reference', to: [{ type: 'dataset' }], validation: (r) => r.required() }),
  defineField({ name: 'chartType', type: 'string', options: { list: ['Bar', 'Line', 'Map', 'Table', 'Timeline'] } }), req('indicator', 'Indicator'), req('period', 'Reporting period'), req('units', 'Units'),
  defineField({ name: 'notes', type: 'text' }), defineField({ name: 'altText', title: 'Text description of the chart', type: 'text', validation: (r) => r.required() }), { ...sourcesField, validation: (r: any) => r.required().min(1) }, verificationField, workflowField ], preview: wfPreview });

export const directoryEntry = defineType({ name: 'directoryEntry', title: 'Directory entry', type: 'document', fields: [
  req('name', 'Name'), defineField({ name: 'set', title: 'Directory', type: 'string', validation: (r) => r.required(), options: { list: ['Resident diplomatic missions', 'Tanzanian missions abroad', 'Government institutions', 'Investment agencies', 'Chambers of commerce', 'Business councils', 'Institutional contacts', 'Diplomatic events'] } }),
  defineField({ name: 'country', type: 'string' }), defineField({ name: 'address', type: 'text', rows: 2 }), defineField({ name: 'publicContact', title: 'Public contact information', type: 'text', rows: 2 }), defineField({ name: 'website', type: 'url' }),
  { ...sourcesField, validation: (r: any) => r.required().min(1) }, verificationField, workflowField ], preview: { select: { title: 'name', subtitle: 'set' } } });

export const quarterlyUpdate = defineType({ name: 'quarterlyUpdate', title: 'Quarterly update', type: 'document', fields: [
  req('title', 'Title'), slug(), defineField({ name: 'edition', type: 'reference', to: [{ type: 'edition' }] }), req('publishDate', 'Publication date', 'date'), defineField({ name: 'dataCutoff', type: 'date', validation: (r) => r.required() }),
  defineField({ name: 'changes', title: 'Summary of changes', type: 'array', of: [{ type: 'string' }], validation: (r) => r.required().min(1) }), defineField({ name: 'body', type: 'body' }), { ...sourcesField, validation: (r: any) => r.required().min(1) }, verificationField, workflowField ], preview: wfPreview });

export const partner = defineType({ name: 'partner', title: 'Partner or collaborator', type: 'document', fields: [
  req('name', 'Name'), defineField({ name: 'relationship', type: 'string', validation: (r) => r.required(), options: { list: [{ title: 'Confirmed partner', value: 'partner' }, { title: 'Project collaborator', value: 'collaborator' }, { title: 'Client', value: 'client' }, { title: 'Contributor', value: 'contributor' }, { title: 'Prospective (do not publish)', value: 'prospective' }] } }),
  defineField({ name: 'description', type: 'text' }), imageWithAlt('logo', 'Approved logo'), defineField({ name: 'website', type: 'url' }),
  defineField({ name: 'permission', title: 'Written permission to publish name and logo', type: 'boolean', initialValue: false, validation: (r) => r.custom((v: any, ctx: any) => (ctx.document?.relationship === 'prospective' ? 'Prospective relationships are never published.' : v === true ? true : 'Permission to publish is required.')) }), workflowField ], preview: { select: { title: 'name', subtitle: 'relationship', media: 'logo' } } });

export const sponsor = defineType({ name: 'sponsor', title: 'Sponsor', type: 'document', fields: [
  req('name', 'Name'), defineField({ name: 'agreedRole', title: 'Agreed role (e.g. edition partner, thematic sponsor)', type: 'string', validation: (r) => r.required() }), defineField({ name: 'scope', title: 'What is sponsored', type: 'string' }),
  imageWithAlt('logo', 'Approved logo'), defineField({ name: 'website', type: 'url' }), defineField({ name: 'confirmedOn', type: 'date', validation: (r) => r.required() }),
  defineField({ name: 'permission', title: 'Written permission to publish name and logo', type: 'boolean', initialValue: false, validation: (r) => r.custom((v: any) => (v === true ? true : 'Permission to publish is required.')) }),
  defineField({ name: 'noEditorialControl', title: 'Confirmed: sponsorship does not determine editorial content', type: 'boolean', initialValue: true, validation: (r) => r.custom((v: any) => (v === true ? true : 'Sponsorship must never determine editorial content.')) }), workflowField ], preview: { select: { title: 'name', subtitle: 'agreedRole', media: 'logo' } } });

export const correction = defineType({ name: 'correction', title: 'Correction', type: 'document', fields: [
  req('item', 'What was corrected (page, figure or profile)'), req('date', 'Date of correction', 'date'), defineField({ name: 'originalText', title: 'Original wording', type: 'text', validation: (r) => r.required() }),
  defineField({ name: 'correctedText', title: 'Corrected wording', type: 'text', validation: (r) => r.required() }), defineField({ name: 'reason', title: 'Why it changed', type: 'text' }), defineField({ name: 'publication', type: 'reference', to: [{ type: 'publication' }] }), defineField({ name: 'url', title: 'Page address', type: 'string' }), workflowField ],
  preview: { select: { title: 'item', subtitle: 'date' } } });
