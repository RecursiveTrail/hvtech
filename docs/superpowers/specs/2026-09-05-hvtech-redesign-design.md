# HV Technologies website redesign

Date: 2026-09-05  
Status: approved for planning  
Source site: https://hvtech.co/  
Stack reference: https://github.com/RecursiveTrail/RecursiveTrail.github.io

## Goal

Rebuild HV Technologies as a static marketing site. Keep every real page, product, service, logo, review, and contact detail from the current site. Redesign the look. Use the RecursiveTrail stack and the same Google Form → Sheet contact flow.

## Decisions already locked

- Hybrid IA: full home page plus dedicated Products, About, three Services, and Contact pages.
- Visual direction: Industrial Navy (slate hero, electric blue, light product cards).
- Home hero: one cinematic full-bleed photo, not a carousel.
- Products live in `src/content/products.json`. Adding a product is one JSON object plus an image.
- Catalog has 13 products copied from https://hvtech.co/products. HVAC Divider has no source image; the card uses a navy placeholder until an image is added.
- Drop the live site’s “Pride in Numbers” 0+ counters. We do not have real figures.
- Clean obvious typos in copied copy (`transformar`, `swith gear`, `Electromagetic`, and similar). Keep meaning.
- Contact posts to a Google Form that writes to a Sheet, same iframe pattern as RecursiveTrail.

## Stack

Match RecursiveTrail:

- Astro 7, TypeScript, Tailwind CSS 4 via `@tailwindcss/vite`
- `@astrojs/sitemap`, `@astrojs/check`
- Static output. No server runtime, no CMS, no database.
- Content in JSON under `src/content/`.
- Deploy as a static build (GitHub Pages workflow copied from RecursiveTrail). `public/CNAME` can be set to `hvtech.co` when DNS is ready.

Node `>=22.12.0`.

## Site map

| Route | Source |
|---|---|
| `/` | Home |
| `/products` | Catalog |
| `/products/[slug]` | One product, generated from `products.json` |
| `/designing-fabrications` | Service |
| `/repairing-maintenance` | Service |
| `/onsite-testing` | Service |
| `/about-us` | About |
| `/contact-us` | Contact + map |

Unknown current-site URLs 404. No `/services` index page.

### Navigation

Desktop: logo · Home · Products · About Us · Services ▾ · Contact · Get a Quote.

Services dropdown:

- Designing & Fabrications → `/designing-fabrications`
- Repair & Maintenance → `/repairing-maintenance`
- On-Site Testing → `/onsite-testing`

Get a Quote and the WhatsApp chip both go to contact (WhatsApp uses `https://wa.me/917398651879`).

Mobile: hamburger, same links, Services as an expandable group.

## Visual system

Industrial Navy:

- Ink: `#0f172a` (slate-900)
- Accent: `#2563eb` (blue-600), hover `#1d4ed8`
- Paper: `#f8fafc` / white cards
- Mute: `#475569`
- Font: Inter only (current site). RecursiveTrail’s Sora is not used.
- Sharp corners (`rounded-sm`), 4px blue rules on section labels, uppercase tracking on eyebrows.
- Hero photos from the current site: `/insulator4.png`, `/emp_work2.png`, `/insulator6.jpg` as available assets. Hero uses one of these, not a slider.

No dark-mode toggle. The home hero and footer are dark; catalog, about, services, and contact bodies are light.

## Content files

```
src/content/
  site.json       # brand, seo, nav, quote CTA, footer
  hero.json       # home hero
  about.json      # about page and teaser
  home.json       # featured / services / CTA / why-us headings
  projects.json   # delivered projects
  clients.json    # client logos
  reviews.json    # testimonials
  contact.json    # addresses, phones, map, form success copy
  products.json   # catalog categories, items, page labels
  services.json   # the three service pages
  form.json       # Google Form action, entry IDs, field labels
  index.ts        # typed exports
```

### `products.json`

Already approved. Required fields to add a product:

- `slug` (unique, URL segment)
- `name`
- `category` — one of `impulse`, `measurement`, `facilities`, `cable-testing`, `components`
- `featured` — `true` items appear in the home featured row
- `summary` — card line
- `description` — detail page
- `image` — path under `/public`, or `""` for placeholder
- `standards` — string array, may be empty
- `specs` — `{ label, value }[]`, may be empty

