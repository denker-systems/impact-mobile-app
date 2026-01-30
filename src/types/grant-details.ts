import { Publisher, GrantWithMetadata } from './swedish-grants';

export interface Stodform {
  namn: string;
}

export interface Bidragsform {
  namn: string;
  beskrivning?: string;
  stodform?: Stodform;
}

export interface Program {
  diarienummer: string;
  titel: string;
  beskrivning?: string;
  status?: string;
  startdatum?: string;
  slutdatum?: string;
  budgetBelopp?: number;
  budgetValuta?: string;
  finansiarNamn?: string;
}

export interface Forskningsamne {
  kod?: string;
  namn?: string;
  namnEng?: string;
}

export interface Hallbarhetsmal {
  nummer?: number;
  namn?: string;
  namnEng?: string;
}

export interface Nyckelord {
  namn?: string;
}

export interface Publiceringsplats {
  url?: string;
  webbadress?: string;
  namn?: string;
}

export interface GrantDetailsMetadata {
  process_steps?: any[];
  required_docs?: any[];
  eligibility_long?: string;
  contact_details?: any;
}

export interface GrantWithDetails extends GrantWithMetadata {
  publisher: Publisher;
  details?: GrantDetailsMetadata;
  gdp_last_synced_at?: string;
  opening_date?: string;
  diarienummer?: string;
  bidragsformer?: Bidragsform[];
  program?: Program[];
  forskningsamnen?: Forskningsamne[];
  hallbarhetsmal?: Hallbarhetsmal[];
  nyckelord?: Nyckelord[];
  publiceringsplatser?: Publiceringsplats[];
}
