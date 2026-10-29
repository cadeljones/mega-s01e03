import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { uniqueById, groupByCause, readAs } from '../src/lib/kb/causes.ts';
import { DEDUPE_CASES } from '../src/lib/kb/dedupe-cases.ts';
import { sameCause } from '../src/lib/kb/causes.ts';

export const raw = JSON.parse(readFileSync(new URL('../src/lib/data/reports-4471.json', import.meta.url)));
export const tenants = readdirSync(new URL('../src/lib/data/tenants', import.meta.url)).map((name) =>
  JSON.parse(readFileSync(new URL(`../src/lib/data/tenants/${name}`, import.meta.url))));
export const tenantOf = (report) => tenants.find((tenant) => tenant.handle === report.tenant);
export const reports = uniqueById(raw).filter((report) => report.mergedInto === 4471);
export const notes = JSON.parse(readFileSync(new URL('../src/lib/data/desk-notes.json', import.meta.url)));
export const groups = groupByCause(reports, tenantOf);
export const summary = {
  exportRows: raw.length,
  uniqueReports: reports.length,
  duplicateRows: raw.length - reports.length,
  groups: groups.map(({ reports, ...group }) => ({
    ...group,
    count: reports.length,
    oneDayMoveNotes: readAs({ reports }, notes.oneDayMove),
    reportIds: reports.map((report) => report.id),
  })),
  dedupeCases: DEDUPE_CASES.map((c) => ({
    ...c,
    sameSubject: c.a.subject === c.b.subject,
    sameCause: sameCause(c.a, tenantOf(c.a), c.b, tenantOf(c.b)),
  })),
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  writeFileSync(new URL('../analysis.json', import.meta.url), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify({ ...summary, groups: summary.groups.map(({ reportIds, ...g }) => g) }, null, 2));
}
