export type WorkImage = {
  url: string;
  width?: number;
  height?: number;
};

export type Work = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  categories: string[];
  cover?: WorkImage;
  coverAlt: string;
  role: string[];
  year: string;
  client?: string;
  challenge: string;
  approach: string;
  result: string;
  technologies: string[];
  featured: boolean;
  displayOrder: number;
  visual: 'corporate' | 'dashboard' | 'brand';
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
};
