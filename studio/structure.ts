import type { StructureResolver } from 'sanity/structure';
import { workflowTypes } from './schemaTypes';

const list = (S: any, title: string, type: string) => S.listItem().title(title).schemaType(type).child(S.documentTypeList(type).title(title));
const group = (S: any, title: string, items: [string, string][]) => S.listItem().title(title).child(S.list().title(title).items(items.map(([t, ty]) => list(S, t, ty))));
const byStatus = (S: any, title: string, status: string) => S.listItem().title(title).child(S.documentList().title(title).filter(`_type in $types && workflow.status == $status`).params({ types: workflowTypes, status }));

export const structure: StructureResolver = (S) =>
  S.list().title('Native Media').items([
    S.listItem().title('Editorial workflow').child(S.list().title('Editorial workflow').items([
      byStatus(S, 'Needs review', 'in-review'), byStatus(S, 'Approved, ready to publish', 'approved'), byStatus(S, 'Drafts', 'draft'),
      S.listItem().title('Scheduled for later').child(S.documentList().title('Scheduled for later').filter(`_type in $types && defined(workflow.publishAt) && workflow.publishAt > now()`).params({ types: workflowTypes })),
    ])),
    S.divider(),
    group(S, 'African Intelligence', [['Episodes', 'episode'], ['Guests', 'guest']]),
    group(S, 'Stories', [['Stories', 'story'], ['Authors', 'author']]),
    group(S, 'Intelligence & research', [['Briefings and papers', 'researchOutput']]),
    group(S, 'Publications', [['Publications', 'publication'], ['Editions', 'edition'], ['Chapters', 'chapter'], ['Embassy / partner profiles', 'embassyProfile'], ['Bilateral agreements', 'agreement'], ['Directory entries', 'directoryEntry'], ['Quarterly updates', 'quarterlyUpdate']]),
    group(S, 'Data', [['Datasets', 'dataset'], ['Data exhibits', 'exhibit']]),
    group(S, 'Partners & sponsors', [['Partners and collaborators', 'partner'], ['Sponsors', 'sponsor']]),
    S.divider(),
    list(S, 'Corrections', 'correction'),
  ]);
