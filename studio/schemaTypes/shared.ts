import { defineField, defineType } from 'sanity';

/**
 * Editorial workflow, attached to every publishable document.
 * Draft -> In review -> Approved. Only Approved documents can be published (see sanity.config.ts),
 * and the website only shows published documents whose "Publish on or after" time has passed.
 */
export const workflow = defineType({
  name: 'workflow',
  title: 'Editorial workflow',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: 'status', title: 'Status', type: 'string', initialValue: 'draft', validation: (r) => r.required(),
      options: { list: [{ title: 'Draft', value: 'draft' }, { title: 'In review', value: 'in-review' }, { title: 'Approved', value: 'approved' }], layout: 'radio' } }),
    defineField({ name: 'author', title: 'Prepared by', type: 'string' }),
    defineField({ name: 'reviewer', title: 'Reviewed by', type: 'string' }),
    defineField({ name: 'approvedBy', title: 'Approved by', type: 'string', description: 'Required when status is Approved.' }),
    defineField({ name: 'approvedAt', title: 'Approved on', type: 'datetime', description: 'Required when status is Approved.' }),
    defineField({ name: 'publishAt', title: 'Publish on or after', type: 'datetime', description: 'Optional. Leave empty to publish as soon as the site next rebuilds. A future date schedules the content: it appears on the first site rebuild after that time.' }),
    defineField({ name: 'notes', title: 'Notes for the team', type: 'text', rows: 3 }),
  ],
  validation: (r) => r.custom((v: any) => (v?.status === 'approved' && (!v.approvedBy || !v.approvedAt) ? 'An approved document needs "Approved by" and "Approved on".' : true)),
});

/** Data / institutional verification, for publications, data and profiles. */
export const verification = defineType({
  name: 'verification',
  title: 'Verification',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: 'status', title: 'Data verification status', type: 'string', initialValue: 'draft', validation: (r) => r.required(),
      options: { list: [{ title: 'Draft', value: 'draft' }, { title: 'Under verification', value: 'under-verification' }, { title: 'Verified against sources', value: 'verified' }], layout: 'radio' } }),
    defineField({ name: 'verifiedBy', title: 'Verified by', type: 'string' }),
    defineField({ name: 'verifiedAt', title: 'Verified on', type: 'datetime' }),
    defineField({ name: 'cutoff', title: 'Data cut-off date', type: 'date' }),
  ],
  validation: (r) => r.custom((v: any) => (v?.status === 'verified' && (!v.verifiedBy || !v.verifiedAt) ? 'Verified items need "Verified by" and "Verified on".' : true)),
});

/** A source reference. Every published data point needs one. */
export const source = defineType({
  name: 'source',
  title: 'Source',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Document or dataset', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'publisher', title: 'Publisher', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tier', title: 'Source tier', type: 'string', options: { list: [{ title: 'Tier 1: Tanzanian official source', value: 'tier-1' }, { title: 'Tier 2: Diplomatic source', value: 'tier-2' }, { title: 'Tier 3: Multilateral source', value: 'tier-3' }, { title: 'Other (explain in notes)', value: 'other' }] } }),
    defineField({ name: 'period', title: 'Reporting period', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'url', title: 'Link', type: 'url' }),
    defineField({ name: 'note', title: 'Note (e.g. why figures differ)', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'title', subtitle: 'publisher' } },
});

export const link = defineType({ name: 'linkItem', title: 'Link', type: 'object', fields: [
  defineField({ name: 'label', type: 'string', validation: (r) => r.required() }), defineField({ name: 'href', title: 'Address', type: 'url', validation: (r) => r.required() }) ], preview: { select: { title: 'label', subtitle: 'href' } } });

export const credit = defineType({ name: 'credit', title: 'Credit', type: 'object', fields: [
  defineField({ name: 'role', type: 'string', validation: (r) => r.required() }), defineField({ name: 'name', type: 'string', validation: (r) => r.required() }) ], preview: { select: { title: 'name', subtitle: 'role' } } });

/** Rich text used for story and episode bodies. */
export const body = defineType({ name: 'body', title: 'Body', type: 'array', of: [
  { type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'Heading', value: 'h2' }, { title: 'Subheading', value: 'h3' }, { title: 'Quote', value: 'blockquote' }], lists: [{ title: 'Bullets', value: 'bullet' }, { title: 'Numbers', value: 'number' }],
    marks: { decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }], annotations: [{ name: 'link', type: 'object', title: 'Link', fields: [{ name: 'href', type: 'url', title: 'Address' }] }] } },
  { type: 'image', fields: [{ name: 'alt', type: 'string', title: 'Alternative text', validation: (r: any) => r.required() }, { name: 'caption', type: 'string' }] },
] });

export const imageWithAlt = (name: string, title: string, required = false) =>
  defineField({ name, title, type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', description: 'Describe the image for people who cannot see it.', validation: (r) => (required ? r.required() : r) })], validation: (r) => (required ? r.required() : r) });

export const workflowField = defineField({ name: 'workflow', title: 'Editorial workflow', type: 'workflow', validation: (r) => r.required() });
export const verificationField = defineField({ name: 'verification', title: 'Verification', type: 'verification', validation: (r) => r.required() });
export const sourcesField = defineField({ name: 'sources', title: 'Sources', type: 'array', of: [{ type: 'source' }] });
