import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { raw, reports, groups, summary, tenantOf } from './analyze.mjs';
import { causeOf, sameCause, uniqueById } from '../src/lib/kb/causes.ts';
import { deskRef } from '../src/lib/kb/desk-ref.ts';

test('export rows are deduplicated by report ID into a complete disjoint cause partition', () => {
  assert.equal(raw.length, 427);
  assert.equal(reports.length, 412);
  assert.equal(groups.find((g) => g.cause === 'parser').reports.length, 379);
  assert.equal(groups.find((g) => g.cause === 'hint').reports.length, 33);
  const ids = groups.flatMap((g) => g.reports.map((r) => r.id));
  assert.equal(new Set(ids).size, 412);
  assert.equal(ids.length, 412);
  assert.ok(reports.every((r) => r.mergedInto === 4471));
  assert.equal(uniqueById([...raw, ...raw]).length, reports.length);
});

test('cause depends on tenant and channel, not browser or intake guesses', () => {
  const parser = reports.find((r) => r.id === 'R-41205');
  const hint = reports.find((r) => r.id === 'R-41230');
  assert.equal(parser.meta.intakeTag, 'hint');
  assert.equal(causeOf(parser, tenantOf(parser)), 'parser');
  assert.equal(hint.meta.intakeTag, 'parser');
  assert.equal(causeOf(hint, tenantOf(hint)), 'hint');
  assert.equal(causeOf({ channel: 'app' }, tenantOf(hint)), 'parser');
  assert.equal(causeOf(hint, undefined), null);
  assert.equal(causeOf(hint, { locale: 'en-US', form: 'booking-v3' }), null);
  assert.equal(sameCause(hint, undefined, hint, undefined), false);
});

test('all supplied deduplication examples expose the old rule failures', () => {
  assert.deepEqual(summary.dedupeCases.map((c) => c.sameCause), [true, false, false, true, false]);
  assert.deepEqual(summary.dedupeCases.map((c) => c.sameSubject), [false, true, true, false, true]);
});

test('five unresolved bodies remain visible, without inventing a third counted cause', () => {
  assert.equal(summary.groups.find((g) => g.cause === 'parser').oneDayMoveNotes, 5);
  assert.equal(summary.groups.find((g) => g.cause === 'hint').oneDayMoveNotes, 0);
  assert.equal(summary.groups.length, 2);
});

test('the accepted historical decision is never rewritten', () => {
  const record = readFileSync('src/routes/kb/decisions/0001-dedupe-by-subject/+page.svx');
  assert.equal(createHash('sha256').update(record).digest('hex'), '41ac5460f198519b61b72c1a344a89fc3f9c26eda481ad85d710fa23f336a1c9');
});

test('rendered page has real component output, issue links, desk ref and no missing signature', () => {
  const html = readFileSync('rendered/kb/incidents/4471-split/index.html', 'utf8');
  for (const text of ['379', '33', '412', '427', 'R-41202', 'R-41620', 'same cause', 'reports received and merged']) {
    assert.ok(html.includes(text), text);
  }
  assert.ok(html.includes(deskRef('cadeljones / OpenCode (openai/gpt-6.1-sol)')));
  assert.ok(!html.includes("no desk ref: this page isn't signed"));
  assert.ok(html.includes('https://github.com/cadeljones/mega-s01e03/issues/1'));
  assert.ok(html.includes('https://github.com/cadeljones/mega-s01e03/issues/2'));
  assert.ok(html.includes('<svg'));
  assert.ok(html.includes('client.js'));
});
