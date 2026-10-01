import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, workflowTypes } from './schemaTypes';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'placeholder';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

/**
 * Approval gate: a document can be published only when its workflow status is "Approved".
 * Validation rules in each schema add further checks (sources, sign-off, permissions).
 */
const gatePublish = (original: any) => (props: any) => {
  const result = original(props);
  const status = props.draft?.workflow?.status ?? props.published?.workflow?.status;
  if (workflowTypes.includes(props.type) && status !== 'approved') {
    return { ...result, disabled: true, title: 'Set Editorial workflow to "Approved" (with approver and date) before publishing.' };
  }
  return result;
};

export default defineConfig({
  name: 'native-media',
  title: 'Native Media',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    actions: (prev) => prev.map((a) => (a.action === 'publish' ? gatePublish(a) : a)),
  },
});
