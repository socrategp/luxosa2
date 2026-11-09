const PRIMA_VOLTA_URL = 'https://lmc.luxosa.it/prima-volta'

export type PrimaVoltaPlacement = 'blocco-offerta' | 'blocco-finale'

export function getPrimaVoltaUrl(placement: PrimaVoltaPlacement): string {
  const url = new URL(PRIMA_VOLTA_URL)
  url.searchParams.set('utm_source', 'luxosa-sito')
  url.searchParams.set('utm_medium', 'sede-messina-cavour')
  url.searchParams.set('utm_campaign', 'prima-volta')
  url.searchParams.set('utm_content', placement)
  return url.toString()
}
