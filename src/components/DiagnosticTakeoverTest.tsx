// ---------------------------------------------------------------
// LUXOSA — LUXOSA TEST v2.0
// Quiz orientativo fullscreen — 10-12 domande con ramificazione
// ---------------------------------------------------------------

import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@vercel/analytics';
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, X, Check } from 'lucide-react';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import type { Value as PhoneValue } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// -- TYPES ------------------------------------------------------

type Screen = 'disclaimer' | 'quiz' | 'form' | 'sending' | 'result';

interface ContactFormData {
  nome: string;
  cognome: string;
  email: string;
  whatsapp: string;
  privacyAcknowledged: boolean;
  marketingConsent: boolean;
}

// -- CONSTANTS --------------------------------------------------

import { premiumEase } from '../lib/animations';
import i18n from '../i18n';
import {
  type Answers,
  type AttentionLevel,
  type OptionDef,
  type QuestionDef,
  buildQuestionSequence,
  getBranchKey,
  buildLuxosaTestResult,
  PUBLIC_PERCORSO_NAMES,
  LUXOSA_LOCATIONS,
} from '../lib/luxosaTest/result';

// Test copy: force Italian regardless of browser-detected language.
// Multi-language adaptation of the new intro copy is a later, separate step.
const t = i18n.getFixedT('it');

// -- OPTION IMAGES ---------------------------------------------
// Path: /images/quiz/options/{id}.jpg — 800x600, 4:3, warm premium tones
// Fallback: themed gradient if image not yet available

const OPTION_IMAGES: Record<string, string> = {
  // D1 — Tipo di capello
  d1_lisci: '/images/quiz/options/d1_lisci.webp',
  d1_mossi: '/images/quiz/options/d1_mossi.webp',
  d1_ricci: '/images/quiz/options/d1_ricci.webp',
  d1_molto_ricci: '/images/quiz/options/d1_molto_ricci.webp',
  // D2 — Stato attuale
  d2_fragili: '/images/quiz/options/d2_fragili.webp',
  d2_crespi: '/images/quiz/options/d2_crespi.webp',
  d2_sottili: '/images/quiz/options/d2_sottili.webp',
  d2_grassi: '/images/quiz/options/d2_grassi.webp',
  d2_secchi: '/images/quiz/options/d2_secchi.webp',
  d2_sani: '/images/quiz/options/d2_senzaforma.webp',
  // D4a–D7a — Cute (D3: fallback premium — immagini da produrre)
  d4a_prurito: '/images/quiz/options/prurito.webp',
  d4a_desquamazione: '/images/quiz/options/desquamazione-forfora.webp',
  d4a_grassa: '/images/quiz/options/cute_grassa.webp',
  d4a_rossori: '/images/quiz/options/irritazioni.webp',
  d4a_tira: '/images/quiz/options/cute_che_tira.webp',
  d7a_no: '/images/quiz/options/diradamento_no.webp',
  d7a_lieve: '/images/quiz/options/diradamento_poco.webp',
  d7a_evidente: '/images/quiz/options/diradamento_alto.webp',
  // D4b–D5b — Struttura (D6b/D7b: fallback premium — immagini da produrre)
  d4b_colorazioni: '/images/quiz/options/danni_colorazioni.webp',
  d4b_decolorazioni: '/images/quiz/options/danni_decolorazione.webp',
  d4b_stiratura: '/images/quiz/options/danni_stiratura.webp',
  d4b_calore: '/images/quiz/options/danni_piastra_calore.webp',
  d4b_aggressivi: '/images/quiz/options/danni_trattamenti_aggressivi.webp',
  d5b_sane: '/images/quiz/options/punte_sane.webp',
  d5b_aperte: '/images/quiz/options/punte_mediodanno.webp',
  d5b_spezzano: '/images/quiz/options/punte_alto_danno.webp',
};

const SQ = { aspect: 'aspect-square', position: 'object-center' } as const;

const OPTION_IMAGE_STYLE: Record<string, { aspect: string; position: string }> = {
  d1_lisci: SQ, d1_mossi: SQ, d1_ricci: SQ, d1_molto_ricci: SQ,
  d2_fragili: SQ, d2_crespi: SQ, d2_sottili: SQ, d2_grassi: SQ, d2_secchi: SQ, d2_sani: SQ,
  d3_cute: SQ, d3_rovinato: SQ, d3_colore: SQ, d3_forma: SQ, d3_tutto: SQ,
  d4a_prurito: SQ, d4a_desquamazione: SQ, d4a_grassa: SQ, d4a_rossori: SQ, d4a_tira: SQ,
  d5a_settimane: SQ, d5a_mesi: SQ, d5a_anno: SQ, d5a_sempre: SQ,
  d6a_mai: SQ, d6a_prodotti: SQ, d6a_salone: SQ, d6a_dermatologo: SQ,
  d7a_no: SQ, d7a_lieve: SQ, d7a_evidente: SQ,
  d4b_colorazioni: SQ, d4b_decolorazioni: SQ, d4b_stiratura: SQ, d4b_calore: SQ, d4b_aggressivi: SQ,
  d5b_sane: SQ, d5b_aperte: SQ, d5b_spezzano: SQ,
  d6b_morbido: SQ, d6b_ruvido: SQ, d6b_secco: SQ, d6b_paglia: SQ,
  d7b_morbidezza: SQ, d7b_rinforzare: SQ, d7b_ricominciare: SQ,
  d4c_naturale: SQ, d4c_tinta: SQ, d4c_decolorazioni: SQ, d4c_grigi_coprire: SQ, d4c_grigi_valorizzare: SQ,
  d5c_spegne: SQ, d5c_luminoso: SQ, d5c_uniforme: SQ, d5c_viso: SQ, d5c_danneggia: SQ,
  d6c_frequente: SQ, d6c_normale: SQ, d6c_raro: SQ, d6c_mai: SQ,
  d7c_naturalezza: SQ, d7c_luminosita: SQ, d7c_copertura: SQ, d7c_cambiamento: SQ, d7c_bianco: SQ,
  d4d_volume: SQ, d4d_ricci: SQ, d4d_piega: SQ, d4d_taglio: SQ,
  d5d_poco: SQ, d5d_medio: SQ, d5d_molto: SQ, d5d_troppo: SQ,
  d6d_mai: SQ, d6d_qualche: SQ, d6d_sempre: SQ,
  d7d_liberi: SQ, d7d_disciplinati: SQ, d7d_voluminosi: SQ, d7d_scoprire: SQ,
  d4e_cute: SQ, d4e_capello: SQ, d4e_colore: SQ, d4e_forma: SQ, d4e_nonso: SQ,
  d5e_cercando: SQ, d5e_insoddisfatta: SQ, d5e_prima: SQ,
  d6e_risultati: SQ, d6e_presa: SQ, d6e_capire: SQ, d6e_tutto: SQ,
  d7e_se_funziona: SQ, d7e_continuita: SQ, d7e_valutare: SQ,
  d8_ogni_giorno: SQ, d8_2_3: SQ, d8_settimana: SQ, d8_meno: SQ,
  d9_amo: SQ, d9_non_piacciono: SQ, d9_trascuro: SQ, d9_ci_lavoro: SQ,
};

