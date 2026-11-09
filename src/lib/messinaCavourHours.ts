// Orari di Luxosa Messina Cavour. Unico file da aggiornare a mano:
// - WEEKLY_HOURS: orario abituale (0 = domenica ... 6 = sabato, null = chiuso)
// - HOURS_EXCEPTIONS: variazioni con data di inizio e fine (inclusive, formato AAAA-MM-GG).
//   hours: null = chiuso; una stringa come '09:00 — 14:30' = aperto con orario ridotto.
//   noteKey: chiave in messina-cavour.json sotto messina.cavour.hours
// Il sito mostra il mese in corso e i due successivi e ignora da solo le variazioni passate.

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface HoursException {
  readonly from: string
  readonly to: string
  readonly hours: string | null
  readonly noteKey: string
  readonly weekdays?: readonly WeekdayIndex[]
}

export interface DayHours {
  readonly hours: string | null
  readonly exception?: HoursException
}

export const SALON_TIME_ZONE = 'Europe/Rome'
export const MONTHS_SHOWN = 3

export const WEEKLY_HOURS: Readonly<Record<WeekdayIndex, string | null>> = {
  0: null,
  1: null,
  2: '09:00 — 18:30',
  3: '09:00 — 18:30',
  4: '09:00 — 18:30',
  5: '09:00 — 18:30',
  6: '09:00 — 19:00',
}

export const HOURS_EXCEPTIONS: readonly HoursException[] = [
  { from: '2026-12-07', to: '2026-12-28', weekdays: [1], hours: '09:00 — 18:30', noteKey: 'note.aperturaLunedi' },
  { from: '2026-12-08', to: '2026-12-08', hours: null, noteKey: 'note.immacolata' },
  { from: '2026-12-25', to: '2026-12-26', hours: null, noteKey: 'note.natale' },
  { from: '2027-01-01', to: '2027-01-06', hours: null, noteKey: 'note.festivita' },
]

const DAY_MS = 86_400_000

export function parseKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function toKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS)
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS)
}

export function getSalonToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SALON_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function getDayHours(
  date: Date,
  exceptions: readonly HoursException[] = HOURS_EXCEPTIONS,
): DayHours {
  const key = toKey(date)
  const weekday = date.getUTCDay() as WeekdayIndex
  const exception = exceptions.find(
    (item) => item.from <= key && key <= item.to && (!item.weekdays || item.weekdays.includes(weekday)),
  )
  if (exception) return { hours: exception.hours, exception }
  return { hours: WEEKLY_HOURS[weekday] }
}

export function getMonthStarts(todayKey: string, count: number = MONTHS_SHOWN): Date[] {
  const today = parseKey(todayKey)
  return Array.from(
    { length: count },
    (_, index) => new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + index, 1)),
  )
}

export function getMonthEnd(monthStart: Date): Date {
  return new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 0))
}

export function getExceptionsInMonth(
  monthStart: Date,
  exceptions: readonly HoursException[] = HOURS_EXCEPTIONS,
): HoursException[] {
  const first = toKey(monthStart)
  const last = toKey(getMonthEnd(monthStart))
  return exceptions.filter((item) => item.from <= last && item.to >= first)
}

export function getVisibleExceptions(
  todayKey: string,
  exceptions: readonly HoursException[] = HOURS_EXCEPTIONS,
): HoursException[] {
  const months = getMonthStarts(todayKey)
  const windowEnd = toKey(getMonthEnd(months[months.length - 1]))
  return exceptions.filter((item) => item.to >= todayKey && item.from <= windowEnd)
}
