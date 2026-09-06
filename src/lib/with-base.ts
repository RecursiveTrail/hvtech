/** Prefix site-root paths so GitHub project Pages (`/hvtech/`) resolve. */
export function withBase(path: string): string {
  if (!path) return path;
  if (/^(https?:|mailto:|tel:|data:|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL;
  if (path.startsWith(base)) return path;
  if (path.startsWith('/')) return `${base}${path.slice(1)}`;
  return `${base}${path}`;
}
