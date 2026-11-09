import { useEffect, useMemo, useState } from 'react';
import { currentLanguage, t } from '../i18n/t';
import {
  WEEKLY_HOURS,
  addDays,
  daysBetween,
  getDayHours,
  getExceptionsInMonth,
  getMonthEnd,
  getMonthStarts,
  getSalonToday,
  getVisibleExceptions,
  parseKey,
  toKey,
} from '../lib/messinaCavourHours';
import type { HoursException, WeekdayIndex } from '../lib/messinaCavourHours';
import { buildSalonStructuredData } from '../seo/site';

const CLOCK_REFRESH_MS = 60_000;
const MONDAY_REFERENCE = '2024-01-01';
const CLOSED_HATCH = 'bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgba(196,174,140,0.2)_6px_7px)]';

const th = (key: string, options?: Record<string, unknown>) =>
  t(`messina-cavour:messina.cavour.hours.${key}`, options);

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function useDateFormat() {
  const locale = currentLanguage();
  return (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(date);
}

type DateFormat = ReturnType<typeof useDateFormat>;

function useSalonToday(): string {
  const [today, setToday] = useState(getSalonToday);
  useEffect(() => {
    const id = window.setInterval(() => setToday(getSalonToday()), CLOCK_REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);
  return today;
}

function statusText(hours: string | null): string {
  return hours ? th('statusOpen', { hours }) : th('statusClosed');
}

function describeException(exception: HoursException, format: DateFormat): string {
  const from = parseKey(exception.from);
  const to = parseKey(exception.to);
  // Intl puts weekday, day and month in the right order for each language.
  // Italian keeps the compact forms ("Lunedì 7, 14 e 21 dicembre", "lunedì 7 – martedì 9 dicembre").
  const isItalian = currentLanguage() === 'it';
  const fullDate = (date: Date) => format(date, { weekday: 'long', day: 'numeric', month: 'long' });
  const dayOnly = (date: Date) => format(date, { weekday: 'long', day: 'numeric' });
  const days = exception.weekdays
    ? Array.from({ length: daysBetween(from, to) + 1 }, (_, index) => addDays(from, index)).filter((date) =>
        exception.weekdays?.includes(date.getUTCDay() as WeekdayIndex),
      )
    : [];
  if (days.length > 0) {
    const weekday = format(days[0], { weekday: 'long' });
    const labels = days.map((date) =>
      isItalian ? String(date.getUTCDate()) : format(date, { day: 'numeric', month: 'long' }),
    );
    const last = labels.pop() ?? '';
    const list = labels.length > 0 ? th('pair', { a: labels.join(', '), b: last }) : last;
    return capitalize(isItalian ? `${weekday} ${list} ${format(to, { month: 'long' })}` : `${weekday}: ${list}`);
  }
  const sameMonth = from.getUTCMonth() === to.getUTCMonth();
  const fromLabel = sameMonth && isItalian ? dayOnly(from) : fullDate(from);
  const toLabel = fullDate(to);

  if (exception.from === exception.to) return capitalize(toLabel);
  if (daysBetween(from, to) === 1) return capitalize(th('pair', { a: fromLabel, b: toLabel }));
  return th('range', { from: fromLabel, to: toLabel });
}

function weekdayName(format: DateFormat, index: number, style: 'long' | 'short'): string {
  return format(addDays(parseKey(MONDAY_REFERENCE), index === 0 ? 6 : index - 1), { weekday: style });
}

function useHoursState() {
  const format = useDateFormat();
  const todayKey = useSalonToday();
  const today = parseKey(todayKey);
  const months = useMemo(() => getMonthStarts(todayKey), [todayKey]);
  const [chosen, setChosen] = useState<string | null>(null);
  const selected = chosen && months.some((month) => toKey(month) === chosen) ? chosen : toKey(months[0]);
  const monthStart = months.find((month) => toKey(month) === selected) ?? months[0];
  const todayText = `${th('today', { date: format(today, { weekday: 'long', day: 'numeric', month: 'long' }) })} · ${statusText(getDayHours(today).hours)}`;
  const structuredData = useMemo(() => JSON.stringify(buildSalonStructuredData(todayKey)).replace(/</g, '\\u003c'), [todayKey]);
  return { format, todayKey, months, selected, monthStart, setChosen, todayText, structuredData };
}

type HoursState = ReturnType<typeof useHoursState>;

function MonthButtons({ months, selected, onSelect, format }: Pick<HoursState, 'months' | 'selected' | 'format'> & { onSelect: (key: string) => void }) {
  return (
    <div role="group" aria-label={th('months')} className="flex flex-wrap gap-2">
      {months.map((month) => {
        const key = toKey(month);
        const isActive = key === selected;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(key)}
            className={`inline-flex items-center gap-2 border px-3.5 py-2 text-[11px] tracking-[0.16em] uppercase font-light transition-colors duration-500 ${
              isActive ? 'bg-ivory text-charcoal border-ivory' : 'border-ivory/25 text-ivory/80 hover:border-brass-light'
            }`}
          >
            {format(month, { month: 'long' })}
            {getExceptionsInMonth(month).length > 0 && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brass-light" />}
          </button>
        );
      })}
    </div>
  );
}

function CalendarGrid({ monthStart, todayKey, format }: Pick<HoursState, 'monthStart' | 'todayKey' | 'format'>) {
  const daysInMonth = getMonthEnd(monthStart).getUTCDate();
  const leadingBlanks = (monthStart.getUTCDay() + 6) % 7;

  return (
    <div className="grid grid-cols-7 gap-[3px]">
      {Array.from({ length: 7 }, (_, index) => (
        <div key={index} className="pb-1 text-center text-[9px] tracking-[0.18em] uppercase text-ivory/45 font-light">
          {weekdayName(format, (index + 1) % 7, 'short')}
        </div>
      ))}
      {Array.from({ length: leadingBlanks }, (_, index) => <div key={`blank-${index}`} aria-hidden="true" />)}
      {Array.from({ length: daysInMonth }, (_, index) => {
        const date = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth(), index + 1));
        const { hours, exception } = getDayHours(date);
        const key = toKey(date);
        const state =
          key === todayKey
            ? 'bg-ivory text-charcoal border-ivory'
            : `${hours ? 'text-ivory/85' : `${CLOSED_HATCH} text-ivory/40`} ${exception ? 'border-brass-light/80' : 'border-ivory/15'} ${key < todayKey ? 'opacity-40' : ''}`;
        return (
          <div
            key={key}
            aria-label={th('cellLabel', { date: format(date, { weekday: 'long', day: 'numeric', month: 'long' }), status: statusText(hours) })}
            className={`h-8 sm:h-[34px] border flex items-center justify-center text-[13px] sm:text-[14px] font-light tabular-nums ${state}`}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );
}

function Legend() {
  const items = [
    { label: th('legendToday'), swatch: 'bg-ivory border-ivory' },
    { label: th('legendVaried'), swatch: 'border-brass-light' },
    { label: th('legendClosed'), swatch: `${CLOSED_HATCH} border-ivory/20` },
  ];
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2 text-[12px] text-ivory/65 font-light">
          <i aria-hidden="true" className={`h-3 w-3 border ${item.swatch}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function UsualHours({ format }: { format: DateFormat }) {
  const rows = [
    { label: `${capitalize(weekdayName(format, 2, 'long'))} — ${capitalize(weekdayName(format, 5, 'long'))}`, value: WEEKLY_HOURS[2], muted: false },
    { label: capitalize(weekdayName(format, 6, 'long')), value: WEEKLY_HOURS[6], muted: false },
    { label: th('pair', { a: capitalize(weekdayName(format, 1, 'long')), b: weekdayName(format, 0, 'long') }), value: th('closedLabel'), muted: true },
  ];
  return (
    <div>
      <span className="text-[10px] tracking-[0.3em] uppercase text-brass-light font-light">{th('usual')}</span>
      <div className="mt-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 border-b border-ivory/15 py-1.5 text-[15px] font-light text-ivory">
            <span>{row.label}</span>
            <span className={`tabular-nums whitespace-nowrap ${row.muted ? 'text-ivory/45' : ''}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Variations({ months, selected, format }: Pick<HoursState, 'months' | 'selected' | 'format'>) {
  return (
    <div>
      <span className="text-[10px] tracking-[0.3em] uppercase text-brass-light font-light">{th('variations')}</span>
      <div className="mt-3 space-y-2.5">
        {months.map((month) => {
          const exceptions = getExceptionsInMonth(month);
          return (
            <div key={toKey(month)} className={`border-l-2 pl-3 ${toKey(month) === selected ? 'border-brass-light' : 'border-ivory/20'}`}>
              <h3 className="font-serif text-[17px] font-light text-ivory capitalize">{format(month, { month: 'long' })}</h3>
              {exceptions.length === 0 ? (
                <p className="text-[14px] font-light text-ivory/65">{th('noVariations')}</p>
              ) : (
                <ul className="space-y-0.5 text-[14px] font-light">
                  {exceptions.map((exception) => (
                    <li key={exception.from + exception.noteKey} className="text-ivory">
                      {describeException(exception, format)}
                      <span className="text-ivory/65"> · {statusText(exception.hours)}, {th(exception.noteKey)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HoursPanel({ state }: { state: HoursState }) {
  const { format, todayKey, months, selected, monthStart, setChosen } = state;
  return (
    <div className="pt-6 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <span className="text-[10px] tracking-[0.3em] uppercase text-brass-light font-light">{th('calendar')}</span>
        <MonthButtons months={months} selected={selected} onSelect={setChosen} format={format} />
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14 items-start">
        <div className="min-w-0">
          <CalendarGrid monthStart={monthStart} todayKey={todayKey} format={format} />
          <Legend />
        </div>
        <aside className="min-w-0 space-y-6">
          <UsualHours format={format} />
          <Variations months={months} selected={selected} format={format} />
        </aside>
      </div>
    </div>
  );
}

export default function MessinaHoursCalendar() {
  const state = useHoursState();
  const [isOpen, setIsOpen] = useState(false);
  const { format, todayKey, todayText, structuredData } = state;
  const next = getVisibleExceptions(todayKey)[0];
  const usual = `${capitalize(weekdayName(format, 2, 'long'))} — ${capitalize(weekdayName(format, 5, 'long'))} ${WEEKLY_HOURS[2]} · ${capitalize(weekdayName(format, 6, 'long'))} ${WEEKLY_HOURS[6]}`;

  return (
    <section id="mc-orari" className="bg-charcoal text-ivory">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-5 md:py-6">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mc-orari-panel"
          onClick={() => setIsOpen((value) => !value)}
          className="flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-3 text-left"
        >
          <span className="grid gap-0.5">
            <span className="font-serif text-[20px] md:text-[22px] font-light leading-[1.2] text-ivory">{todayText}</span>
            <span className="text-[14px] font-light text-ivory/65">
              {next && `${th('nextVariation', { date: describeException(next, format) })} · `}{usual}
            </span>
          </span>
          <span className="inline-flex items-center gap-3 border border-ivory/40 px-4 py-2.5 text-[12px] tracking-[0.16em] uppercase font-light text-ivory transition-colors duration-500 hover:border-brass-light">
            {isOpen ? th('closeCta') : th('openCta')}
            <span aria-hidden="true" className={`h-[7px] w-[7px] border-r-[1.5px] border-b-[1.5px] border-current transition-transform duration-500 ${isOpen ? 'rotate-[225deg] translate-y-[2px]' : 'rotate-45 -translate-y-[2px]'}`} />
          </span>
        </button>
        <div id="mc-orari-panel" inert={!isOpen} className={`grid transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(0.25,0.1,0,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="min-h-0 overflow-hidden">
            <HoursPanel state={state} />
          </div>
        </div>
      </div>
    </section>
  );
}
