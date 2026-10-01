/**
 * Tanzania Economic Diplomacy Review data from the CMS. Without a CMS (or with no entries yet) every
 * function returns an empty list, and the pages show their "none published yet" messages.
 * Embassy profiles are shown ONLY when all of these are true (matching the Review's editorial policy):
 * workflow approved, participation confirmed, mission signed off, data verified.
 */
import { IMG, LIVE, cms, cmsEnabled, ptToHtml, sourceLine, toImage } from './cms';
import * as R from '../data/review';

/** Fetch once per build, however many pages ask. */
const once = <T>(fn: () => Promise<T>) => { let p: Promise<T> | undefined; return () => (p ??= fn()); };
const PT = (n: string) => `${n}[]{ ..., _type == "image" => { ..., "url": asset->url } }`;

export type Correction = { date: string; item: string; original: string; corrected: string; reason?: string };
export const getCorrections = once(async function getCorrections(): Promise<Correction[]> {
  if (!cmsEnabled) return R.corrections.map((c) => ({ date: c.date, item: c.item, original: '', corrected: c.change }));
  const rows = await cms(`*[_type == "correction" && ${LIVE}] | order(date desc){ item, date, originalText, correctedText, reason }`);
  return rows.map((r) => ({ date: r.date, item: r.item, original: r.originalText, corrected: r.correctedText, reason: r.reason ?? undefined }));
});

export type Sponsor = { name: string; role: string; scope?: string; confirmedOn?: string; website?: string; logo?: ReturnType<typeof toImage> };
export const getSponsors = once(async function getSponsors(): Promise<Sponsor[]> {
  if (!cmsEnabled) return R.sponsors.map((s) => ({ name: s.name, role: s.role }));
  const rows = await cms(`*[_type == "sponsor" && ${LIVE} && permission == true && noEditorialControl == true] | order(name asc){ name, agreedRole, scope, confirmedOn, website, logo ${IMG} }`);
  return rows.map((r) => ({ name: r.name, role: r.agreedRole, scope: r.scope ?? undefined, confirmedOn: r.confirmedOn ?? undefined, website: r.website ?? undefined, logo: toImage(r.logo) }));
});

export type Edition = { title: string; period: string; status: string; href: string; pdf?: string };
const statusLabel: Record<string, string> = { proposed: 'Proposed', draft: 'Draft for verification', forthcoming: 'Forthcoming', published: 'Published' };
export const getEditions = once(async function getEditions(): Promise<Edition[]> {
  if (!cmsEnabled) return R.editions;
  const rows = await cms(`*[_type == "edition" && ${LIVE}] | order(publishDate desc){ label, status, reportingPeriod, "pdf": pdf.asset->url }`);
  return rows.map((r) => ({ title: r.label, period: r.reportingPeriod ?? '', status: statusLabel[r.status] ?? r.status, href: R.REVIEW_BASE, pdf: r.status === 'published' ? r.pdf ?? undefined : undefined }));
});

export type Profile = {
  slug: string; country: string; region: string; sponsored: boolean; relationsStart?: number; ambassadorName?: string; ambassadorTitle?: string; missionAddress?: string;
  signoffDate?: string; cutoff?: string; sections: { title: string; html: string }[]; sources: string[];
};
const SECTIONS: [string, string][] = [['ambassadorMessage', 'Ambassador’s Message'], ['relationship', 'Relationship at a Glance'], ['trade', 'Bilateral Trade'], ['investment', 'Investment'], ['projects', 'Flagship Projects'], ['agreementsText', 'Agreements'], ['opportunities', 'Opportunities'], ['peopleCulture', 'People and Culture'], ['contacts', 'Contacts']];
export const getProfiles = once(async function getProfiles(): Promise<Profile[]> {
  if (!cmsEnabled) return [];
  const rows = await cms(`*[_type == "embassyProfile" && ${LIVE} && participation == "confirmed" && signoff.signedOff == true && verification.status == "verified"] | order(region asc, country asc){
    "slug": slug.current, country, region, sponsored, relationsStart, ambassadorName, ambassadorTitle, missionAddress, "signoffDate": signoff.date, "cutoff": verification.cutoff, sources,
    ${SECTIONS.map(([n]) => PT(n)).join(', ')} }`);
  return rows.map((r) => ({
    slug: r.slug, country: r.country, region: r.region, sponsored: Boolean(r.sponsored), relationsStart: r.relationsStart ?? undefined, ambassadorName: r.ambassadorName ?? undefined,
    ambassadorTitle: r.ambassadorTitle ?? undefined, missionAddress: r.missionAddress ?? undefined, signoffDate: r.signoffDate ?? undefined, cutoff: r.cutoff ?? undefined,
    sections: SECTIONS.map(([n, title]) => ({ title, html: ptToHtml(r[n]) })).filter((s) => s.html),
    sources: (r.sources ?? []).map(sourceLine),
  }));
});
