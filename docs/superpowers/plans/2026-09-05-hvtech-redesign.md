# HV Technologies Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static Astro rebuild of hvtech.co with Industrial Navy styling, a JSON-driven catalog, three service pages, and a RecursiveTrail-style Google Form contact flow.

**Architecture:** Content lives in `src/content/*.json` and is typed in `src/content/index.ts`. Astro generates `/`, `/products`, `/products/[slug]`, three service routes, `/about-us`, and `/contact-us` at build time. The contact form POSTs to Google Forms through a hidden iframe when `form.connected` is true; otherwise submit is blocked with a call/email message.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4 (`@tailwindcss/vite`), `@astrojs/sitemap`, `@astrojs/check`. Node `>=22.12.0`. No React islands.

**Spec:** `docs/superpowers/specs/2026-09-05-hvtech-redesign-design.md`

## Global Constraints

- Node `>=22.12.0`. Astro 7 + Tailwind 4 + TypeScript, same dependency set as RecursiveTrail.
- Static output only. No CMS, no server runtime, no second form backend.
- Visual: ink `#0f172a`, accent `#2563eb`, hover `#1d4ed8`, paper `#f8fafc`, mute `#475569`, Inter only, `rounded-sm`.
- Contact form action is `https://docs.google.com/forms/d/e/1FAIpQLSfMZI1JYF9MdcAHMdlkNm9HkooXY8KmnBjYyZ7cBBjMxQ7uqQ/formResponse`. `form.connected` is `true`. Do not POST to RecursiveTrail’s form.
- Do not show “Pride in Numbers” 0+ counters.
- Do not keep “Developed by mind2machine Softwares Pvt Ltd”.
- Clean typos in copied copy; keep meaning.
- HVAC Divider (`slug: "hvac-divider"`) has `image: ""` — render a navy placeholder, never a broken `<img>`.
- WhatsApp: `https://wa.me/917398651879`.
- Routes must match the spec table exactly. No `/services` index.

---

## File map

Create (unless noted):

- `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `.vscode/extensions.json`
- `src/styles/global.css`
- `src/content/site.json`, `src/content/services.json`, `src/content/form.json`, `src/content/index.ts`
- Modify: `src/content/products.json` (already exists — do not change field names)
- `scripts/validate-content.mjs`
- `src/layouts/BaseLayout.astro`
- `src/components/Header.astro`, `Footer.astro`, `Logo.astro`, `WhatsApp.astro`
- `src/components/ui/Section.astro`
- `src/components/ProductCard.astro`, `ServiceCard.astro`, `ContactForm.astro`, `ServicePage.astro`
- `src/components/sections/Hero.astro`, `FeaturedProducts.astro`, `Projects.astro`, `ServicesTeaser.astro`, `AboutTeaser.astro`, `Clients.astro`, `Reviews.astro`, `CtaBand.astro`
- `src/pages/index.astro`, `products/index.astro`, `products/[slug].astro`, `designing-fabrications.astro`, `repairing-maintenance.astro`, `onsite-testing.astro`, `about-us.astro`, `contact-us.astro`
- `public/` brand, hero, project, client, product images
- `public/robots.txt`, `public/CNAME`
- `.github/workflows/deploy.yml`

---

### Task 1: Scaffold the Astro app

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.vscode/extensions.json`
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro` (temporary stub)
- Create: `src/content/site.json` (minimal seo stub so BaseLayout compiles)
- Create: `src/content/index.ts` (minimal export)
- Test: `npm run check` and `npm run build`

**Interfaces:**
- Consumes: nothing
- Produces: `site.seo.title`, `site.seo.description`; `BaseLayout` props `{ title?: string; description?: string }`

- [ ] **Step 1: Write package.json, Astro config, tsconfig**

`package.json`:

```json
{
  "name": "hvtech",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "preview": "astro preview",
    "validate": "node --test scripts/validate-content.mjs",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.10",
    "@astrojs/sitemap": "^3.7.3",
    "@tailwindcss/vite": "^4.3.3",
    "astro": "^7.1.6",
    "tailwindcss": "^4.3.3",
    "typescript": "^6.0.3"
  }
}
```

`astro.config.mjs`:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hvtech.co',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`.vscode/extensions.json`:

```json
{
  "recommendations": ["astro-build.astro-vscode"]
}
```

- [ ] **Step 2: Write temporary content stub and global CSS**

`src/content/site.json` (replace entirely in Task 2):

```json
{
  "seo": {
    "title": "HV Technologies — High-Voltage Test Systems",
    "description": "High-voltage electrical and energy solutions for industrial testing."
  }
}
```

`src/content/index.ts` (expand in Task 2):

```ts
import siteData from './site.json';

export type SiteContent = typeof siteData;
export const site: SiteContent = siteData;
```

`src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-ink: #0f172a;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-paper: #f8fafc;
  --color-mute: #475569;
  --color-line: #e2e8f0;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-paper text-ink font-sans antialiased;
  }

  :focus-visible {
    @apply outline-2 outline-offset-2 outline-accent;
  }
}
```

`src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import { site } from '../content';

interface Props {
  title?: string;
  description?: string;
}

