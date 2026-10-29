# booking-v3 displays a month-first date hint for day-first tenants

**33 unique reports** from merged support ticket **#4471**, across **3 tenants** (alder.physio, copper.studio, pale.harbour), received **2026-04-17 through 2026-09-22**. This issue tracks the `hint` cause, separate from the shared parser issue.

## Evidence and scope

The export has 427 rows, 412 distinct IDs; deduplicate by `id` before counting. Resolve the tenant's locale and booking form from `src/lib/data/tenants`, then run `causeOf` in `src/lib/kb/causes.ts`.

For day-first tenants using booking-v3, **form-channel** reports belong here: the form prints `MM/DD/YYYY`, people follow it, and the form reads their input in the tenant's day-first order. This is the opposite direction of mismatch from the shared parser bug. App/email reports from those same tenants belong in the parser issue, not here.

- `R-41230`, copper.studio, es-ES, form: client came on 1 June instead of 6 January; intake incorrectly tagged it `parser`.
- `R-41241`, alder.physio, de-DE, form: people arrived on 8 June instead of 6 August.
- `R-41251`, pale.harbour, pt-PT, form: 7 January showed as 1 July; intake incorrectly tagged it `parser`.
- Intake tagged these reports 18 `hint` and 15 `parser`. Those guesses do not determine the count.

## Reproduce and expected result

Open booking-v3 for a day-first tenant. Its hint says `MM/DD/YYYY`; enter a date following it (for example 06/01/2026 for June 1). The form interprets that as January 6 using the tenant's locale. The hint, examples, validation, parsing and resulting booking must all agree on the same tenant-local date convention.

## Acceptance checks

- Render a tenant-appropriate date hint and example; confirm the input and saved date agree.
- Test de-DE, es-ES and pt-PT form flows with ambiguous dates and days >12.
- Keep the parser regression suite and the separate parser issue: fixing the parser alone does not correct this misleading hint.
- Route future day-first booking-v3 form reports here even if the subject matches the parser issue; route its app/email reports separately.

## Reproducible count

Run `npm run analyze` on Node 22.18+; `analysis.json` lists all 33 report IDs. `npm test` verifies the two issue scopes are disjoint and cover all 412 unique reports. Counts describe the exported queue; support must continue routing later arrivals.
