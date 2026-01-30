export type GrantCategory = {
  id: string;
  name: string;
  category_type: 'theme' | 'level';
  created_at: string;
};

export type Publisher = {
  id: string;
  name: string;
  website_url?: string;
  level: string;
  grants_count?: number;
};

export type SwedishGrant = {
  id: string;
  title: string;
  description?: string;
  url: string;
  status: string;
  deadline?: string;
  amount_min?: number;
  amount_max?: number;
  currency: string;
  geography?: {
    type: 'national' | 'regional' | 'municipal';
    value?: string;
  };
  eligibility: string[];
  support_type?: string;
  themes: string[];
  last_crawled_at: string;
  created_at: string;
  publisher?: Publisher;
};

export type GrantWithMetadata = SwedishGrant & {
  details_count: number;
  documents_count: number;
  has_form_guide: boolean;
  gdp_source?: 'formas' | 'forte' | 'vr' | 'vinnova' | 'energimyndigheten';
  amount?: number;
};

export interface FilterState {
  hasIntelligence: boolean;
  hasDocuments: boolean;
  hasFormGuides: boolean;
  levels: string[];
  publishers: string[];
  themes: string[];
  showExpired: boolean;
  showOpen: boolean;
  showRecurring: boolean;
  gdpSource: 'all' | 'gdp' | 'crawler';
  gdpProviders: string[];
}