const { title = site.seo.title, description = site.seo.description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
    <slot />
  </body>
</html>
```

`src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <main id="main">
    <h1>HV Technologies</h1>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Install and verify the stub builds**

Run:

```bash
npm install
npm run check
npm run build
```

Expected: `check` exits 0. `dist/index.html` exists and contains `HV Technologies`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .vscode/extensions.json src/styles/global.css src/layouts/BaseLayout.astro src/pages/index.astro src/content/site.json src/content/index.ts
git commit -m "chore: scaffold Astro 7 and Tailwind 4 app"
```

---

### Task 2: Content JSON and validator

**Files:**
- Create: `scripts/validate-content.mjs`
- Create: `src/content/services.json`
- Create: `src/content/form.json`
- Modify: `src/content/site.json` (full content)
- Modify: `src/content/index.ts`
- Keep: `src/content/products.json` field names exactly as they are now
- Test: `npm run validate`

**Interfaces:**
- Consumes: `products.json` `{ categories: {id,label}[], items: Product[] }`
- Produces:
  - `export const site`, `products`, `services`, `form`
  - `export type Product`, `Service`, `FormContent`
  - `getFeaturedProducts(): Product[]`
  - `getProduct(slug: string): Product | undefined`
  - `getService(slug: string): Service | undefined`
  - `getInterestOptions(): { value: string; label: string }[]`

- [ ] **Step 1: Write the failing validator**

`scripts/validate-content.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const load = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf8'));

test('products.json has 13 items and required fields', () => {
  const data = load('src/content/products.json');
  assert.equal(data.items.length, 13);
  const slugs = new Set();
  for (const item of data.items) {
    for (const key of ['slug', 'name', 'category', 'featured', 'summary', 'description', 'image', 'standards', 'specs']) {
      assert.ok(key in item, `missing ${key} on ${item.slug}`);
    }
    assert.equal(slugs.has(item.slug), false, `duplicate slug ${item.slug}`);
    slugs.add(item.slug);
  }
  const featured = data.items.filter((item) => item.featured);
  assert.equal(featured.length, 4);
  const hvac = data.items.find((item) => item.slug === 'hvac-divider');
  assert.equal(hvac.image, '');
});

test('services.json has the three locked routes', () => {
  const services = load('src/content/services.json');
  assert.equal(services.length, 3);
  assert.deepEqual(services.map((s) => s.slug), [
    'designing-fabrications',
    'repairing-maintenance',
    'onsite-testing',
  ]);
  for (const service of services) {
    assert.ok(service.href.startsWith('/'));
    assert.ok(service.groups.length >= 4);
    assert.ok(service.cta.label);
  }
});

test('form.json is connected to the HV Tech Google Form', () => {
  const form = load('src/content/form.json');
  assert.equal(form.connected, true);
  assert.equal(
    form.action,
    'https://docs.google.com/forms/d/e/1FAIpQLSfMZI1JYF9MdcAHMdlkNm9HkooXY8KmnBjYyZ7cBBjMxQ7uqQ/formResponse',
  );
  assert.equal(form.method, 'POST');
  assert.equal(form.minSubmitMs, 2500);
  assert.equal(form.honeypotName, 'website_url');
  assert.equal(form.fields.name.entry, 'entry.750210231');
  assert.equal(form.fields.phone.entry, 'entry.2106024227');
  assert.equal(form.fields.email.entry, 'entry.846203511');
  assert.equal(form.fields.message.entry, 'entry.1889579180');
  assert.equal(form.fields.interest.entry, '');
  assert.equal(form.interestPrefix, true);
});

test('site.json has projects, clients, reviews, and no vanity stats', () => {
  const site = load('src/content/site.json');
  assert.equal(site.projects.items.length, 3);
  assert.equal(site.clients.length, 9);
  assert.equal(site.reviews.length, 5);
  assert.equal('stats' in site, false);
  const names = site.reviews.map((r) => r.name);
  assert.equal(names.filter((n) => n === 'Saurabh Agrahari').length, 1);
});
```

- [ ] **Step 2: Run validator and confirm it fails**

Run: `node --test scripts/validate-content.mjs`

Expected: FAIL on missing `services.json` / incomplete `site.json` / missing `form.json`.

- [ ] **Step 3: Write the content files**

Use the repo file `src/content/form.json` as-is (`connected: true`, HV Tech `formResponse` URL, entry IDs above). Do not overwrite it with empty placeholders.

`src/content/services.json`:

```json
[
  {
    "slug": "designing-fabrications",
    "href": "/designing-fabrications",
    "eyebrow": "Service",
    "name": "Designing & Fabrications",
    "tagline": "Custom Engineering. Precision Fabrication. End-to-End Solutions.",
    "description": "At HV Tech, we specialize in turning concepts into real-world engineered solutions through expert designing and fabrication services. Whether you are starting from scratch or optimizing an existing product, our team ensures efficiency, innovation, and durability in every stage.",
    "groups": [
      {
        "title": "CAD Designing",
        "items": ["2D/3D mechanical drawings", "Electrical and circuit design layouts", "Product prototyping"]
      },
      {
        "title": "Fabrication Services",
        "items": ["Sheet metal cutting, bending, welding", "Custom enclosures and panel boxes", "Structural frameworks"]
      },
      {
        "title": "Industrial Customization",
        "items": ["Machine parts modification", "Custom-built control panels", "Retrofitting solutions"]
      },
      {
        "title": "Assembly & Installation",
        "items": ["On-site support for fabrication projects", "Modular system assembly", "Testing & quality assurance"]
      }
    ],
    "why": [
      "Experienced Design Engineers",
      "Quality-First Fabrication Techniques",
      "Quick Turnaround Time",
      "Tailor-Made Industrial Solutions",
      "On-Site Support Available"
    ],
    "cta": {
      "label": "Get a Quote Today",
      "text": "Interested in custom design or fabrication for your business?"
    }
  },
  {
    "slug": "repairing-maintenance",
    "href": "/repairing-maintenance",
    "eyebrow": "Service",
    "name": "Repair & Maintenance",
    "tagline": "Reliable Repairs. Preventive Maintenance. Industrial Support.",
    "description": "HV Tech offers comprehensive repair and maintenance services to keep your operations running smoothly. We help businesses reduce downtime, extend equipment life, and ensure safety through responsive, expert service.",
    "groups": [
      {
        "title": "Industrial Equipment Repair",
        "items": ["Mechanical part replacements", "Motor rewinding and servicing", "Pump, valve, and gearbox repairs"]
      },
      {
        "title": "Electrical Maintenance",
        "items": ["Wiring inspections and repairs", "Panel maintenance and troubleshooting", "Circuit breaker testing and replacement"]
      },
      {
        "title": "Control System Services",
        "items": ["PLC troubleshooting and reprogramming", "HMI screen repairs", "Sensor and actuator checks"]
      },
      {
        "title": "Preventive & AMC Support",
        "items": ["Scheduled equipment health checks", "Annual Maintenance Contracts (AMC)", "Documentation & compliance reports"]
      }
    ],
    "why": [
      "Quick response time",
      "Trained technical team",
      "Genuine spare parts",
      "Custom AMC packages",
      "On-site and remote support"
    ],
    "cta": {
      "label": "Request a Service",
      "text": "Need urgent repairs or regular maintenance for your equipment? Let’s get started."
    }
  },
  {
    "slug": "onsite-testing",
    "href": "/onsite-testing",
    "eyebrow": "Service",
    "name": "On-Site Testing",
    "tagline": "Precision Testing. Field Diagnostics. Real-Time Results.",
    "description": "HV Tech offers expert on-site testing services to help businesses verify the safety, functionality, and efficiency of their industrial systems and electrical equipment. Our field engineers use certified tools and procedures to provide reliable, real-time diagnostics.",
    "groups": [
      {
        "title": "Electrical Safety Testing",
        "items": ["Insulation resistance testing", "Earth continuity testing", "High-voltage (HiPot) testing"]
      },
      {
        "title": "Load & Performance Testing",
        "items": ["Motor load test", "Panel load balancing", "Equipment performance analysis"]
      },
      {
        "title": "Thermal & Vibration Analysis",
        "items": ["Thermal imaging of switchboards and connections", "Vibration checks on rotating machinery", "Preventive diagnostics"]
      },
      {
        "title": "Automation System Testing",
        "items": ["PLC input/output checks", "Sensor-actuator response tests", "Communication protocol verification"]
      }
    ],
    "why": [
      "Certified testing equipment",
      "On-site report generation",
      "Experienced field technicians",
      "Compliance with industrial standards",
      "Minimal downtime and disruption"
    ],
    "cta": {
      "label": "Book a Site Visit",
      "text": "Need professional on-site testing? Schedule a visit today to ensure your systems are running safely and efficiently."
    }
  }
]
```

`src/content/site.json` must include (no `stats` key):

```json
{
  "brand": {
    "name": "HV Technologies",
    "shortName": "HV TECH",
    "logo": "/hvcirclelogo.jpg"
  },
  "seo": {
    "title": "HV Technologies — High-Voltage Test Systems",
    "description": "We deliver innovative high-voltage electrical and energy solutions that empower businesses to grow, scale, and achieve maximum efficiency in the modern industrial landscape."
  },
  "nav": [
    { "label": "Home", "href": "/" },
    { "label": "Products", "href": "/products" },
    { "label": "About Us", "href": "/about-us" },
    { "label": "Contact", "href": "/contact-us" }
  ],
  "hero": {
    "image": "/insulator4.png",
    "imageAlt": "High-voltage insulator",
    "eyebrow": "High-Voltage Test Systems",
    "headline": "Powering the Future of Industrial Solutions",
    "subhead": "We deliver innovative high-voltage electrical and energy solutions that empower businesses to grow, scale, and achieve maximum efficiency in the modern industrial landscape.",
    "cta": { "label": "View Equipment", "href": "/products" },
    "secondaryCta": { "label": "Get a Quote", "href": "/contact-us" }
  },
  "about": {
    "eyebrow": "About Us",
    "title": "Engineers for high-voltage testing",
    "photo": "/emp-work.jpg",
    "photoAlt": "HV Tech team at work",
    "paragraphs": [
      "We are a team of passionate engineers and innovators dedicated to developing advanced testing systems for transformers, power cables, switchgear, and the solar industry. With years of experience, we specialize in the development of high-voltage testing equipment used for simulating lightning and switching impulses.",
      "Our solutions are trusted by industry professionals, research institutions, and training centers globally. We are committed to continuous innovation, safety, and reliability, ensuring our clients get the best performance and support."
    ]
  },
  "projects": {
    "eyebrow": "Portfolio",
    "title": "Delivered Projects",
    "items": [
      {
        "name": "500kVp/25KJ Impulse Voltage Generator Test System",
        "description": "The purpose of this project was to design and deliver a customized impulse generator to meet specific technical and operational requirements for testing power cable up to 66kV class and lightning arrester.",
        "image": "/projects/chopping-cable.jpg"
      },
      {
        "name": "RF Shielded Room",
        "description": "An RF shielded room, also known as a Faraday cage, is a specially constructed enclosure designed to block or reduce electromagnetic and radio frequency (RF) signals from entering or leaving the room. It is commonly used in environments where sensitive electronic testing or communications occur, and isolation from external RF interference is critical.",
        "image": "/projects/rf-shielding.jpg"
      },
      {
        "name": "300kVp/7.5KJ Impulse Voltage Generator Test System",
        "description": "The purpose of this project was to design and deliver a customized impulse generator to meet specific technical and operational requirements for testing power cable up to 33kV.",
        "image": "/projects/imsystem.jpg"
      }
    ]
  },
  "clients": [
    { "name": "Svasca Industries", "image": "/clients/svasca.jpg" },
    { "name": "Client 4", "image": "/clients/client-4.png" },
    { "name": "Client 5", "image": "/clients/client-5.png" },
    { "name": "Client 6", "image": "/clients/client-6.png" },
    { "name": "Client 7", "image": "/clients/client-7.png" },
    { "name": "Amit Test and Calibration Centre", "image": "/clients/amit-lab.png" },
    { "name": "Client 9", "image": "/clients/client-9.png" },
    { "name": "StartLab", "image": "/clients/startlab.jpg" },
    { "name": "IMP", "image": "/clients/imp.png" }
  ],
  "reviews": [
    { "name": "Saurabh Agrahari", "quote": "HV Tech provided outstanding service and high-quality products. Highly recommend!", "stars": 5, "image": "/clients/client-7.png" },
    { "name": "K.P Singh", "quote": "Great experience! The team was very professional and responsive.", "stars": 4, "image": "/clients/client-4.png" },
    { "name": "Sudhir Poswal", "quote": "Excellent products and support. Their HV Test Systems are top-notch!", "stars": 5, "image": "/clients/svasca.jpg" },
    { "name": "Rakesh Gupta", "quote": "Good experience overall. The team helped us choose the right solutions.", "stars": 4, "image": "/clients/client-6.png" },
    { "name": "Pradep Jain", "quote": "Good experience overall. The team helped us choose the right solutions.", "stars": 4, "image": "/clients/startlab.jpg" }
  ],
  "contact": {
    "person": { "name": "Vinod Maurya", "initials": "AJ", "phone": "+91 7398 651 879", "phoneHref": "tel:+917398651879" },
    "image": "/Chat_hanshake.png",
    "emails": ["info@hvtech.co", "hvteknologies@gmail.com"],
    "phones": ["+91 9415679524", "+91 7398651879"],
    "whatsapp": "https://wa.me/917398651879",
    "addresses": [
      "V 22 Pawala Khasropur Jahajgarh Daulatabad, Gurgaon 122006",
      "Khamaria Belhat Koraon Prayagraj, U.P. 212306"
    ],
    "mapEmbed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114243.12795659414!2d82.1221899!3d25.0276793!2m3!1f0!2f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398567c79cc80489%3A0x6c428a238f231bb5!2sHV%20TECHNOLOGIES!5e0!3m2!1sen!2sin!4v1706893456789!5m2!1sen!2sin",
    "successTitle": "Message received",
    "successMessage": "Thanks — we will get back to you as soon as possible.",
    "submitLabel": "Send Message",
    "submittingLabel": "Sending…",
    "disconnectedMessage": "Form is not connected yet. Please call or email."
  },
  "footer": {
    "blurb": "We deliver innovative electrical and energy solutions that empower businesses to grow, scale, and achieve efficiency in the modern industrial landscape.",
    "copyright": "© 2026 HV Technologies. All rights reserved."
  }
}
```

`src/content/index.ts`:

```ts
import siteData from './site.json';
import productsData from './products.json';
import servicesData from './services.json';
import formData from './form.json';

export type SiteContent = typeof siteData;
export type ProductsContent = typeof productsData;
export type Product = ProductsContent['items'][number];
export type Service = (typeof servicesData)[number];
export type FormContent = typeof formData;

export const site: SiteContent = siteData;
export const products: ProductsContent = productsData;
export const services: Service[] = servicesData;
export const form: FormContent = formData;

export function getFeaturedProducts(): Product[] {
  return products.items.filter((item) => item.featured);
}

export function getProduct(slug: string): Product | undefined {
  return products.items.find((item) => item.slug === slug);
}

export function getService(slug: string): Service | undefined {
  return services.find((item) => item.slug === slug);
}

export function getInterestOptions(): { value: string; label: string }[] {
  return [
    ...products.items.map((item) => ({ value: item.slug, label: item.name })),
    ...services.map((item) => ({ value: item.slug, label: item.name })),
    { value: 'general', label: 'General enquiry' },
  ];
}
```

Do not shorten `services.json`. Use the JSON block above as the file contents.

- [ ] **Step 4: Run validator and check**

Run:

```bash
npm run validate
npm run check
```

Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-content.mjs src/content
git commit -m "feat: add site, services, and form content with a validator"
```

---

### Task 3: Copy live-site assets

**Files:**
- Create: `public/hvcirclelogo.jpg`, `public/hvtechlogo.jpg`, `public/favicon.ico`
- Create: `public/insulator4.png`, `public/emp_work2.png`, `public/insulator6.jpg`, `public/emp-work.jpg`, `public/Chat_hanshake.png`
- Create: `public/projects/chopping-cable.jpg`, `public/projects/rf-shielding.jpg`, `public/projects/imsystem.jpg`
- Create: `public/clients/*.png|jpg` using the slugs in `site.json`
- Keep: `public/products/*` already extracted
- Test: `test -s` on each file; HVAC product image stays empty

**Interfaces:**
- Consumes: `site.json` image paths
- Produces: files at those exact paths

- [ ] **Step 1: Download brand, hero, project, and client files**

```bash
mkdir -p public/projects public/clients
curl -fsSL "https://hvtech.co/hvcirclelogo.jpg" -o public/hvcirclelogo.jpg
curl -fsSL "https://hvtech.co/hvtechlogo.jpg" -o public/hvtechlogo.jpg
curl -fsSL "https://hvtech.co/favicon.ico" -o public/favicon.ico
curl -fsSL "https://hvtech.co/insulator4.png" -o public/insulator4.png
curl -fsSL "https://hvtech.co/emp_work2.png" -o public/emp_work2.png
curl -fsSL "https://hvtech.co/insulator6.jpg" -o public/insulator6.jpg
curl -fsSL "https://hvtech.co/emp-work.jpg" -o public/emp-work.jpg
curl -fsSL "https://hvtech.co/Chat_hanshake.png" -o public/Chat_hanshake.png
curl -fsSL "https://hvtech.co/chopping-cable.jpg" -o public/projects/chopping-cable.jpg
curl -fsSL "https://hvtech.co/rf_shielding.jpg" -o public/projects/rf-shielding.jpg
curl -fsSL "https://hvtech.co/imsystem.jpg" -o public/projects/imsystem.jpg
curl -fsSL --globoff "https://hvtech.co/svasca-industries.jpg" -o public/clients/svasca.jpg
curl -fsSL --globoff "https://hvtech.co/logo (1).png" -o public/clients/client-4.png
curl -fsSL "https://hvtech.co/logo.png" -o public/clients/client-5.png
curl -fsSL "https://hvtech.co/fhgtnjghjhgmh.png" -o public/clients/client-6.png
curl -fsSL --globoff "https://hvtech.co/logo (2).png" -o public/clients/client-7.png
curl -fsSL "https://hvtech.co/Amit_Test_and_Calibration_Centre_-_labgo.png" -o public/clients/amit-lab.png
curl -fsSL "https://hvtech.co/images.png" -o public/clients/client-9.png
curl -fsSL "https://hvtech.co/startLabClient.jpg" -o public/clients/startlab.jpg
curl -fsSL "https://hvtech.co/IMP_Logo.png" -o public/clients/imp.png
```

If `logo (1).png` or `logo (2).png` 404, fetch `https://hvtech.co/logo%20(1).png` and `https://hvtech.co/logo%20(2).png`.

- [ ] **Step 2: Verify files are non-empty and HVAC has no image file requirement**

```bash
for f in public/hvcirclelogo.jpg public/favicon.ico public/insulator4.png public/emp-work.jpg public/projects/chopping-cable.jpg public/clients/svasca.jpg public/products/pd-calibrator.webp; do
  test -s "$f" || { echo "missing $f"; exit 1; }
done
test ! -e public/products/hvac-divider.webp
test ! -e public/products/hvac-divider.jpg
```

Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add public
git commit -m "feat: copy HV Tech images into public/"
```

---

### Task 4: Header, footer, logo, WhatsApp

**Files:**
- Create: `src/components/Logo.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/WhatsApp.astro`
- Modify: `src/layouts/BaseLayout.astro` to slot header/footer/whatsapp from pages, or keep pages wrapping them
- Modify: `src/pages/index.astro` to include chrome
- Test: `npm run check` and grep `dist/index.html`

**Interfaces:**
- Consumes: `site.brand`, `site.nav`, `site.footer`, `site.contact`, `services`
- Produces: Services dropdown from `services` (`name` + `href`), quote button → `/contact-us`

- [ ] **Step 1: Write Logo, Header, Footer, WhatsApp**

`Logo.astro`: circular `site.brand.logo` + `site.brand.name` (desktop) / `site.brand.shortName` (mobile), link `/`.

`Header.astro`:

- Fixed dark `bg-ink text-white` bar, `border-b-4 border-accent`.
- Desktop links: `site.nav` plus a Services `<details>` or button+panel listing `services`.
- Get a Quote button → `/contact-us`, `bg-accent hover:bg-accent-hover`.
- Mobile hamburger toggles `#mobile-nav` via a 10-line script (no React).

`Footer.astro`: four columns — About blurb, Contact (emails, phones, both addresses), Quick Links (About, each service, Products, Contact), empty Follow Us omitted (current social hrefs are `#`). Copyright from `site.footer.copyright` only.

`WhatsApp.astro`: fixed bottom-right `bg-accent` chip, `href={site.contact.whatsapp}`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label="Chat on WhatsApp"`.

- [ ] **Step 2: Wire chrome into the home stub and build**

`src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import WhatsApp from '../components/WhatsApp.astro';
---
<BaseLayout>
  <Header />
  <main id="main">
    <h1 class="sr-only">HV Technologies</h1>
  </main>
  <Footer />
  <WhatsApp />
</BaseLayout>
```

- [ ] **Step 3: Verify**

```bash
npm run check
npm run build
rg -n "Get a Quote|On-Site Testing|wa.me/917398651879|mind2machine" dist/index.html
```

Expected: first three strings present. `mind2machine` absent.

- [ ] **Step 4: Commit**

```bash
git add src/components/Logo.astro src/components/Header.astro src/components/Footer.astro src/components/WhatsApp.astro src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add header, footer, and WhatsApp chrome"
```

---

### Task 5: Homepage sections

**Files:**
- Create: `src/components/ui/Section.astro`
- Create: `src/components/ProductCard.astro`
- Create: `src/components/ServiceCard.astro`
- Create: `src/components/sections/Hero.astro`
- Create: `src/components/sections/FeaturedProducts.astro`
- Create: `src/components/sections/Projects.astro`
- Create: `src/components/sections/ServicesTeaser.astro`
- Create: `src/components/sections/AboutTeaser.astro`
- Create: `src/components/sections/Clients.astro`
- Create: `src/components/sections/Reviews.astro`
- Create: `src/components/sections/CtaBand.astro`
- Modify: `src/pages/index.astro`
- Test: `npm run build` + grep

**Interfaces:**
- Consumes: `site.hero`, `getFeaturedProducts()`, `site.projects`, `services`, `site.about`, `site.clients`, `site.reviews`
- Produces: ProductCard props `{ product: Product; headingLevel?: 2 | 3 }` with image-or-placeholder; ServiceCard props `{ service: Service }`

`Section.astro` props: `{ id?: string; eyebrow: string; title: string; tone?: 'light' | 'dark' }`.

`ProductCard.astro`: if `product.image` is empty, render `<div class="bg-ink text-white ...">{product.name}</div>` instead of `<img>`. Links: title → `/products/${product.slug}`, Enquire → `/contact-us?interest=${product.slug}`.

Hero: full-viewport `bg-ink`, `site.hero.image` cover, 50% ink overlay, eyebrow, `h1` from `site.hero.headline` with “Industrial Solutions” in `text-accent`, two buttons. No carousel, no extra slides.

Do not add a stats section.

- [ ] **Step 1: Write Section, cards, and every home section file**

- [ ] **Step 2: Compose `src/pages/index.astro` in this order**

Header → Hero → FeaturedProducts → Projects → ServicesTeaser → AboutTeaser → Clients → Reviews → CtaBand → Footer → WhatsApp.

- [ ] **Step 3: Verify**

```bash
npm run check
npm run build
rg -n "Powering the Future|500kVp|Pride in Numbers|Saurabh Agrahari" dist/index.html
```

Expected: headline and 500kVp present. `Pride in Numbers` absent. Saurabh appears once.

- [ ] **Step 4: Commit**

```bash
git add src/components src/pages/index.astro
git commit -m "feat: build the Industrial Navy homepage"
```

---

### Task 6: Products catalog and detail pages

**Files:**
- Create: `src/pages/products/index.astro`
- Create: `src/pages/products/[slug].astro`
- Test: `npm run build` and list `dist/products`

**Interfaces:**
- Consumes: `products.categories`, `products.items`, `getProduct(slug)`
- Produces: `getStaticPaths` returning `{ params: { slug } }[]` for every product

- [ ] **Step 1: Write the catalog page**

`/products`: eyebrow “Catalog”, title “Our Products”. Filter chips: All + each category id. A 15-line script shows/hides `[data-category]` cards. Include HVAC in the grid with placeholder (no `<img>`).

- [ ] **Step 2: Write the detail page**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import WhatsApp from '../../components/WhatsApp.astro';
import { getProduct, products } from '../../content';

export function getStaticPaths() {
  return products.items.map((item) => ({ params: { slug: item.slug } }));
}

const product = getProduct(Astro.params.slug!);
if (!product) {
  throw new Error(`Unknown product ${Astro.params.slug}`);
}
---
<BaseLayout title={`${product.name} — HV Technologies`} description={product.summary}>
  <Header />
  <main id="main" class="bg-paper">
    <!-- back link, image or placeholder, description, standards, specs table, Enquire -->
  </main>
  <Footer />
  <WhatsApp />
</BaseLayout>
```

Enquire href: `/contact-us?interest=${product.slug}`.

- [ ] **Step 3: Verify**

```bash
npm run check
npm run build
ls dist/products | rg "pd-calibrator|hvac-divider|impulse-voltage-generator"
rg -n "<img" dist/products/hvac-divider/index.html || true
```

Expected: those three directories exist. `hvac-divider/index.html` has no product `<img>` (placeholder div only). 13 product folders total.

- [ ] **Step 4: Commit**

```bash
git add src/pages/products
git commit -m "feat: add JSON-driven product catalog and detail pages"
```

---

### Task 7: Three service pages

**Files:**
- Create: `src/components/ServicePage.astro`
- Create: `src/pages/designing-fabrications.astro`
- Create: `src/pages/repairing-maintenance.astro`
- Create: `src/pages/onsite-testing.astro`
- Test: `npm run build` + grep CTAs

**Interfaces:**
- Consumes: `getService(slug)` / `services`
- Produces: `ServicePage` props `{ service: Service }`

- [ ] **Step 1: Write ServicePage**

Eyebrow, `h1`, tagline, description, four group cards, why list, CTA band linking to `/contact-us?interest=${service.slug}` with `service.cta.label`.

- [ ] **Step 2: Write three thin pages**

Each page:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import WhatsApp from '../components/WhatsApp.astro';
import ServicePage from '../components/ServicePage.astro';
import { getService } from '../content';

const service = getService('onsite-testing')!;
---
<BaseLayout title={`${service.name} — HV Technologies`} description={service.tagline}>
  <Header />
  <ServicePage service={service} />
  <Footer />
  <WhatsApp />
</BaseLayout>
```

Use the matching slug on each file: `designing-fabrications`, `repairing-maintenance`, `onsite-testing`.

- [ ] **Step 3: Verify**

```bash
npm run build
rg -n "Book a Site Visit|Request a Service|Get a Quote Today" dist/onsite-testing/index.html dist/repairing-maintenance/index.html dist/designing-fabrications/index.html
```

Expected: each CTA appears on its own page.

- [ ] **Step 4: Commit**

```bash
git add src/components/ServicePage.astro src/pages/designing-fabrications.astro src/pages/repairing-maintenance.astro src/pages/onsite-testing.astro
git commit -m "feat: add the three service pages"
```

---

### Task 8: About page

**Files:**
- Create: `src/pages/about-us.astro`
- Test: `npm run build`

**Interfaces:**
- Consumes: `site.about`
- Produces: `/about-us` with both paragraphs and `emp-work.jpg`

- [ ] **Step 1: Write `/about-us`**

Use `site.about` photo + paragraphs. CTA → `/contact-us`. No raw `transformar` / `swith gear` strings.

- [ ] **Step 2: Verify**

```bash
npm run build
rg -n "transformers|switchgear|transformar|swith gear" dist/about-us/index.html
```

Expected: `transformers` and `switchgear` present. `transformar` and `swith gear` absent.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about-us.astro
git commit -m "feat: add the about page"
```

---

### Task 9: Contact page and Google Form

**Files:**
- Create: `src/components/ContactForm.astro`
- Create: `src/pages/contact-us.astro`
- Test: `npm run check`, `npm run build`, and a node assert that `form.connected === false`

**Interfaces:**
- Consumes: `form`, `site.contact`, `getInterestOptions()`
- Produces: query-param prefill `?interest=<slug>` selecting the matching `<option value>`

- [ ] **Step 1: Write ContactForm.astro**

Markup:

- Hidden iframe `id="enquiry-iframe"` `name="enquiry-iframe"` `class="hidden"`.
- Success box `id="enquiry-success"` hidden by default: `site.contact.successTitle` + `successMessage`.
- Form `id="enquiry-form"` `method="POST"` `target="enquiry-iframe"` `action={form.action}` `data-min-submit-ms={form.minSubmitMs}` `data-connected={String(form.connected)}`.
- Honeypot: visually hidden input `name={form.honeypotName}` autocomplete=off tabindex=-1.
- Fields: name → `entry.750210231`, phone → `entry.2106024227`, email → `entry.846203511`, interest `<select>` (no `entry` name; not posted), message → `entry.1889579180`.
- Before allowing submit, if `form.interestPrefix` is true, set message value to `Interest: ${selectedLabel}\n\n${originalMessage}`.
- `data-error-for` nodes for each field.
- Submit button `id="enquiry-submit"` with `data-busy-label={site.contact.submittingLabel}`.

Script behavior (port RecursiveTrail, then add these rules):

1. If honeypot has a value, `preventDefault` and return.
2. Validate: name non-empty; phone matches `/^(\+91[\s-]?)?[6-9]\d{9}$/`; email is a normal address; interest selected; message non-empty.
3. If `Date.now() - startedAt < minSubmitMs`, preventDefault and show “Please take a moment before submitting.”
4. If `form.connected` is false or `form.action` is empty, preventDefault and show `site.contact.disconnectedMessage`. Do not POST.
5. Prefix Interest into the message field, then allow native submit to the iframe; on iframe `load` after a real submit, hide form and show success.
6. If connected submit does not load the iframe within 8000ms, re-enable the button and show “Could not send. Call us or try again.”
7. On load, `new URLSearchParams(location.search).get('interest')` selects the matching option when present.

- [ ] **Step 2: Write `/contact-us`**

Two columns: left image + Vinod Maurya card (`site.contact.person`); right “Get in Touch” + ContactForm. Below: “Find Us Here” iframe `src={site.contact.mapEmbed}` `title="Company Location Map"`.

Title: `Contact — HV Technologies`.

- [ ] **Step 3: Verify disconnected safety and prefill hook**

```bash
npm run validate
npm run check
npm run build
node -e "const f=require('./src/content/form.json'); if (f.connected!==true || !f.action.includes('1FAIpQLSfMZI1JYF9MdcAHMdlkNm9HkooXY8KmnBjYyZ7cBBjMxQ7uqQ')) process.exit(1)"
rg -n "enquiry-form|1FAIpQLSfMZI1JYF9MdcAHMdlkNm9HkooXY8KmnBjYyZ7cBBjMxQ7uqQ|entry.2106024227" dist/contact-us/index.html
```

Expected: validate/check/build 0. Node assert exits 0. HV Tech form action and phone entry are present. RecursiveTrail form ID `1FAIpQLSfLORp89PHbS0ZF1bHJRu17IcDLFWAuK6psVfBCmWgEWXf39Q` is absent.

- [ ] **Step 4: Commit**

```bash
git add src/components/ContactForm.astro src/pages/contact-us.astro
git commit -m "feat: add contact page wired to the HV Tech Google Form"
```

---

### Task 10: SEO, robots, deploy workflow, final pass

**Files:**
- Create: `public/robots.txt`
- Create: `public/CNAME` with contents `hvtech.co`
- Create: `.github/workflows/deploy.yml`
- Modify: `src/layouts/BaseLayout.astro` if sitemap/canonical need a tweak
- Test: `npm run validate && npm run check && npm run build` and route list

**Interfaces:**
- Consumes: `astro.config.mjs` `site: 'https://hvtech.co'`
- Produces: `dist/sitemap-index.xml`, all spec routes

- [ ] **Step 1: Write robots and CNAME**

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://hvtech.co/sitemap-index.xml
```

`public/CNAME`:

```
hvtech.co
```

- [ ] **Step 2: Write `.github/workflows/deploy.yml`**

Copy RecursiveTrail’s workflow exactly (checkout@v7, setup-node@v7 node 22, npm ci, npm run build, upload-pages-artifact path `dist`, deploy-pages@v5).

- [ ] **Step 3: Final verification**

```bash
npm run validate
npm run check
npm run build
ls dist/index.html dist/products/index.html dist/products/pd-calibrator/index.html dist/designing-fabrications/index.html dist/repairing-maintenance/index.html dist/onsite-testing/index.html dist/about-us/index.html dist/contact-us/index.html dist/robots.txt dist/CNAME
rg -n "Pride in Numbers|mind2machine|formResponse" dist || true
```

Expected: every listed file exists. The three forbidden strings are absent from `dist/` (or `formResponse` only appears if `form.connected` is later set true — it must be absent while `action` is empty).

Manual checklist before calling the task done:

- Home hero is a single image, not a carousel
- Featured row has four products
- Products filter chips work
- HVAC card has no broken image
- Each service CTA prefills interest (spot-check the href)
- Mobile nav opens and Services expands
- Contact submit with empty fields shows errors
- Contact submit while disconnected shows `Form is not connected yet. Please call or email.`

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt public/CNAME .github/workflows/deploy.yml src/layouts/BaseLayout.astro
git commit -m "feat: add sitemap, robots, and GitHub Pages deploy"
```

---

## Self-review

**Spec coverage**

| Spec requirement | Task |
|---|---|
| Hybrid IA + exact routes | 5–9 |
| Industrial Navy + Inter + cinematic hero | 1, 5 |
| `products.json` + generated `[slug]` | 2, 6 |
| Three service pages | 2, 7 |
| About page, cleaned copy | 2, 8 |
| Google Form iframe, honeypot, min 2.5s, disconnected guard | 9 |
| Prefill `?interest=` | 6, 7, 9 |
| Drop 0+ stats | 2, 5 |
| Copy images, rename clients | 3 |
| WhatsApp | 4 |
| No mind2machine credit | 4 |
| SEO + GitHub Pages | 10 |
| HVAC placeholder | 2, 6 |
| `npm run check` / `build` | every task |

**Placeholder scan:** `services.json` is fully specified in Task 2. No `"…"` remains in the plan’s content files.

**Type consistency:** `getFeaturedProducts`, `getProduct`, `getService`, `getInterestOptions` are defined in Task 2 and used with those exact names in Tasks 5–9. `form.connected` / `form.action` / `form.honeypotName` / `form.minSubmitMs` are the only form flags.