type TrackingValue = string | number | boolean | null | undefined;
type TrackingProperties = Record<string, TrackingValue>;

const ALLOWED_EXTERNAL_TRACKING_PROPERTIES = [
  'screen',
  'step_number',
  'total_steps',
  'question_id',
  'question_type',
  'branch',
  'option_id',
  'selection_type',
  'selected_count',
  'action',
  'answered_count',
  'has_d10_note',
  'percorso_public',
  'primary_area',
  'secondary_area',
  'attention_level',
  'experiences_count',
  'location_id',
  'time_slot',
] as const;

type ExternalTrackingProperty = typeof ALLOWED_EXTERNAL_TRACKING_PROPERTIES[number];
type ExternalTrackingProperties = Partial<Record<ExternalTrackingProperty, TrackingValue>>;

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, properties?: ExternalTrackingProperties) => void;
    clarity?: {
      (command: 'event', eventName: string): void;
      (command: 'set', key: string, value: string): void;
    };
  }
}

function getExternalTrackingProperties(properties: TrackingProperties): ExternalTrackingProperties {
  const externalProperties: ExternalTrackingProperties = {};
  for (const key of ALLOWED_EXTERNAL_TRACKING_PROPERTIES) {
    const value = properties[key];
    if (value !== undefined) {
      externalProperties[key] = value;
    }
  }
  return externalProperties;
}

function setClarityTag(key: string, value: TrackingValue) {
  if (value === null || value === undefined) return;
  window.clarity?.('set', key, String(value));
}

function updateClarityLuxosaTestTags(name: string, properties: ExternalTrackingProperties) {
  setClarityTag('luxosa_test_status', name.replace('luxosa_test_', ''));
  setClarityTag('luxosa_test_last_step', properties.step_number ?? properties.screen);
  setClarityTag('luxosa_test_result', properties.percorso_public);
  setClarityTag('luxosa_test_attention_level', properties.attention_level);
}

function trackLuxosaTestEvent(name: string, properties: TrackingProperties) {
  track(name, properties);
  const externalProperties = getExternalTrackingProperties(properties);
  window.gtag?.('event', name, externalProperties);
  window.clarity?.('event', name);
  updateClarityLuxosaTestTags(name, externalProperties);
}

function getTrackingBranch(answers: Answers): string {
  const d3 = answers['d3'];
  return typeof d3 === 'string' ? getBranchKey(d3) : 'unknown';
}

function getAnsweredCount(answers: Answers): number {
  return Object.values(answers).filter(value =>
    Array.isArray(value) ? value.length > 0 : value.trim().length > 0
  ).length;
}

// -- WHATSAPP MESSAGE BUILDER -------------------------------------

function buildWhatsAppMessage(
  nome: string,
  email: string,
  whatsapp: string,
  fascia: string,
  sede: string,
  answers: Answers
): string {
  const {
    secondaryPublic: secondPub,
    attentionLevel: attention,
    percorsoName,
    conditionSummary,
    mainSignals,
    desiredOutcome,
    percorsoRationale,
    esperienze,
    consultationFocus,
    d10Note,
    closing,
  } = buildLuxosaTestResult(answers);
  const attentionLabels: Record<AttentionLevel, string> = {
    ordinaria: t('report:diagnostic.168'),
    mirata: t('report:diagnostic.151'),
    prioritaria: t('report:diagnostic.152'),
  };

  const lines: string[] = [];
  lines.push(t('report:diagnostic.155'));
  lines.push('');
  lines.push(t('report:diagnostic.169', { fascia }));
  lines.push(t('report:diagnostic.170', { sede }));
  lines.push('');
  lines.push(t('report:diagnostic.156'));
  lines.push(t('report:diagnostic.171', { nome }));
  lines.push(t('report:diagnostic.172', { email }));
  lines.push(t('report:diagnostic.173', { whatsapp }));
  lines.push('');
  lines.push(t('report:diagnostic.157'));
  lines.push('');
  lines.push(t('report:diagnostic.174', { percorsoName }));
  lines.push(t('report:diagnostic.175', { attention: attentionLabels[attention] }));
  lines.push('');
  lines.push(t('report:diagnostic.158'));
  lines.push(conditionSummary);
  lines.push('');
  lines.push(t('report:diagnostic.159'));
  mainSignals.forEach(s => lines.push(`- ${s}`));
  lines.push('');
  lines.push(t('report:diagnostic.160'));
  lines.push(desiredOutcome);
  lines.push('');
  lines.push(t('report:diagnostic.161'));
  lines.push(percorsoRationale);
  lines.push('');
  lines.push(t('report:diagnostic.162'));
  esperienze.forEach(e => {
    lines.push(`- ${e.es.nome}`);
    lines.push(`  ${e.perche}`);
  });
  if (secondPub) {
    lines.push('');
    lines.push(t('report:diagnostic.176', { percorsoName: PUBLIC_PERCORSO_NAMES[secondPub] }));
  }
  lines.push('');
  lines.push(t('report:diagnostic.163'));
  consultationFocus.forEach(f => lines.push(`- ${f}`));
  if (d10Note) {
    lines.push('');
    lines.push(t('report:diagnostic.164'));
    lines.push(d10Note);
  }
  lines.push('');
  lines.push(closing);
  lines.push('');
  lines.push('---');
  lines.push(t('report:disclaimer'));
  return lines.join('\n');
}

// ---------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------

// -- DISCLAIMER SCREEN ------------------------------------------

