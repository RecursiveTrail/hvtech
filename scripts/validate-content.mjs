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
  assert.ok(data.page.title);
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

test('split content files have projects, clients, reviews, and no vanity stats', () => {
  const site = load('src/content/site.json');
  const projects = load('src/content/projects.json');
  const clients = load('src/content/clients.json');
  const reviews = load('src/content/reviews.json');
  const hero = load('src/content/hero.json');
  const about = load('src/content/about.json');
  const contact = load('src/content/contact.json');
  const home = load('src/content/home.json');

  assert.equal(projects.items.length, 3);
  assert.equal(clients.items.length, 9);
  assert.equal(reviews.items.length, 5);
  assert.equal('stats' in site, false);
  assert.equal('hero' in site, false);
  assert.ok(hero.headline);
  assert.ok(about.paragraphs.length >= 2);
  assert.ok(contact.person.name);
  assert.ok(home.featured.title);
  const names = reviews.items.map((r) => r.name);
  assert.equal(names.filter((n) => n === 'Saurabh Agrahari').length, 1);
});
