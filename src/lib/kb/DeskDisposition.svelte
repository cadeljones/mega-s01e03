<script lang="ts">
  import update from '#lib/data/engineering-update-4471.json';
</script>

<h2>Engineering update: closure is not always a fix</h2>
<p>The course desk reports #{update.ticket} closed on {update.closedAt}. Read on {update.observedAt} from the <a href={update.source}>challenge page</a>, after the export. This is attributed engineering evidence, not a claim that this harness shipped or independently tested production code.</p>
<table>
  <thead><tr><th>cause</th><th>engineering outcome</th><th>reason</th><th>our issue disposition</th></tr></thead>
  <tbody>{#each update.outcomes as outcome}<tr><td>{outcome.cause}</td><td><strong>{outcome.status}</strong></td><td>{outcome.reason}</td><td><a href={outcome.issue}>closed: {outcome.githubCloseReason}</a></td></tr>{/each}</tbody>
</table>
<p><strong>Fixed and won't fix are different outcomes.</strong> The parser was corrected; the hint was not repaired—the booking-v3 form was retired. Do not describe both issues as fixed. The historical reports and their counts remain evidence even though the tickets are closed.</p>