function DisclaimerScreen({ onAccept }: { onAccept: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="w-full max-w-[720px] mx-auto px-6 md:px-10 py-10 md:py-14"
    >
      <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">{t('test:diagnostic.takeover.234')}</span>
      <h2 className="font-serif text-[26px] md:text-[34px] font-light leading-[1.15] text-charcoal mb-2">Benvenuta nel Luxosa Test</h2>
      <p className="text-[17px] leading-[1.8] text-anthracite/70 font-light mb-6">
        In pochi minuti ci aiuterà a comprendere meglio le caratteristiche dei tuoi capelli, della cute, le tue abitudini e le tue esigenze, per offrirti un primo orientamento personalizzato.
      </p>
      <p className="text-[15px] leading-[1.8] text-anthracite/70 font-light mb-8">
        <strong className="text-charcoal/80 font-normal">Come funziona — </strong>
        Si tratta di un test semplice, a risposte multiple: per ogni domanda seleziona le opzioni proposte. Alcune prevedono una sola risposta e proseguiranno automaticamente; altre ne consentono fino a due, da confermare con "Continua". Potrai sempre tornare indietro e modificare le tue scelte.
      </p>

      <div className="border border-sand/50 p-6 md:p-8 bg-ecru/20 mb-10 text-[16px] leading-[1.85] text-anthracite/80 font-light">
        <p>
          <strong className="text-charcoal/80 font-normal">Importante — </strong>
          Il Luxosa Test offre un orientamento preliminare e non costituisce diagnosi medica, tricologica o dermatologica. La valutazione professionale viene effettuata in Maison.
        </p>
      </div>

      <motion.button
        onClick={onAccept}
        animate={{
          scale: [1, 1.03, 1],
          boxShadow: [
            '0 0 0 0 rgba(176,152,114,0)',
            '0 0 28px 6px rgba(176,152,114,0.35)',
            '0 0 0 0 rgba(176,152,114,0)',
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: premiumEase }}
        className="relative overflow-hidden group inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4 bg-charcoal text-ivory cursor-pointer"
      >
        <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
        <span className="relative z-10 flex items-center gap-3">{t('test:diagnostic.takeover.250')}<ArrowRight size={14} strokeWidth={1.5} /></span>
      </motion.button>
    </motion.div>
  );
}

// -- QUIZ CONTENT -----------------------------------------------

// -- LAYOUT HELPERS (count-based, no per-question overrides) ----

function getColCount(n: number): number {
  if (n <= 4) return n;
  if (n <= 6) return 3;
  return 4;
}

function cardWidthClass(cols: number): string {
  // Mobile: sempre 2 colonne, gap-3 (0.75rem)
  // md+: desktop cols, gap-4 (1rem)
  const m = 'w-[calc(50%-0.375rem)]';
  if (cols <= 2) return `${m} md:w-[calc(50%-0.5rem)]`;
  if (cols === 3) return `${m} md:w-[calc(33.333%-0.667rem)]`;
  return `${m} md:w-[calc(25%-0.75rem)]`;
}

function renderOptionGrid(
  opts: OptionDef[],
  renderItem: (opt: OptionDef, globalIndex: number) => React.ReactNode
): React.ReactNode {
  const cols = getColCount(opts.length);
  const wClass = cardWidthClass(cols);
  const rows: OptionDef[][] = [];
  for (let i = 0; i < opts.length; i += cols) rows.push(opts.slice(i, i + cols));
  return (
    <div className="space-y-3 md:space-y-4">
      {rows.map((row, ri) => (
        <div key={ri} className="flex flex-wrap justify-center gap-3 md:gap-4">
          {row.map((opt, ci) => (
            <div key={opt.id} className={wClass}>
              {renderItem(opt, ri * cols + ci)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function OptionCard({
  opt,
  isSelected,
  isMulti,
  onSelect,
  index,
}: {
  opt: OptionDef;
  isSelected: boolean;
  isMulti: boolean;
  onSelect: () => void;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = OPTION_IMAGES[opt.id];
  const hasImage = !!(imgSrc && !imgError);
  const style = OPTION_IMAGE_STYLE[opt.id];

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.06, duration: 0.4, ease: premiumEase }}
      onClick={onSelect}
      className={`w-full group relative text-left overflow-hidden border-2 h-full transition-all duration-500 ${
        isSelected
          ? 'border-brass shadow-md ring-1 ring-brass/20'
          : 'border-anthracite/20 hover:border-brass/35 hover:shadow-md'
      }`}
    >
      <div className={`relative overflow-hidden ${style?.aspect ?? 'aspect-square'}`}>
        {hasImage ? (
          <>
            <img
              src={imgSrc}
              alt={opt.text}
              className={`w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] ${style?.position ?? 'object-center'}`}
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className={`absolute bottom-0 left-0 right-0 px-3 py-2.5 transition-colors duration-300 ${
              isSelected ? 'bg-ivory' : 'bg-ivory/95'
            }`}>
              <p className={`text-[12px] md:text-[14px] font-light leading-snug transition-colors duration-300 ${
                isSelected ? 'text-brass-muted' : 'text-charcoal'
              }`}>
                {opt.text}
              </p>
              {opt.subtext && (
                <p className="mt-0.5 text-[10px] text-anthracite/65 font-light leading-snug">{opt.subtext}</p>
              )}
            </div>
          </>
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center px-4 text-center transition-colors duration-500 ${
            isSelected ? 'bg-ecru/35' : 'bg-ecru/20 group-hover:bg-ecru/40'
          }`}>
            <p className={`font-serif text-[20px] md:text-[23px] font-light leading-snug transition-colors duration-300 ${
              isSelected ? 'text-brass-muted' : 'text-charcoal group-hover:text-brass-muted'
            }`}>
              {opt.text}
            </p>
            {opt.subtext && (
              <p className="mt-2 text-[10px] md:text-[12px] leading-[1.5] text-anthracite/55 font-light">{opt.subtext}</p>
            )}
          </div>
        )}
        {isSelected && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2.5 right-2.5 w-6 h-6 bg-brass flex items-center justify-center">
            <Check size={12} strokeWidth={2.5} className="text-ivory" />
          </motion.div>
        )}
        {isMulti && !isSelected && (
          <div className="absolute top-2.5 right-2.5 w-5 h-5 border border-ivory/60 bg-deep/20 backdrop-blur-sm" />
        )}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500 ${
        isSelected ? 'bg-brass' : 'bg-transparent group-hover:bg-brass/20'
      }`} />
    </motion.button>
  );
}

function QuizContent({
  q,
  answers,
  onSingleSelect,
  onMultiToggle,
  onContinue,
  onTextChange,
}: {
  q: QuestionDef;
  answers: Answers;
  onSingleSelect: (qId: string, optId: string) => void;
  onMultiToggle: (qId: string, optId: string, max: number) => void;
  onContinue: () => void;
  onTextChange: (qId: string, val: string) => void;
}) {
  const isMulti = q.selectionType === 'multi';
  const isText = q.selectionType === 'text';
  const maxSel = q.maxSelections ?? 1;
  const currentAnswer = answers[q.id];
  const selectedIds = Array.isArray(currentAnswer) ? currentAnswer : currentAnswer ? [currentAnswer as string] : [];
  const textValue = (answers[q.id] as string | undefined) ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: premiumEase }}
      className="w-full"
    >
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 lg:py-14">
      {/* Question header */}
      <div className="text-center mb-8 md:mb-10">
        <span className="text-[10px] tracking-[0.45em] uppercase text-brass-muted mb-3 block font-light">{q.label}</span>
        <h2 className="font-serif text-[20px] sm:text-[24px] md:text-[30px] lg:text-[36px] font-light leading-[1.15] text-charcoal mb-3">
          {q.question}
        </h2>
        {q.subtitle && (
          <p className="text-[12px] md:text-[16px] text-anthracite/55 font-light italic">{q.subtitle}</p>
        )}
        <div className="w-8 h-[1px] bg-brass/30 mx-auto mt-5" />
      </div>

      {/* Text question */}
      {isText && (
        <div className="max-w-[640px] mx-auto">
          <textarea
            value={textValue}
            onChange={e => onTextChange(q.id, e.target.value)}
            maxLength={500}
            placeholder={t('test:diagnostic.takeover.260')}
            className="w-full h-36 md:h-44 bg-ivory/80 border border-sand/50 px-5 py-4 text-[17px] text-anthracite/95 font-light leading-[1.8] resize-none outline-none focus:border-brass/50 transition-colors duration-300 placeholder:text-anthracite/40"
          />
          <div className="text-right mt-1.5">
            <span className="text-[11px] text-anthracite/40 font-light">{textValue.length}/500</span>
          </div>
          <div className="mt-8 text-center">
            <ContinuaButton onClick={onContinue} enabled />
          </div>
        </div>
      )}

      {/* All questions — unified count-based grid via renderOptionGrid */}
      {!isText && (
        <>
          {renderOptionGrid(q.options, (opt, i) => (
            <OptionCard
              opt={opt}
              isSelected={selectedIds.includes(opt.id)}
              isMulti={isMulti}
              onSelect={() =>
                isMulti
                  ? onMultiToggle(q.id, opt.id, maxSel)
                  : onSingleSelect(q.id, opt.id)
              }
              index={i}
            />
          ))}
          {isMulti && (
            <div className="mt-8 text-center">
              <ContinuaButton onClick={onContinue} enabled={selectedIds.length > 0} />
            </div>
          )}
        </>
      )}
      </div>
    </motion.div>
  );
}

function ContinuaButton({ onClick, enabled }: { onClick: () => void; enabled: boolean }) {
  return (
    <button
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      className={`relative overflow-hidden group inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4 transition-all duration-500 ${
        enabled ? 'bg-charcoal text-ivory cursor-pointer' : 'bg-anthracite/10 text-anthracite/40 cursor-not-allowed'
      }`}
    >
      {enabled && (
        <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
      )}
      <span className={`flex items-center gap-3 ${enabled ? 'relative z-10' : ''}`}>{t('test:diagnostic.takeover.264')}<ArrowRight size={14} strokeWidth={1.5} className={enabled ? 'group-hover:translate-x-1 transition-transform duration-300' : ''} />
      </span>
    </button>
  );
}

// -- FORM SCREEN ------------------------------------------------

function FormScreen({ onSubmit }: { onSubmit: (data: ContactFormData) => void }) {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<PhoneValue | undefined>(undefined);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  const handleSubmit = () => {
    if (!nome.trim() || !cognome.trim()) {
      setError('Compila tutti i campi per ricevere il tuo Luxosa Test.');
      return;
    }
    if (!isValidEmail(email)) {
      setError("Controlla l'indirizzo email inserito: sembra incompleto o non corretto.");
      return;
    }
    if (!phone || !isPossiblePhoneNumber(phone)) {
      setError('Controlla il numero inserito: sembra incompleto o non corretto.');
      return;
    }
    if (!privacyAcknowledged) {
      setError('Conferma la richiesta necessaria per elaborare il tuo Luxosa Test prima di continuare.');
      return;
    }
    onSubmit({
      nome: nome.trim(),
      cognome: cognome.trim(),
      email: email.trim(),
      whatsapp: phone,
      privacyAcknowledged,
      // Not collected by this form: false is a strict no-op server-side
      // (GHL's marketing-consent field is never written or cleared).
      marketingConsent: false,
    });
  };

  const inputClass = 'w-full bg-ivory/80 border border-sand/50 px-5 py-4 text-[17px] text-anthracite/95 font-light outline-none focus:border-brass/50 transition-colors duration-300 placeholder:text-anthracite/43';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="relative w-full"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src="/images/zona-consulenza.webp" alt="" className="w-full h-full object-cover opacity-[0.04] lg:opacity-[0.06]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/50 via-ivory/85 to-ivory" />
      </div>

      <div className="relative z-10 max-w-[580px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">Luxosa Test</span>
        <h2 className="font-serif text-[26px] md:text-[34px] font-light leading-[1.15] text-charcoal mb-4">Il tuo Luxosa Test è quasi pronto</h2>
        <p className="text-[17px] leading-[1.8] text-anthracite/70 font-light mb-10">
          Compila tutti i campi per ricevere via email il tuo report personalizzato completo. Inserisci un indirizzo email valido: è lì che ti invieremo il tuo Luxosa Test.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Il tuo nome *"
            value={nome}
            onChange={e => { setNome(e.target.value); setError(''); }}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Il tuo cognome *"
            value={cognome}
            onChange={e => { setCognome(e.target.value); setError(''); }}
            className={inputClass}
          />
          <input
            type="email"
            placeholder="Il tuo indirizzo email *"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            className={inputClass}
          />

          {/* Phone input con selezione Paese */}
          <div className="luxosa-phone-input">
            <PhoneInput
              defaultCountry="IT"
              value={phone}
              onChange={(val) => { setPhone(val); setError(''); }}
              placeholder="Il tuo numero WhatsApp *"
              international
              countryCallingCodeEditable={false}
            />
          </div>

          <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={privacyAcknowledged}
              onChange={e => { setPrivacyAcknowledged(e.target.checked); setError(''); }}
              className="mt-[3px] h-4 w-4 flex-shrink-0 accent-charcoal"
            />
            <span className="text-[13px] leading-[1.6] text-anthracite/75 font-light">
              Confermo di voler ricevere il mio Luxosa Test e autorizzo Luxosa a utilizzare i recapiti indicati per l'elaborazione, l'invio del dossier e le comunicazioni direttamente collegate alla mia richiesta. *
            </span>
          </label>

          {error && (
            <p className="text-[12px] text-brass-muted font-light italic pt-1">{error}</p>
          )}

          <div className="pt-2">
            <button
              onClick={handleSubmit}
              className="relative overflow-hidden group w-full inline-flex items-center justify-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light py-5"
            >
              <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
              <span className="relative z-10 flex items-center gap-3">Voglio ricevere il mio Report Luxosa<ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// -- SENDING SCREEN -----------------------------------------------

const PROCESSING_PHASES = [
  'Analizziamo le tue risposte',
  'Definiamo il tuo profilo Luxosa',
  'Prepariamo il tuo dossier personalizzato',
  'Organizziamo il risultato finale',
  "Completiamo l'invio",
];
const PROCESSING_VISUAL_MS = 60_000;
const PROCESSING_PHASE_MS = PROCESSING_VISUAL_MS / PROCESSING_PHASES.length;
const PROCESSING_TICK_MS = 250;
// The bar never reaches 100% on time alone: past the visual duration it
// creeps asymptotically below this ceiling until the server really answers.
const PROCESSING_TIMED_CEILING = 0.92;
const PROCESSING_OVERTIME_CEILING = 0.97;
const PROCESSING_FINISH_HOLD_MS = 900;

function processingProgress(elapsedMs: number): number {
  if (elapsedMs <= PROCESSING_VISUAL_MS) {
    const x = elapsedMs / PROCESSING_VISUAL_MS;
    return PROCESSING_TIMED_CEILING * (1 - Math.pow(1 - x, 1.6));
  }
  const overtime = (elapsedMs - PROCESSING_VISUAL_MS) / 30_000;
  return PROCESSING_TIMED_CEILING
    + (PROCESSING_OVERTIME_CEILING - PROCESSING_TIMED_CEILING) * (1 - Math.exp(-overtime));
}

function SendingScreen({ isDone, onFinished }: { isDone: boolean; onFinished: () => void }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const id = window.setInterval(() => setElapsed(Date.now() - startedAt), PROCESSING_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  // Completion requires BOTH the full visual journey and the real server
  // outcome: an early backend never cuts the sequence short, a slow one is
  // never shown as finished before it actually is.
  // Monotonic: isDone never reverts and elapsed only grows.
  const completed = isDone && elapsed >= PROCESSING_VISUAL_MS;

  const onFinishedRef = useRef(onFinished);
  useEffect(() => { onFinishedRef.current = onFinished; }, [onFinished]);

  useEffect(() => {
    if (!completed) return;
    const id = window.setTimeout(() => onFinishedRef.current(), PROCESSING_FINISH_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [completed]);

  const progress = completed ? 1 : processingProgress(elapsed);
  const activePhase = completed
    ? PROCESSING_PHASES.length
    : Math.min(Math.floor(elapsed / PROCESSING_PHASE_MS), PROCESSING_PHASES.length - 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="w-full flex flex-col items-center justify-center text-center px-6 py-16 md:py-24"
    >
      <div className="w-full max-w-[460px]">
        <motion.div
          animate={completed ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
          transition={completed ? { duration: 0.4 } : { duration: 1.6, repeat: Infinity, ease: premiumEase }}
          className="w-2 h-2 rounded-full bg-brass mx-auto mb-8"
        />
        <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">Luxosa Test</span>
        <h2 className="font-serif text-[24px] md:text-[30px] font-light leading-[1.2] text-charcoal mb-10">
          Stiamo elaborando il tuo Luxosa Test
        </h2>

        <div
          className="h-[2px] bg-sand/40 w-full overflow-hidden"
          role="progressbar"
          aria-label="Elaborazione del Luxosa Test"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <motion.div
            className="h-full bg-brass"
            initial={{ width: '0%' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: completed ? 0.8 : PROCESSING_TICK_MS / 1000, ease: completed ? premiumEase : 'linear' }}
          />
        </div>

        <ul className="mt-10 space-y-4 text-left" aria-live="polite">
          {PROCESSING_PHASES.map((label, i) => {
            const isPast = i < activePhase;
            const isActive = i === activePhase;
            const isVisible = i <= activePhase;
            return (
              <motion.li
                key={label}
                initial={false}
                animate={{ opacity: isVisible ? 1 : 0.28, y: isVisible ? 0 : 4 }}
                transition={{ duration: 0.8, ease: premiumEase }}
                className="flex items-center gap-4"
              >
                <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  {isPast ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: premiumEase }}
                      className="w-5 h-5 rounded-full border border-brass/50 flex items-center justify-center text-brass"
                    >
                      <Check size={11} strokeWidth={1.5} />
                    </motion.span>
                  ) : isActive ? (
                    <motion.span
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: premiumEase }}
                      className="w-1.5 h-1.5 rounded-full bg-brass"
                    />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-sand" />
                  )}
                </span>
                <span
                  className={`text-[15px] leading-[1.6] font-light transition-colors duration-700 ${
                    isActive ? 'text-charcoal' : isPast ? 'text-anthracite/60' : 'text-anthracite/40'
                  }`}
                >
                  {label}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

// -- RESULT SCREEN ----------------------------------------------

function ResultScreen({
  nome,
  email,
  whatsapp,
  answers,
  onReset,
  dossierDelivered,
}: {
  nome: string;
  email: string;
  whatsapp: string;
  answers: Answers;
  onReset: () => void;
  dossierDelivered: boolean;
}) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<typeof LUXOSA_LOCATIONS[number]['id']>('messina-cavour');
  const [selectedFascia, setSelectedFascia] = useState<string | null>(null);
  const resultViewedTrackedRef = useRef(false);
  const {
    primary,
    secondary,
    percorsoPublic: pub,
    secondaryPublic: secondPub,
    attentionLevel: attention,
    percorsoName,
    conditionSummary,
    mainSignals,
    esperienze,
  } = buildLuxosaTestResult(answers);

  const ATTENTION_PRESENTATION: Record<AttentionLevel, { title: string; description: string; color: string }> = {
    ordinaria: {
      title: 'Attenzione ordinaria',
      description:
        'La situazione emersa non richiede una particolare priorità. La consulenza può aiutare a valorizzare ciò che funziona e a definire con maggiore precisione la direzione più adatta.',
      color: '#7D9471',
    },
    mirata: {
      title: 'Attenzione mirata',
      description:
        'Alcuni segnali meritano un approfondimento specifico, per comprendere meglio come intervenire e quali Esperienze possano essere più utili.',
      color: '#C08B4A',
    },
    prioritaria: {
      title: 'Attenzione prioritaria',
      description:
        'Più elementi emersi suggeriscono che sia importante approfondire la situazione con priorità in Maison, prima di definire la direzione più adatta.',
      color: '#A8574C',
    },
  };
  const ATTENTION_ORDER: AttentionLevel[] = ['ordinaria', 'mirata', 'prioritaria'];

  useEffect(() => {
    if (resultViewedTrackedRef.current) return;
    resultViewedTrackedRef.current = true;
    trackLuxosaTestEvent('luxosa_test_result_viewed', {
      percorso_public: pub,
      primary_area: primary,
      secondary_area: secondary,
      attention_level: attention,
      experiences_count: esperienze.length,
    });
  }, [attention, esperienze.length, primary, pub, secondary]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: premiumEase }}
      className="relative w-full"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src="/images/prima_consulenza.webp" alt="" className="w-full h-full object-cover opacity-[0.04] lg:opacity-[0.07]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/50 via-ivory/85 to-ivory" />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 md:px-10 py-10 md:py-14">

        {/* 1 — Apertura personalizzata */}
        <div className="mb-12 md:mb-16">
          <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">{t('test:diagnostic.takeover.273')}</span>
          <h2 className="font-serif text-[24px] md:text-[34px] font-light leading-[1.15] text-charcoal mb-6">
            {nome ? t('test:result.personalizedTitle', { nome }) :t('test:diagnostic.takeover.274')}
          </h2>
          <div className="border-l-[3px] border-brass pl-6">
            <p className="font-serif text-[38px] md:text-[50px] font-light leading-[1.05] text-charcoal">{percorsoName}</p>
          </div>
        </div>

        {/* 2 — Condizione di partenza */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">{t('test:diagnostic.takeover.275')}</span>
          <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/80 font-light">{conditionSummary}</p>
        </div>

        {/* 3 — Segnali principali */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-5">{t('test:diagnostic.takeover.276')}</span>
          <ul className="space-y-3">
            {mainSignals.map((signal, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: premiumEase }}
                className="flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brass/60 mt-[9px] flex-shrink-0" />
                <p className="text-[16px] md:text-[17px] leading-[1.75] text-anthracite/80 font-light">{signal}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 4 — Livello di attenzione */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-5">{t('test:diagnostic.takeover.277')}</span>

          <div className="flex gap-1.5 mb-5" aria-hidden="true">
            {ATTENTION_ORDER.map(level => (
              <span
                key={level}
                className="h-[4px] flex-1 rounded-full transition-opacity duration-500"
                style={{
                  backgroundColor: ATTENTION_PRESENTATION[level].color,
                  opacity: level === attention ? 1 : 0.16,
                }}
              />
            ))}
          </div>

          <h3 className="font-serif text-[21px] md:text-[25px] font-light leading-[1.25] text-charcoal mb-3">
            {ATTENTION_PRESENTATION[attention].title}
          </h3>
          <p className="text-[15px] md:text-[16px] leading-[1.8] text-anthracite/75 font-light max-w-xl">
            {ATTENTION_PRESENTATION[attention].description}
          </p>
        </div>

        {/* Conferma invio — sintesi sul sito, dossier completo via PDF email.
            dossierDelivered reflects the server's authoritative outcome
            (status === 'COMPLETED'); never shown as sent when it wasn't. */}
        <div className="mb-12 -mx-6 md:-mx-10 px-6 md:px-10 py-10 md:py-12 bg-ecru/25 border-t border-b border-sand/30 text-center">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">Luxosa Test</span>
          <h3 className="font-serif text-[26px] md:text-[32px] font-light leading-[1.2] text-charcoal mb-4">Il tuo Luxosa Test è pronto</h3>
          {dossierDelivered ? (
            <p className="text-[16px] md:text-[17px] leading-[1.8] text-anthracite/80 font-light max-w-lg mx-auto">
              Ti abbiamo appena inviato via email il tuo report personalizzato completo. Controlla la tua casella di posta e, se necessario, anche Spam o Promozioni.
            </p>
          ) : (
            <p className="text-[16px] md:text-[17px] leading-[1.8] text-anthracite/80 font-light max-w-lg mx-auto">
              Il tuo profilo è completo. Per un piccolo imprevisto tecnico non siamo ancora riusciti a recapitarti il report via email — nessun problema: puoi richiederlo subito qui sotto su WhatsApp, oppure la Maison te lo invierà a breve.
            </p>
          )}
        </div>

        {/* Percorso secondario */}
        {secondPub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-10 p-5 border border-brass/20 bg-brass/5"
          >
            <p className="text-[13px] leading-[1.75] text-anthracite/70 font-light">{t('test:diagnostic.takeover.286')}{' '}
              <strong className="text-charcoal/75 font-normal">{PUBLIC_PERCORSO_NAMES[secondPub]}</strong>{t('test:diagnostic.takeover.287')}</p>
          </motion.div>
        )}

        {/* CTA */}
        <div className="border-t border-sand/35 pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              trackLuxosaTestEvent('luxosa_test_contact_cta_clicked', {
                percorso_public: pub,
                attention_level: attention,
              });
              setShowTimePicker(true);
            }}
            className="relative overflow-hidden group inline-flex items-center gap-4 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5"
          >
            <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
            <span className="relative z-10 flex items-center gap-4">{t('test:diagnostic.takeover.288')}<ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
          <button
            onClick={onReset}
            className="text-[11px] tracking-[0.2em] uppercase font-light text-anthracite/50 border border-anthracite/15 px-8 py-5 hover:text-anthracite/85 hover:border-anthracite/25 transition-all duration-300"
          >{t('test:diagnostic.takeover.289')}</button>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-[11px] leading-[1.7] text-anthracite/43 font-light italic text-center max-w-xl mx-auto">
          {t('report:disclaimer')}
        </p>
      </div>

      {/* Time picker modal */}
      {showTimePicker && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-deep/70 backdrop-blur-sm"
            onClick={() => { setShowTimePicker(false); setSelectedFascia(null); }}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
            className="relative bg-ivory max-w-sm w-full px-8 py-10 shadow-2xl"
          >
            <p className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light mb-4">{t('test:diagnostic.takeover.290')}</p>

            {/* Sede */}
            <p className="text-[11px] tracking-[0.2em] uppercase text-anthracite/65 font-light mb-2">{t('test:diagnostic.takeover.291')}</p>
            <div className="relative mb-8">
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value as typeof LUXOSA_LOCATIONS[number]['id'])}
                className="w-full appearance-none px-5 py-3 border border-sand/60 bg-ivory text-[15px] font-light text-anthracite/95 focus:outline-none focus:border-brass/50 cursor-pointer"
              >
                {LUXOSA_LOCATIONS.map(l => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brass-muted text-[10px]">?</span>
            </div>

            <h3 className="font-serif text-[22px] font-light text-charcoal leading-snug mb-2">{t('test:diagnostic.takeover.292')}</h3>
            <div className="h-[1px] bg-sand/60 mb-8" />
            <div className="flex flex-col gap-3">
              {['09:00 – 11:00', '11:00 – 13:00', '13:00 – 15:00', '15:00 – 18:00', 'Indifferente'].map(fascia => (
                <button
                  key={fascia}
                  onClick={() => setSelectedFascia(fascia)}
                  className={`w-full text-left px-5 py-4 border text-[15px] font-light transition-all duration-300 ${
                    selectedFascia === fascia
                      ? 'border-brass/60 bg-ecru text-anthracite'
                      : 'border-sand/60 text-anthracite/85 hover:border-brass/40 hover:bg-ecru/40'
                  }`}
                >
                  {fascia}
                </button>
              ))}
            </div>

            <button
              disabled={!selectedFascia}
              onClick={() => {
                if (!selectedFascia) return;
                const location = LUXOSA_LOCATIONS.find(l => l.id === selectedLocationId)!;
                const msg = buildWhatsAppMessage(nome, email, whatsapp, selectedFascia, location.label, answers);
                const url = `https://wa.me/${location.whatsapp}?text=${encodeURIComponent(msg)}`;
                trackLuxosaTestEvent('luxosa_test_whatsapp_clicked', {
                  location_id: location.id,
                  time_slot: selectedFascia,
                  percorso_public: pub,
                  attention_level: attention,
                });
                window.open(url, '_blank', 'noopener,noreferrer');
                setShowTimePicker(false);
                setSelectedFascia(null);
              }}
              className={`mt-6 w-full py-4 text-[12px] tracking-[0.2em] uppercase font-light transition-all duration-300 ${
                selectedFascia
                  ? 'bg-charcoal text-ivory hover:bg-deep cursor-pointer'
                  : 'bg-sand/40 text-anthracite/45 cursor-not-allowed'
              }`}
            >{t('test:diagnostic.takeover.297')}</button>

            <button
              onClick={() => { setShowTimePicker(false); setSelectedFascia(null); }}
              className="mt-3 w-full text-center text-[11px] tracking-[0.2em] uppercase font-light text-anthracite/50 hover:text-anthracite/75 transition-colors duration-300"
            >{t('test:diagnostic.takeover.298')}</button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------

export function DiagnosticTakeover({ onReset }: { onReset: () => void }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const [screen, setScreen] = useState<Screen>('disclaimer');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contactData, setContactData] = useState<ContactFormData>({
    nome: '', cognome: '', email: '', whatsapp: '', privacyAcknowledged: false, marketingConsent: false,
  });
  // Whether the server confirmed the dossier was actually generated and
  // emailed (status === 'COMPLETED'). Only meaningful once screen==='result';
  // defaults to true so an impossible render order never shows the fallback.
  const [dossierDelivered, setDossierDelivered] = useState(true);
  // Server outcome of the submission; null while still in flight.
  const [submissionDelivered, setSubmissionDelivered] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackedStepsRef = useRef<Set<string>>(new Set());
  const questionsCompletedTrackedRef = useRef(false);

  const d3Answer = answers['d3'] as string | undefined;
  const questionSequence = useMemo(() => buildQuestionSequence(d3Answer), [d3Answer, language]);
  const currentQ = questionSequence[step] as QuestionDef | undefined;
  const totalSteps = questionSequence.length;
  const progressTotalSteps = 10;

  // Lock body scroll + scroll to top
  useEffect(() => {
    trackLuxosaTestEvent('luxosa_test_opened', {
      screen: 'disclaimer',
      source: 'unknown',
    });
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Scroll to top on step/screen change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [step, screen]);

  useEffect(() => {
    if (screen !== 'quiz' || !currentQ) return;
    const trackingKey = `${step}:${currentQ.id}`;
    if (trackedStepsRef.current.has(trackingKey)) return;
    trackedStepsRef.current.add(trackingKey);
    trackLuxosaTestEvent('luxosa_test_step_viewed', {
      step_number: step + 1,
      total_steps: totalSteps,
      question_id: currentQ.id,
      question_type: currentQ.selectionType,
      branch: getTrackingBranch(answers),
    });
  }, [answers, currentQ, screen, step, totalSteps]);

  // Transition quiz ? form when all questions answered
  useEffect(() => {
    if (screen === 'quiz' && step >= totalSteps) {
      if (!questionsCompletedTrackedRef.current) {
        questionsCompletedTrackedRef.current = true;
        trackLuxosaTestEvent('luxosa_test_questions_completed', {
          total_steps: totalSteps,
          branch: getTrackingBranch(answers),
          answered_count: getAnsweredCount(answers),
          has_d10_note: typeof answers['d10'] === 'string' && answers['d10'].trim().length > 0,
        });
      }
      setScreen('form');
    }
  }, [answers, step, totalSteps, screen]);

  const advanceStep = useCallback(() => setStep(s => s + 1), []);

  const handleSingleSelect = useCallback((qId: string, optId: string) => {
    trackLuxosaTestEvent('luxosa_test_answer_selected', {
      question_id: qId,
      option_id: optId,
      selection_type: 'single',
      selected_count: 1,
      action: 'select',
    });
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    setTimeout(advanceStep, 450);
  }, [advanceStep]);

  const handleMultiToggle = useCallback((qId: string, optId: string, max: number) => {
    const cur = (answers[qId] as string[] | undefined) ?? [];
    if (cur.includes(optId)) {
      const next = cur.filter(id => id !== optId);
      trackLuxosaTestEvent('luxosa_test_answer_selected', {
        question_id: qId,
        option_id: optId,
        selection_type: 'multi',
        selected_count: next.length,
        action: 'deselect',
      });
      setAnswers(prev => ({ ...prev, [qId]: next }));
      return;
    }
    if (cur.length >= max) return;
    const next = [...cur, optId];
    trackLuxosaTestEvent('luxosa_test_answer_selected', {
      question_id: qId,
      option_id: optId,
      selection_type: 'multi',
      selected_count: next.length,
      action: 'select',
    });
    setAnswers(prev => ({ ...prev, [qId]: next }));
  }, [answers]);

  const handleTextChange = useCallback((qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  }, []);

  const handleFormSubmit = useCallback((data: ContactFormData) => {
    setContactData(data);
    setSubmissionDelivered(null);
    setScreen('sending');

    const submissionId = crypto.randomUUID();
    const payload = {
      submissionId,
      testVersion: 'v2.0',
      language,
      answers,
      firstName: data.nome,
      lastName: data.cognome,
      email: data.email,
      phone: data.whatsapp,
      privacyAcknowledged: data.privacyAcknowledged,
      marketingConsent: data.marketingConsent,
    };

    // The server result is authoritative for PDF/GHL/email. The client-side
    // result (ResultScreen computing buildLuxosaTestResult itself) is always
    // shown — it is correct regardless of delivery — but the dossier
    // confirmation copy on that screen must reflect what actually happened
    // server-side (COMPLETED = dossier emailed) rather than assume success:
    // the "sending" screen stays up until we actually know. SendingScreen
    // owns the timing and calls handleProcessingFinished once both its
    // visual sequence and this outcome are done.
    fetch('/api/luxosa-test/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(outcome => {
        console.info('[luxosa-test] submission outcome:', outcome);
        return outcome?.status === 'COMPLETED';
      })
      .catch(err => {
        console.error('[luxosa-test] submission request failed:', err);
        return false;
      })
      .then(delivered => setSubmissionDelivered(delivered));
  }, [answers, language]);

  const handleProcessingFinished = useCallback(() => {
    setDossierDelivered(submissionDelivered === true);
    setScreen('result');
  }, [submissionDelivered]);

  const handleStartTest = useCallback(() => {
    trackLuxosaTestEvent('luxosa_test_started', {
      accepted_disclaimer: true,
    });
    setScreen('quiz');
  }, []);

  const handleClose = useCallback(() => {
    if (screen !== 'result') {
      trackLuxosaTestEvent('luxosa_test_abandoned', {
        screen,
        step_number: screen === 'quiz' ? step + 1 : null,
        question_id: screen === 'quiz' ? currentQ?.id ?? null : null,
        answered_count: getAnsweredCount(answers),
      });
    }
    onReset();
  }, [answers, currentQ, onReset, screen, step]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="fixed inset-0 z-[9999] bg-ivory flex flex-col overflow-hidden"
    >
      {/* -- HEADER -------------------------------------------- */}
      <div className="flex-shrink-0 bg-ivory border-b border-sand/40 h-[64px] md:h-[80px] w-full flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-10 flex items-center justify-between gap-4">

          {/* Left: logo + optional back */}
          <div className="w-28 md:w-40 flex items-center flex-shrink-0 gap-3">
            <img
              src="/images/luxosa-logo-orizzontale-bianco-tras.png"
              alt={t('test:diagnostic.takeover.299')}
              className="h-5 md:h-6 w-auto object-contain brightness-0"
            />
            {screen === 'quiz' && step > 0 && (
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                className="flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-charcoal/40 hover:text-charcoal transition-colors group outline-none"
              >
                <ArrowLeft size={14} strokeWidth={1} className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="hidden sm:inline font-light">{t('test:diagnostic.takeover.300')}</span>
              </button>
            )}
          </div>

          {/* Center: progress or label */}
          <div className="flex-1 min-w-0 flex justify-center">
            {screen === 'quiz' && currentQ ? (
              <div className="w-full max-w-[400px]">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[9px] tracking-[0.25em] uppercase text-brass font-bold">{t('test:diagnostic.takeover.301')}</span>
                  <span className="text-[9px] text-charcoal/30 font-light italic hidden sm:block">{currentQ.label}</span>
                </div>
                <div className="h-[2px] bg-sand/30 w-full">
                  <motion.div
                    className="h-full bg-brass"
                    animate={{ width: `${((step + 1) / progressTotalSteps) * 100}%` }}
                    transition={{ duration: 0.6, ease: premiumEase }}
                  />
                </div>
                <p className="text-[8px] text-anthracite/40 font-light mt-1">{step + 1} {t('test:diagnostic.takeover.309')} {progressTotalSteps}</p>
              </div>
            ) : (
              <span className="text-[10px] tracking-[0.4em] uppercase font-light text-anthracite/50">
                {screen === 'result' ?t('test:diagnostic.takeover.302') : screen === 'form' ?t('test:diagnostic.takeover.303') : screen === 'sending' ? 'Un istante…' : ''}
              </span>
            )}
          </div>

          {/* Right: close */}
          <div className="w-20 md:w-32 flex justify-end flex-shrink-0">
            <button
              onClick={handleClose}
              aria-label={t('test:diagnostic.takeover.304')}
              className="group flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-anthracite/45 hover:text-anthracite transition-colors duration-300 outline-none"
            >
              <span className="hidden sm:inline font-light">{t('test:diagnostic.takeover.305')}</span>
              <div className="w-8 h-8 border border-sand/60 rounded-full flex items-center justify-center group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-ivory transition-all duration-400">
                <X size={14} strokeWidth={1} />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* -- SCROLLABLE CONTENT -------------------------------- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-ivory">
        <AnimatePresence mode="wait">
          {screen === 'disclaimer' && (
            <DisclaimerScreen key="disclaimer" onAccept={handleStartTest} />
          )}

          {screen === 'quiz' && currentQ && (
            <QuizContent
              key={`quiz-${step}`}
              q={currentQ}
              answers={answers}
              onSingleSelect={handleSingleSelect}
              onMultiToggle={handleMultiToggle}
              onTextChange={handleTextChange}
              onContinue={advanceStep}
            />
          )}

          {screen === 'form' && (
            <FormScreen key="form" onSubmit={handleFormSubmit} />
          )}

          {screen === 'sending' && (
            <SendingScreen
              key="sending"
              isDone={submissionDelivered !== null}
              onFinished={handleProcessingFinished}
            />
          )}

          {screen === 'result' && (
            <ResultScreen
              key="result"
              nome={contactData.nome}
              email={contactData.email}
              whatsapp={contactData.whatsapp}
              answers={answers}
              onReset={onReset}
              dossierDelivered={dossierDelivered}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
