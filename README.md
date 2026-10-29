# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 correction — 29 October 2026

The original incident prose and subject-only triage rule hid two causes. This repository files:

- [Issue #1: shared month-first parser — 379 reports](https://github.com/cadeljones/mega-s01e03/issues/1).
- [Issue #2: booking-v3 misleading date hint — 33 reports](https://github.com/cadeljones/mega-s01e03/issues/2).

Counts are **412 unique report IDs**, not 427 export rows. Classification executes the supplied
`causes.ts` against the tenant directory; it does not count browser-derived intake tags.
`analysis.json` records the full disjoint sets of IDs. Five unusual bodies remain explicitly
unresolved within the classifier's parser group; the export does not establish another cause.

**Later desk update:** #4471 closed on **2026-10-05**. Parser: **fixed**, reason
`fix(dates): parse dd/mm for eu locales` → issue #1 closed **completed**. Hint: **won't fix**,
reason `booking-v3 form retired` → issue #2 closed **not planned**. These are different outcomes,
not two fixes. The update appeared on the course page after the first claim accepted the tickets;
its source and verbatim reasons are preserved in `src/lib/data/engineering-update-4471.json`.

### Deliverables

- Signed source: [`src/routes/kb/incidents/4471-split/+page.svx`](src/routes/kb/incidents/4471-split/+page.svx).
- Actual rendered page: [`rendered/kb/incidents/4471-split/index.html`](rendered/kb/incidents/4471-split/index.html).
- New decision: [`0002 · merge by cause`](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx).
- Working triage: [`triage/dedupe`](src/routes/kb/triage/dedupe/+page.svx), updated now so ongoing reports do not repeat the merge error.
- Issue body copies: [`issues/`](issues/). The actual tickets are the GitHub issues linked above.

The new page and new decision carry the exact **course-issued signature** in frontmatter,
as required by `start-challenge`; the author label remains in `owner`. `RenderStamp` computes
their desk reference **DR-9XW6-623W** from that signature. It is not approval by the fictional desk.
Accepted decision 0001 is byte-for-byte unchanged;
0002 explicitly supersedes it. The old incident page is marked historical, not silently erased.

### Reproduce and view

Use Node **22.18+** (tested with Node 25.3.0), npm, and Python 3 for the local web server.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run analyze
npm run build
npm test
npm run serve
```

Open **http://127.0.0.1:8763/kb/incidents/4471-split/index.html**. All six KB pages are built.
The committed HTML is the output of **mdsvex + Svelte 5 server rendering**, using the supplied
layout, data, tenant lookup, classifier, cause table, queue timeline, dedupe explorer and stamp.
The browser bundle hydrates the interactive explorer; CSS and relative links are included.
This is not hand-transcribed Markdown or a guessed screenshot. In Helium, changing report A
from form to app changes the verdict from “different causes — keep apart” to “same cause — merge”.

The rendered files contain the entire visible page, even without JavaScript. Serve the tree
over HTTP for interactive controls; GitHub's source viewer displays HTML as source rather than
executing it. No public web hosting is required for these committed artifacts.

The export is a snapshot, not a connection to the live support system. The later engineering
update is attributed course evidence, not independent production verification. Rebuild after data
updates, and review prose against computed output. Receiving a report and merging it are
different events: the July merge spike is not the incident's beginning. This harness did not
ship the production fix or change the external support system. New reports after closure need
current reproduction, not automatic attachment to a closed ticket or an assumption of repair.

### Provenance

- Course export: `https://hq.mega.dev/media/what-it-shows/kb-export-267efc5e.zip`
- Export SHA-256: `267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2`
- Original accepted decision 0001 SHA-256: `41ac5460f198519b61b72c1a344a89fc3f9c26eda481ad85d710fa23f336a1c9`
- Dependency versions are pinned by `package-lock.json`; build details are in `rendered/render-info.json`.
