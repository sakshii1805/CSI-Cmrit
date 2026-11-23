const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (v: string): boolean => UUID_RE.test(v);

/** Match a row by uuid `id`, or by `slug` when the value is not a uuid. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const matchIdOrSlug = (query: any, idOrSlug: string): any =>
  isUuid(idOrSlug) ? query.eq('id', idOrSlug) : query.eq('slug', idOrSlug);

export const notifyContentUpdated = (type: string) => {
  try {
    window.dispatchEvent(new CustomEvent('csi_content_updated', { detail: { type } }));
  } catch { /* ignore */ }
};

export const slugify = (title: string, prefix: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `${prefix}-${Date.now()}`;

/** Unique slug so two posts with the same title don't collide on the UNIQUE(slug) column. */
export const uniqueSlug = (base: string): string => `${base}-${Date.now().toString(36)}`;
