# HV Technologies content edit mode

Date: 2026-09-05  
Status: approved for planning  
Site: static Astro build on GitHub Pages  
Related: `docs/superpowers/specs/2026-09-05-hvtech-redesign-design.md`

## Goal

Let a non-developer change copy on the live site in the browser, download the updated JSON files, and replace those files in the GitHub repo. No CMS, no server write-back, no new page files.

## Decisions already locked

- Content stays co-located in `src/content/`, one JSON file per topic.
- Edit mode is a hidden owner tool. Toggle with **Ctrl+Shift+E** (Windows/Linux) and **Cmd+Shift+E** (Mac). Same shortcut turns it off. No password.
- Editing is click-to-type on the live page. Only text that already exists.
- Text only. No image swaps. No adding or deleting products, reviews, clients, projects, phones, or emails.
- A slim top bar shows “Editing content” and **Download JSON**.
- Editable phrases get a light outline while edit mode is on.
- Anyone who knows the shortcut can edit *their* browser view. They cannot change production unless they can push to GitHub.
- Document the whole loop in `docs/CONTENT-MODIFICATION.md`.

## Content files (unchanged layout)

```
src/content/
  site.json       # brand, seo, nav, quote CTA, footer
  hero.json       # home hero
  about.json      # about page and teaser
  home.json       # featured / services / CTA / why-us headings
  projects.json   # delivered projects
  clients.json    # client logos (names only in edit mode)
  reviews.json    # testimonials
  contact.json    # addresses, phones, map labels, form success copy
  products.json   # catalog categories, items, page labels
  services.json   # the three service pages
  form.json       # Google Form action and entry IDs
  index.ts        # typed exports — not downloaded, not editable
```

JSON field values stay site-root paths (`/products`, `/insulator4.webp`). Do not write the GitHub Pages `/hvtech/` prefix into downloaded files. `withBase()` remains a render-time helper only.

## What you can edit

On-page text that is already rendered:

- Headlines, eyebrows, paragraphs, button and nav labels
- Product and service names, summaries, descriptions, group titles, list items, CTA labels
- Review names and quotes
- Client display names
- Contact person name, emails, phones, addresses, form success copy, submit labels
- Footer blurb and copyright

`form.json` is **not** wired to click-to-edit. Google Form `action` and `entry.*` IDs must not be changeable from the page. The file is still included in the download, unchanged.

Images, layout, hrefs, slugs, categories, featured flags, map embed URL, WhatsApp URL, and the count of list items stay as they are.

## Enter, edit, leave

1. Press Ctrl+Shift+E or Cmd+Shift+E on any page.
2. The bar appears. Tagged text becomes `contenteditable` and outlined.
3. Click a phrase and type. The change shows immediately.
4. Navigate to another page in the same tab. Edits persist via `sessionStorage` plus an in-memory snapshot, so a Home headline still matches About if both read the same field.
5. Press the shortcut again to leave edit mode. The snapshot stays until the tab closes.
6. Closing the tab without downloading discards edits.

Links stay navigable. Edit the label inside the link, not the URL. Do not put `contenteditable` on the `<a>` itself.

Emptying a field is allowed. Download still works. The README must say: do not leave headings empty; the next `npm run validate` / build may fail.

If `sessionStorage` is full or blocked, keep editing in memory. Download still uses the in-memory snapshot.

## Download and publish

**Download JSON** builds one zip of these eleven files, using the snapshot (edits applied, `form.json` as shipped):

`site.json`, `hero.json`, `about.json`, `home.json`, `projects.json`, `clients.json`, `reviews.json`, `contact.json`, `products.json`, `services.json`, `form.json`

The owner then:

1. Unzips the archive.
2. In the GitHub repo, replaces the same names under `src/content/`.
3. Commits and pushes (or opens a PR). GitHub Actions rebuilds Pages.

The site cannot write to GitHub. There is no second backend.

## Architecture

Static Astro. No React islands required.

1. **`Editable` wrapper** — tags each phrase with `data-content-file` and `data-content-path` (for example `hero` + `headline`, or `reviews` + `items.0.quote`). The visible text is the current field value.
2. **Content snapshot** — the eleven JSON files are serialized into the page (script tag or equivalent) at build time so the browser can patch them.
3. **Client script on every page** (loaded from `BaseLayout`):
   - Listens for the shortcut (`preventDefault` so the browser finds nothing else).
   - Toggles a document flag / class and the toolbar.
   - Turns tagged nodes `contenteditable` only while the flag is on.
   - On `input`, writes the new string into the snapshot at that path and updates `sessionStorage`.
   - On load, if a snapshot exists in `sessionStorage`, applies it to matching nodes so navigation keeps edits.
   - Download zips the snapshot. Use a small zip helper (for example `fflate`) or an equivalent without adding a server.

Same field on two pages (about teaser and `/about-us`) uses the same file + path so one store update covers both after navigation.

## Toolbar

Fixed slim bar, Industrial Navy: ink background, accent Download button, white “Editing content” label. Pin it just below the existing fixed header so nav stays usable. Visible only in edit mode.

## README

Create `docs/CONTENT-MODIFICATION.md` covering:

- Shortcut
- What can and cannot change
- Download → replace `src/content/*.json` on GitHub → commit
- Do not leave headings empty
- Do not edit `form.json` by hand unless changing the Google Form
- After DNS cutover to `hvtech.co`, this flow is unchanged (paths in JSON stay unprefixed)

## Error handling

| Case | Behavior |
|---|---|
| Shortcut in a form field | Still toggles edit mode; do not hijack normal typing except the exact combo with Shift+E |
| Storage quota / private mode | In-memory snapshot only; Download still works |
| Unknown `data-content-path` | Ignore the node; do not crash |
| Download with empty heading | Allow; README warns |
| Zip library missing at runtime | Show a short error on the bar; do not navigate away |

## Testing

- `npm run check` passes.
- `npm run build` still emits the existing 20 pages.
- A unit or node test asserts the zip contains exactly the eleven filenames above.
- Manual: toggle shortcut on / off; edit hero headline; go to another page and back; Download; unzip and confirm `hero.json` `headline` matches.
- Manual: `form.json` in the zip matches the repo file (no click-to-edit on entry IDs).
- Manual: product Enquire and nav links still work while edit mode is on.

## Out of scope

- Password or hidden query-param gate
- Adding or removing cards
- Replacing or uploading images
- Writing back to GitHub from the browser
- A `/edit` form page or side-panel field list
- Editing `form.json` entry IDs from the UI
- Persisting edits after the tab closes (no `localStorage`)

## Success

An owner can change a headline on the live site, download a zip, replace the JSON files on GitHub, and see the new copy after the Pages build. A visitor who never presses the shortcut sees the normal site.
