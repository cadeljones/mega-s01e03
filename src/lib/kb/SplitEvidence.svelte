<script lang="ts">
  import raw from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const reports = uniqueById(raw as Report[]).filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const misclassified = groups.reduce((sum, g) => sum + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0);
  const anomalies = reports.filter((r) => notes.oneDayMove.includes(r.id));
  const first = (key: 'receivedAt' | 'mergedAt') => reports.map((r) => r[key]).filter((v): v is string => !!v).sort()[0]?.slice(0, 10);
  const last = (key: 'receivedAt' | 'mergedAt') => reports.map((r) => r[key]).filter((v): v is string => !!v).sort().at(-1)?.slice(0, 10);
</script>

<p>{raw.length} export rows − {raw.length - reports.length} duplicate rows = <strong>{reports.length} unique reports</strong>. Count by report ID, not rows, subjects or messages. Tenant-based classification disagrees with {misclassified} intake tags.</p>

<p>Reports were received from {first('receivedAt')} to {last('receivedAt')}; merges run from {first('mergedAt')} to {last('mergedAt')}. The July merge spike is desk processing, not the start of the incident. Arrivals continued after that spike: “known” is not “fixed”.</p>

<h3>Unresolved report bodies</h3>
<p>{anomalies.length} reports marked in desk-notes.json remain in the parser count under the supplied tenant-based logic. Their bodies are not explained by a confirmed month/day swap. Investigate them separately before claiming that either fix resolves every symptom; the export does not establish a count for a third cause.</p>
<table>
  <thead><tr><th>report</th><th>tenant / channel</th><th>what the person wrote</th></tr></thead>
  <tbody>{#each anomalies as r}<tr><td>{r.id}</td><td>{r.tenant} / {r.channel}</td><td>{r.body}</td></tr>{/each}</tbody>
</table>
