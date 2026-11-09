import { MESSINA_ID, MESSINA_URL, ORGANIZATION_ID, SITE_URL, buildSalonStructuredData } from './site';

export interface PageSeo {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly heroImage?: string;
  readonly breadcrumb?: string;
  readonly priority: number;
  /** Campaign landings stay out of search results and out of the sitemap. */
  readonly noindex?: boolean;
}

export const DEFAULT_IMAGE = '/images/og-luxosa.jpg';

export const PAGES: readonly PageSeo[] = [
  {
    path: '/',
    title: 'Luxosa — Maison di cura evoluta per cute e capelli',
    description:
      'Luxosa è una maison italiana di cura evoluta per cute e capelli: consulenza, metodo e percorsi personalizzati per colore, taglio, ricci e benessere della cute.',
    image: DEFAULT_IMAGE,
    heroImage: '/images/hero_lamaison_poster.webp',
    priority: 1,
  },
  {
    path: '/sedi/messina-cavour',
    title: 'Luxosa Messina — Cura dei capelli e della cute in Corso Cavour',
    description:
      'Luxosa a Messina, Corso Cavour 1: parrucchiere e cura della cute con metodo — consulenza, colore, taglio, piega e ricci. Prima Volta a €47. Orari e contatti.',
    image: '/images/og-messina-cavour.jpg',
    heroImage: '/images/messina-new.webp',
    breadcrumb: 'Messina Cavour',
    priority: 0.9,
  },
  {
    path: '/il-metodo',
    title: 'Il Metodo Luxosa — Consulenza e cura personalizzata dei capelli',
    description:
      'Ascolto, osservazione, progettazione e cura: le fasi del Metodo Luxosa per cute e capelli, dalla consulenza iniziale a un percorso costruito sulla persona.',
    image: DEFAULT_IMAGE,
    heroImage: '/images/hero_ilmetodo.webp',
    breadcrumb: 'Il Metodo',
    priority: 0.8,
  },
  {
    path: '/i-percorsi',
    title: 'I Percorsi Luxosa — BenEssere, ColorLux e Rituale Luxosa',
    description:
      'Tre percorsi di cura per cute e capelli: BenEssere per equilibrio e struttura, ColorLux per colore e luce, Rituale Luxosa per una presa in carico completa.',
    image: DEFAULT_IMAGE,
    heroImage: '/images/hero_ipercorsi.webp',
    breadcrumb: 'I Percorsi',
    priority: 0.8,
  },
  {
    path: '/le-esperienze',
    title: 'Le Esperienze Luxosa — Taglio, piega, colore, ricci e cute',
    description:
      'Piega Lux, Taglio Signature, Nuances, Luce Signature, RicciOsa, RicciOso, Cheratina Nutrizione Pro, Area Benessere e Consulenze Specialistiche.',
    image: DEFAULT_IMAGE,
    heroImage: '/images/hero_esperienze.webp',
    breadcrumb: 'Le Esperienze',
    priority: 0.8,
  },
  {
    path: '/sedi',
    title: 'Le sedi Luxosa — Maison a Messina, Corso Cavour',
    description:
      'Le maison Luxosa: spazi pensati per la cura evoluta di cute e capelli. La sede di riferimento è a Messina, in Corso Cavour 1.',
    image: '/images/og-messina-cavour.jpg',
    heroImage: '/images/hero_sedi_poster.webp',
    breadcrumb: 'Sedi',
    priority: 0.7,
  },
  {
    path: '/luxosa-test',
    title: 'Luxosa Test — Il test professionale per cute e capelli',
    description:
      'Pochi minuti di domande su cute, capelli, storia e obiettivi per ricevere un orientamento personalizzato sul percorso Luxosa più adatto. Senza impegno.',
    image: DEFAULT_IMAGE,
    breadcrumb: 'Luxosa Test',
    priority: 0.6,
    noindex: true,
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy — Luxosa',
    description: 'Informativa sul trattamento dei dati personali di chi visita il sito Luxosa o utilizza i servizi della Maison.',
    image: DEFAULT_IMAGE,
    breadcrumb: 'Privacy Policy',
    priority: 0.2,
  },
  {
    path: '/cookie-policy',
    title: 'Cookie Policy — Luxosa',
    description: 'Quali cookie usa il sito Luxosa, per quali finalità e come gestire il consenso.',
    image: DEFAULT_IMAGE,
    breadcrumb: 'Cookie Policy',
    priority: 0.2,
  },
];

export function findPageSeo(pathname: string): PageSeo | undefined {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return PAGES.find((page) => page.path === normalized);
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`;

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Luxosa',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/images/luxosa-monogram.png`,
  description:
    'Maison italiana di cura evoluta per cute e capelli: cura scientifica e metodologica, consulenza e percorsi personalizzati.',
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'sales', email: 'marketing@luxosa.it', availableLanguage: 'it' },
    { '@type': 'ContactPoint', contactType: 'investor relations', email: 'direzione@luxosa.it', availableLanguage: 'it' },
    { '@type': 'ContactPoint', contactType: 'human resources', email: 'persone@luxosa.it', availableLanguage: 'it' },
  ],
  subOrganization: { '@id': MESSINA_ID },
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: 'Luxosa',
  inLanguage: 'it-IT',
  publisher: { '@id': ORGANIZATION_ID },
};

const primaVoltaOffer = {
  '@context': 'https://schema.org',
  '@type': 'Offer',
  '@id': `${MESSINA_URL}#prima-volta`,
  name: 'Prima Volta Luxosa',
  description:
    'Consulenza iniziale di 15–20 minuti con un Tecnico Luxosa, finish a scelta tra PiegaLux e RicciOsa e sintesi orientativa. Durata complessiva circa 1 ora.',
  price: '47',
  priceCurrency: 'EUR',
  url: 'https://lmc.luxosa.it/prima-volta',
  availability: 'https://schema.org/InStock',
  offeredBy: { '@id': MESSINA_ID },
  areaServed: { '@type': 'City', name: 'Messina' },
};

function breadcrumb(page: PageSeo) {
  const parent = page.path.startsWith('/sedi/') ? [{ name: 'Sedi', path: '/sedi' }] : [];
  const trail = [{ name: 'Luxosa', path: '/' }, ...parent, { name: page.breadcrumb ?? page.title, path: page.path }];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// Structured data written into the static HTML of each page at build time.
export function buildPageStructuredData(page: PageSeo, todayKey: string): object[] {
  const blocks: object[] = [organization, website];
  if (page.path !== '/') blocks.push(breadcrumb(page));
  if (page.path === '/sedi/messina-cavour' || page.path === '/sedi') blocks.push(buildSalonStructuredData(todayKey));
  if (page.path === '/sedi/messina-cavour') blocks.push(primaVoltaOffer);
  return blocks;
}
