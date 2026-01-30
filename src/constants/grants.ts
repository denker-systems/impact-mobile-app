import { FilterState } from '@/types/swedish-grants';

export const LEVEL_OPTIONS = [
  { value: 'statlig', label: 'Statlig myndighet' },
  { value: 'regional', label: 'Regional' },
  { value: 'region', label: 'Region' },
  { value: 'kommunal', label: 'Kommunal' },
  { value: 'kommun', label: 'Kommun' },
  { value: 'stiftelse', label: 'Stiftelse' },
  { value: 'forskningsfinansiär', label: 'Forskningsfinansiär' },
  { value: 'eu', label: 'EU' },
  { value: 'nordisk', label: 'Nordisk' },
  { value: 'bransch', label: 'Branschorganisation' },
  { value: 'ideell', label: 'Ideell organisation' },
  { value: 'privat', label: 'Privat' },
  { value: 'lotteri', label: 'Lotteri/Insamling' },
  { value: 'portal', label: 'Portal/Databas' },
];

export const ALL_GDP_PROVIDERS: FilterState['gdpProviders'] = [
  'formas',
  'forte',
  'vr',
  'vinnova',
  'energimyndigheten',
];

export const INITIAL_FILTER_STATE: FilterState = {
  levels: [],
  themes: [],
  publishers: [],
  showExpired: false,
  showOpen: true,
  showRecurring: true,
  hasIntelligence: false,
  hasDocuments: false,
  hasFormGuides: false,
  gdpSource: 'all',
  gdpProviders: [...ALL_GDP_PROVIDERS],
};
