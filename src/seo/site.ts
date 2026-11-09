import { WEEKLY_HOURS, getVisibleExceptions } from '../lib/messinaCavourHours';

export const SITE_URL = 'https://luxosa.it';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const MESSINA_URL = `${SITE_URL}/sedi/messina-cavour`;
export const MESSINA_ID = `${MESSINA_URL}#sede`;
export const MESSINA_GOOGLE_PLACE_ID = 'ChIJna89CedPFBMRJT4F0y-pbRg';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const toTime = (hours: string) => hours.split('—').map((part) => part.trim());

// Usual hours plus the variations still to come, as schema.org expects them:
// a closure is an OpeningHoursSpecification with opens = closes = 00:00.
export function buildOpeningHoursSpecification(todayKey: string) {
  const usual = Object.entries(WEEKLY_HOURS)
    .filter(([, hours]) => hours)
    .map(([index, hours]) => {
      const [opens, closes] = toTime(hours as string);
      return { '@type': 'OpeningHoursSpecification', dayOfWeek: WEEKDAYS[Number(index)], opens, closes };
    });
  const variations = getVisibleExceptions(todayKey).map((exception) => {
    const [opens, closes] = exception.hours ? toTime(exception.hours) : ['00:00', '00:00'];
    const dayOfWeek = exception.weekdays?.map((index) => WEEKDAYS[index]);
    return { '@type': 'OpeningHoursSpecification', ...(dayOfWeek && { dayOfWeek }), validFrom: exception.from, validThrough: exception.to, opens, closes };
  });
  return [...usual, ...variations];
}

export function buildSalonStructuredData(todayKey: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': MESSINA_ID,
    name: 'Luxosa Messina Cavour',
    url: MESSINA_URL,
    image: `${SITE_URL}/images/messina-new.webp`,
    logo: `${SITE_URL}/images/luxosa-monogram.png`,
    description:
      'Maison Luxosa a Messina, in Corso Cavour 1: cura evoluta di cute e capelli con consulenza, metodo e percorsi personalizzati per colore, taglio, piega, ricci e benessere della cute.',
    telephone: '+39 090 240 3220',
    email: 'messinacavour@luxosa.it',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Corso Cavour, 1',
      postalCode: '98122',
      addressLocality: 'Messina',
      addressRegion: 'ME',
      addressCountry: 'IT',
    },
    hasMap: `https://www.google.com/maps/place/?q=place_id:${MESSINA_GOOGLE_PLACE_ID}`,
    areaServed: [
      { '@type': 'City', name: 'Messina' },
      { '@type': 'AdministrativeArea', name: 'Provincia di Messina' },
    ],
    parentOrganization: { '@id': ORGANIZATION_ID },
    currenciesAccepted: 'EUR',
    openingHoursSpecification: buildOpeningHoursSpecification(todayKey),
  };
}