Featured now: Impulse Voltage Generator, RF Shielded Room, Impulse Voltage Controller, Heat Cycle System.

### `services.json`

One object per service page:

```json
{
  "slug": "onsite-testing",
  "href": "/onsite-testing",
  "eyebrow": "Service",
  "name": "On-Site Testing",
  "tagline": "Precision Testing. Field Diagnostics. Real-Time Results.",
  "description": "…",
  "groups": [
    { "title": "Electrical Safety Testing", "items": ["Insulation resistance testing", "…"] }
  ],
  "why": ["Certified testing equipment", "…"],
  "cta": { "label": "Book a Site Visit", "text": "Need professional on-site testing? …" }
}
```

Copy is the current page content, typos cleaned.

### `form.json`

Same shape as RecursiveTrail: `action`, `method: "POST"`, `minSubmitMs: 2500`, `honeypotName: "website_url"`, and a `fields` map whose keys are `entry.<id>` values.

The live form is [this Google Form](https://docs.google.com/forms/d/e/1FAIpQLSfMZI1JYF9MdcAHMdlkNm9HkooXY8KmnBjYyZ7cBBjMxQ7uqQ/viewform). `form.json` is connected:

| UI field | Google `entry` |
|---|---|
| Name | `entry.750210231` |
| Phone | `entry.2106024227` |
| Email | `entry.846203511` |
| Message | `entry.1889579180` |

The Google Form has no Interest question. The site still shows an Interest dropdown (products + three services + “General enquiry”). On submit, the script prefixes the message with `Interest: {label}` and posts that combined text to `entry.1889579180`. Do not POST to RecursiveTrail’s form. Implementation must not invent a second submission backend.

Form fields (user-facing):

| Label | Type | Required | Notes |
|---|---|---|---|
| Name | text | yes | |
| Phone | tel | yes | Indian numbers accepted; 10 digits or `+91…` |
| Email | email | yes | |
| Interest | select | yes | Site-only; prefixed into Message |
| Message | textarea | yes | |

Prefill: `/contact-us?interest=<slug>` selects the matching Interest option. Product Enquire and service CTAs use this.

## Pages

### Home

1. Header
2. Cinematic hero — headline “Powering the Future of Industrial Solutions”, current pitch paragraph, View Equipment + Get a Quote
3. Featured equipment — four featured products → `/products/[slug]`
4. Delivered projects — the three current homepage case studies (500kVp/25KJ, RF Shielded Room, 300kVp/7.5KJ) with their existing write-ups and photos (`chopping-cable.jpg`, `rf_shielding.jpg`, `imsystem.jpg`). These stay in `projects.json`, not `products.json`, because they are job stories, not catalog SKUs.
5. Services — three cards → service routes
6. About teaser — cleaned about paragraph + `emp-work.jpg` → `/about-us`
7. Clients — nine logos from the current site
8. Reviews — five unique testimonials (Saurabh Agrahari, K.P Singh, Sudhir Poswal, Rakesh Gupta, Pradep Jain). Do not duplicate Saurabh.
9. CTA band → `/contact-us`
10. Footer

### Products index

Eyebrow “Catalog”, title “Our Products”. Filter chips for the five categories plus All. Card: image, name, summary, View → `/products/[slug]`, Enquire → `/contact-us?interest=<slug>`. Empty image → navy placeholder with the product name.

### Product detail

Name, image, summary, full description, standards list if any, specs table if any, Enquire button with prefill. “Back to products” link.

### Service page (shared template)

Eyebrow, title, tagline, description, four groups of bullet lists, “Why choose HV Tech?” list, CTA band → `/contact-us?interest=<service-slug>`.

### About

Current about photo and cleaned two-paragraph copy. Same CTA to contact.

### Contact

Two-column layout: left = Vinod Maurya card (`AJ` initials are on the current site; keep the name and `+91 7398 651 879`), handshake image if we have `Chat_hanshake.png`; right = the form. Below: “Find Us Here” Google Maps embed (Prayagraj HV Technologies iframe from the current site). Footer repeats both addresses:

- V 22 Pawala Khasropur Jahajgarh Daulatabad, Gurgaon 122006
- Khamaria Belhat Koraon Prayagraj, U.P. 212306

Emails: `info@hvtech.co`, `hvteknologies@gmail.com`  
Phones: `+91 9415679524`, `+91 7398651879`

Success state: hide the form, show “Message received” and a one-line thank-you. Same iframe `load` detection as RecursiveTrail, plus honeypot and 2.5s minimum submit.

## Components

Keep files small and single-purpose, same split as RecursiveTrail:

- `layouts/BaseLayout.astro` — html shell, meta, fonts, global CSS
- `components/Header.astro`, `Footer.astro`, `Logo.astro`, `WhatsApp.astro`
- `components/ui/Section.astro` — eyebrow + title + rule
- `components/sections/*` — one home block each
- `components/ProductCard.astro`, `ServiceCard.astro`
- `components/ContactForm.astro` — the Google Form post + validation
- `pages/products/[slug].astro` — `getStaticPaths` from `products.json`
- `pages/designing-fabrications.astro`, `repairing-maintenance.astro`, `onsite-testing.astro` — thin wrappers over one `ServicePage.astro` layout component

No React islands unless a filter chip or mobile menu is cleaner as a few lines of script in the Astro file. Default: plain Astro + a script tag, like RecursiveTrail’s form.

## Data flow

- Build time: JSON → pages and cards.
- Runtime: contact form POST to `https://docs.google.com/forms/d/e/<id>/formResponse` with `target` pointing at a hidden iframe. No HV Tech server, no email API.
- Interest prefill is a query param read in the form script on load.

## Error handling

- Missing product slug → Astro 404.
- Missing product image → placeholder, never a broken `<img>`.
- Form: field-level errors, disable submit while sending, restore the button if the iframe never loads after 8 seconds and show “Could not send. Call us or try again.”
- Honeypot filled → silently drop.
- Submit faster than 2.5s → block with “Please take a moment before submitting.”
- Google Form IDs still placeholders → form remains visible but submit shows “Form is not connected yet. Please call or email.” so we do not POST to RecursiveTrail’s form.

## SEO and chrome

- Per-page title: `{Page} — HV Technologies` (home: `HV Technologies — High-Voltage Test Systems`).
- Meta description from `site.json` / `about.json` / `contact.json` / product summary / service tagline.
- Favicon from current `/favicon.ico` and circular logo.
- `robots.txt` + sitemap.
- Footer credit: “© 2026 HV Technologies. All rights reserved.” Do not keep “Developed by mind2machine Softwares Pvt Ltd”.

## Assets to copy from the live site

Already extracted: catalog images under `public/products/`, plus `hvdc-divider.jpg`.

Still copy into `public/` during implementation:

- `hvcirclelogo.jpg`, `hvtechlogo.jpg`, `favicon.ico`
- Hero/about: `insulator4.png`, `emp_work2.png`, `insulator6.jpg`, `emp-work.jpg`, `Chat_hanshake.png`
- Projects: `chopping-cable.jpg`, `rf_shielding.jpg`, `imsystem.jpg`
- Clients: `svasca-industries.jpg`, `logo.png`, `logo (1).png`, `logo (2).png`, `fhgtnjghjhgmh.png`, `Amit_Test_and_Calibration_Centre_-_labgo.png`, `images.png`, `startLabClient.jpg`, `IMP_Logo.png`

Rename client files to stable slugs in `public/clients/` and point `clients.json` at the new names. Keep originals only if a rename would lose a needed extension.

## Out of scope

- Admin UI or CMS
- Real-time product API (the current products page loader is abandoned)
- Fake impact statistics
- Blog, careers, or extra service types
- Payment, login, or quotes-as-PDF
- Recreating RecursiveTrail’s mint/dark visual system

## Testing

- `npm run check` (astro check + TypeScript) must pass.
- `npm run build` must emit every route above.
- Manual: home, products filter, one product detail, each service, about, contact validation (empty, bad email, honeypot, success).
- Enquire from a product and from a service lands on contact with Interest pre-selected.
- Mobile nav and Services dropdown.
- HVAC Divider card shows a placeholder, not a broken image.

## Success

A visitor can browse the 13 products, open any of the three services, and send an enquiry that appears in the HV Tech Google Sheet. Adding a product later is JSON + image, no new page file except the generated slug route.
