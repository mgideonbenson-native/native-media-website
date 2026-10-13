import data from '../../../data/strategic-minerals.json';

/** Serves data/strategic-minerals.json at /data/strategic-minerals.json, so the page's "Download the data" link and other tools can reuse it. */
export function GET() {
  return new Response(JSON.stringify(data, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
