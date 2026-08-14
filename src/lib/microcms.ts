import { fallbackWorks } from '@/data/fallbackWorks';
import type { Work } from '@/types/work';

type MicroCMSList<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const useMicroCMS = Boolean(serviceDomain && apiKey);

function normalizeWork(raw: Partial<Work> & Record<string, unknown>): Work {
  return {
    id: String(raw.id ?? raw.slug ?? ''),
    title: String(raw.title ?? ''),
    slug: String(raw.slug ?? raw.id ?? ''),
    summary: String(raw.summary ?? ''),
    categories: Array.isArray(raw.categories) ? raw.categories.map(String) : [],
    cover: raw.cover as Work['cover'],
    coverAlt: String(raw.coverAlt ?? raw.title ?? ''),
    role: Array.isArray(raw.role) ? raw.role.map(String) : [],
    year: String(raw.year ?? ''),
    client: raw.client ? String(raw.client) : undefined,
    challenge: String(raw.challenge ?? ''),
    approach: String(raw.approach ?? ''),
    result: String(raw.result ?? ''),
    technologies: Array.isArray(raw.technologies) ? raw.technologies.map(String) : [],
    featured: Boolean(raw.featured),
    displayOrder: Number(raw.displayOrder ?? 999),
    visual: raw.visual === 'dashboard' || raw.visual === 'brand' ? raw.visual : 'corporate',
    seoTitle: raw.seoTitle ? String(raw.seoTitle) : undefined,
    seoDescription: raw.seoDescription ? String(raw.seoDescription) : undefined,
    publishedAt: raw.publishedAt ? String(raw.publishedAt) : undefined,
  };
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`https://${serviceDomain}.microcms.io/api/v1/${path}`, {
    headers: { 'X-MICROCMS-API-KEY': apiKey },
  });

  if (!response.ok) {
    throw new Error(`microCMS request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getWorks(options: { featuredOnly?: boolean; limit?: number } = {}): Promise<Work[]> {
  if (!useMicroCMS) {
    return fallbackWorks
      .filter((work) => !options.featuredOnly || work.featured)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .slice(0, options.limit);
  }

  const params = new URLSearchParams({
    orders: 'displayOrder,-publishedAt',
    limit: String(options.limit ?? 100),
  });
  if (options.featuredOnly) params.set('filters', 'featured[equals]true');

  const data = await request<MicroCMSList<Partial<Work> & Record<string, unknown>>>(`works?${params}`);
  return data.contents.map(normalizeWork);
}

export async function getWorkBySlug(slug: string): Promise<Work | undefined> {
  if (!useMicroCMS) return fallbackWorks.find((work) => work.slug === slug);

  const params = new URLSearchParams({ filters: `slug[equals]${slug}`, limit: '1' });
  const data = await request<MicroCMSList<Partial<Work> & Record<string, unknown>>>(`works?${params}`);
  return data.contents[0] ? normalizeWork(data.contents[0]) : undefined;
}

export function isMicroCMSEnabled(): boolean {
  return useMicroCMS;
}
