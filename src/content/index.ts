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
