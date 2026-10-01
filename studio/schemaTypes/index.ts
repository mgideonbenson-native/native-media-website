import * as shared from './shared';
import * as docs from './documents';
export const schemaTypes = [shared.workflow, shared.verification, shared.source, shared.link, shared.credit, shared.body, ...Object.values(docs)];
/** Types that follow the Draft -> In review -> Approved workflow. */
export const workflowTypes = ['guest', 'episode', 'story', 'researchOutput', 'publication', 'edition', 'chapter', 'embassyProfile', 'agreement', 'dataset', 'exhibit', 'directoryEntry', 'quarterlyUpdate', 'partner', 'sponsor', 'correction'];
