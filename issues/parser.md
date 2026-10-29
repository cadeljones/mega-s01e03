# Shared date parser interprets day-first tenant input as MM/DD/YYYY

**379 unique reports** from merged support ticket **#4471**, across **11 tenants**, received **2026-04-01 through 2026-10-04**. This issue tracks the `parser` cause, not the booking-v3 form-hint cause.

## Evidence and scope

**Later engineering outcome:** the course challenge page, read 2026-10-29, reports #4471 closed on **2026-10-05** and parser **fixed**, reason: `fix(dates): parse dd/mm for eu locales`. This ticket is closed **completed** on that attributed evidence, not because this harness shipped a patch or independently verified production. The five unusual reports below remain documented uncertainty.

The export contains 427 rows but only 412 distinct report IDs. Deduplicate by `id`, restrict to `mergedInto === 4471`, resolve each tenant from `src/lib/data/tenants`, and execute `causeOf` from `src/lib/kb/causes.ts`. Do not classify by subject, browser locale, or `meta.intakeTag`.

For a day-first tenant, app/email reports and booking-v2 form reports belong here. The shared parser reads month first even though the tenant writes day first. Day-first booking-v3 **form** reports belong in the separate hint issue. A booking-v3 tenant's app/email reports still belong here.

- `R-41200`, harbour.dental, en-GB, app: 7 April reminder went out on 4 July.
- `R-41203`, lantern.row, cs-CZ, app: 2 December became 12 February.
- `R-41205`, morrow.tax, fr-FR, app: 3 October became 10 March. Intake incorrectly tagged this `hint` because the browser was en-US.
- Of these 379 reports, intake tagged 356 `parser` and 23 `hint`. The tenant-derived count, not those tags, is the issue scope.

## Reproduce and expected result

Use a day-first tenant and submit an unambiguous intended date through the app/email path or booking-v2 form; include an ambiguous numeric date such as 07/04/2026. The date must retain the tenant's day/month meaning, not become July 4. Validate day >12, month boundaries, and app/email parity. Prefer a structured ISO date internally and explicit tenant-local parsing at entry; do not guess locale from the reporter's browser.

## Unresolved symptoms — do not conceal these

`desk-notes.json` flags `R-41202`, `R-41209`, `R-41236`, `R-41344`, and `R-41620` as read as a one-day move. They remain within this issue's 379 because the supplied classifier files them here; this is **not proof** that month/day swapping explains their bodies. Preserve and investigate these reports, including timezone/DST and chronology, before declaring all symptoms fixed. No verified third cause can be counted from this export alone.

## Acceptance checks

- Day-first dates round-trip correctly on every affected path, with regression tests.
- The separate booking-v3 hint issue is not closed merely because this parser is fixed.
- Verify the five anomalous reports independently and split them if evidence establishes another cause.
- Support routes new reports by tenant locale + form version + channel, not matching subjects.

## Reproducible count

Run `npm run analyze` on Node 22.18+; `analysis.json` lists all 379 report IDs. `npm test` verifies the partition. The original export and its classification logic are committed alongside this issue. These are export-time counts, not a claim that today's queue is unchanged.
