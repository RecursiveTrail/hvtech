import siteData from './site.json';
import heroData from './hero.json';
import aboutData from './about.json';
import homeData from './home.json';
import projectsData from './projects.json';
import clientsData from './clients.json';
import reviewsData from './reviews.json';
import contactData from './contact.json';
import productsData from './products.json';
import servicesData from './services.json';
import formData from './form.json';

export type SiteContent = typeof siteData;
export type HeroContent = typeof heroData;
export type AboutContent = typeof aboutData;
export type HomeContent = typeof homeData;
export type ProjectsContent = typeof projectsData;
export type ClientsContent = typeof clientsData;
export type ReviewsContent = typeof reviewsData;
export type ContactContent = typeof contactData;
export type ProductsContent = typeof productsData;
export type Product = ProductsContent['items'][number];
export type Service = (typeof servicesData)[number];
export type FormContent = typeof formData;

export const site: SiteContent = siteData;
export const hero: HeroContent = heroData;
export const about: AboutContent = aboutData;
export const home: HomeContent = homeData;
export const projects: ProjectsContent = projectsData;
export const clients: ClientsContent = clientsData;
export const reviews: ReviewsContent = reviewsData;
export const contact: ContactContent = contactData;
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
    { value: 'general', label: form.generalInterestLabel },
  ];
}
