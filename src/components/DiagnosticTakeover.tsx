// ═══════════════════════════════════════════════════════════════
// LUXOSA — LUXOSA TEST v2.0
// Quiz orientativo fullscreen — 10-12 domande con ramificazione
// ═══════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X, Check } from 'lucide-react';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import type { Value as PhoneValue } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// ── TYPES ──────────────────────────────────────────────────────

type Percorso = 'cute' | 'rinascita' | 'colore' | 'armonia' | 'rituale';
type Scores = Record<Percorso, number>;
type Screen = 'disclaimer' | 'quiz' | 'form' | 'result';
type BranchKey = 'cute' | 'struttura' | 'colore' | 'forma' | 'completo';
type Answers = Record<string, string | string[]>;
type PublicPercorso = 'benessere' | 'colorlux' | 'rituale';
type AttentionLevel = 'ordinaria' | 'mirata' | 'prioritaria';

interface OptionDef {
  id: string;
  text: string;
  subtext?: string;
  scores: Partial<Scores>;
  image?: string;
}

interface QuestionDef {
  id: string;
  label: string;
  question: string;
  subtitle?: string;
  selectionType: 'single' | 'multi' | 'text';
  maxSelections?: number;
  options: OptionDef[];
}

interface EsperienzaDef {
  nome: string;
  sottotitolo: string;
}

interface ContactFormData {
  nome: string;
  email: string;
  whatsapp: string;
}

// ── CONSTANTS ──────────────────────────────────────────────────

import { premiumEase } from '../lib/animations';

const MAX_SCORES: Scores = {
  cute: 19,
  rinascita: 17,
  colore: 15,
  armonia: 15,
  rituale: 20,
};

// ── OPTION IMAGES ─────────────────────────────────────────────
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

const REPORT_DISCLAIMER = "Questo orientamento ha valore preliminare e personalizzato sulla base delle risposte fornite. Il percorso, le Esperienze suggerite e le eventuali priorità saranno confermati solo durante la Consulenza Luxosa in presenza, dopo l'osservazione diretta di cute, fibra, colore, forma e obiettivi personali.";

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

// ── FASE 1: CONOSCENZA (comuni a tutte) ────────────────────────

const questionPhase1: QuestionDef[] = [
  {
    id: 'd1',
    label: 'Tipo di capello',
    question: 'I tuoi capelli naturali sono…',
    selectionType: 'single',
    options: [
      { id: 'd1_lisci', text: 'Lisci', scores: { rinascita: 1, colore: 1 } },
      { id: 'd1_mossi', text: 'Mossi', scores: { rinascita: 1, colore: 1 } },
      { id: 'd1_ricci', text: 'Ricci', scores: { armonia: 2 } },
      { id: 'd1_molto_ricci', text: 'Molto ricci', scores: { armonia: 2 } },
    ],
  },
  {
    id: 'd2',
    label: 'Stato attuale',
    question: 'Come li descriveresti oggi?',
    subtitle: 'Seleziona fino a 2 risposte',
    selectionType: 'multi',
    maxSelections: 2,
    options: [
      { id: 'd2_fragili', text: 'Fragili / Danneggiati', subtext: 'Si spezzano, mancano di resistenza', scores: { rinascita: 2 } },
      { id: 'd2_crespi', text: 'Crespi / Difficili da gestire', subtext: 'Difficili da disciplinare', scores: { armonia: 1 } },
      { id: 'd2_sottili', text: 'Sottili / Con poca densità', subtext: 'Mancano di corpo e volume', scores: { cute: 2 } },
      { id: 'd2_grassi', text: 'Grassi alla radice', subtext: 'Radici oleose, lavaggi frequenti', scores: { cute: 2 } },
      { id: 'd2_secchi', text: 'Secchi / Opachi', subtext: 'Spenti, privi di idratazione', scores: { rinascita: 1, colore: 1 } },
      { id: 'd2_sani', text: 'Sani ma senza carattere', subtext: 'Cerco un livello superiore di cura', scores: { armonia: 1, rituale: 1 } },
    ],
  },
  {
    id: 'd3',
    label: 'Priorità principale',
    question: 'Qual è la cosa che ti preoccupa di più?',
    subtitle: 'La risposta guida il tuo percorso.',
    selectionType: 'single',
    options: [
      { id: 'd3_cute', text: 'La salute della mia cute', subtext: 'Prurito, desquamazione, eccesso di sebo, sensibilità', scores: { cute: 3 } },
      { id: 'd3_rovinato', text: 'Il mio capello è rovinato', subtext: 'Danni da trattamenti, fragilità, rottura, secchezza', scores: { rinascita: 3 } },
      { id: 'd3_colore', text: 'Il colore non mi soddisfa', subtext: 'Colore spento, ossidato, non uniforme, grigi', scores: { colore: 3 } },
      { id: 'd3_forma', text: 'Non trovo la forma giusta', subtext: 'Volume, ricci, piega, styling che non tiene', scores: { armonia: 3 } },
      { id: 'd3_tutto', text: 'Voglio prendermi cura di tutto', subtext: 'Esigenza globale, trasformazione completa', scores: { rituale: 3 } },
    ],
  },
];

// ── FASE 2: APPROFONDIMENTO (ramificato) ───────────────────────

const questionBranches: Record<BranchKey, QuestionDef[]> = {
  cute: [
    {
      id: 'd4a',
      label: 'Sintomi cute',
      question: 'Cosa noti sulla tua cute?',
      subtitle: 'Seleziona fino a 2 risposte',
      selectionType: 'multi',
      maxSelections: 2,
      options: [
        { id: 'd4a_prurito', text: 'Prurito frequente', scores: { cute: 1 } },
        { id: 'd4a_desquamazione', text: 'Desquamazione / forfora', scores: { cute: 1 } },
        { id: 'd4a_grassa', text: 'Cute grassa / eccesso di sebo', scores: { cute: 1 } },
        { id: 'd4a_rossori', text: 'Rossori o irritazione', scores: { cute: 1 } },
        { id: 'd4a_tira', text: 'Sensazione di cute «che tira»', scores: { cute: 1 } },
      ],
    },
    {
      id: 'd5a',
      label: 'Durata',
      question: 'Da quanto tempo noti questi fastidi?',
      selectionType: 'single',
      options: [
        { id: 'd5a_settimane', text: 'Da poche settimane', scores: {} },
        { id: 'd5a_mesi', text: 'Da qualche mese', scores: { cute: 1 } },
        { id: 'd5a_anno', text: 'Da più di un anno', scores: { cute: 2, rituale: 1 } },
        { id: 'd5a_sempre', text: 'Da sempre', scores: { cute: 2, rituale: 1 } },
      ],
    },
    {
      id: 'd6a',
      label: 'Trattamenti precedenti',
      question: 'Hai già provato trattamenti specifici per la cute?',
      selectionType: 'single',
      options: [
        { id: 'd6a_mai', text: 'No, non ho mai affrontato il problema', scores: {} },
        { id: 'd6a_prodotti', text: 'Sì, con prodotti da farmacia/supermercato', scores: { cute: 1 } },
        { id: 'd6a_salone', text: 'Sì, in un salone', scores: { cute: 2 } },
        { id: 'd6a_dermatologo', text: 'Sì, da un dermatologo', scores: { cute: 1 } },
      ],
    },
    {
      id: 'd7a',
      label: 'Densità',
      question: 'Noti anche problemi di densità o diradamento?',
      selectionType: 'single',
      options: [
        { id: 'd7a_no', text: 'No', scores: {} },
        { id: 'd7a_lieve', text: 'Leggermente, in alcune zone', scores: { cute: 1 } },
        { id: 'd7a_evidente', text: 'Sì, in modo evidente', scores: { cute: 2, rituale: 1 } },
      ],
    },
  ],

  struttura: [
    {
      id: 'd4b',
      label: 'Trattamenti subiti',
      question: 'Cosa ha subito il tuo capello?',
      subtitle: 'Seleziona fino a 3 risposte',
      selectionType: 'multi',
      maxSelections: 3,
      options: [
        { id: 'd4b_colorazioni', text: 'Colorazioni frequenti', scores: { rinascita: 1 } },
        { id: 'd4b_decolorazioni', text: 'Decolorazioni / schiariture', scores: { rinascita: 1 } },
        { id: 'd4b_stiratura', text: 'Stiratura chimica', scores: { rinascita: 1 } },
        { id: 'd4b_calore', text: 'Piastra o phon ad alta temperatura', scores: { rinascita: 1 } },
        { id: 'd4b_aggressivi', text: 'Trattamenti aggressivi in altri saloni', scores: { rinascita: 1 } },
      ],
    },
    {
      id: 'd5b',
      label: 'Stato punte',
      question: 'Come sono le tue punte?',
      selectionType: 'single',
      options: [
        { id: 'd5b_sane', text: 'Sane e chiuse', scores: {} },
        { id: 'd5b_aperte', text: 'Leggermente aperte', scores: { rinascita: 1 } },
        { id: 'd5b_spezzano', text: 'Molto aperte, si spezzano', scores: { rinascita: 2 } },
      ],
    },
    {
      id: 'd6b',
      label: 'Tatto',
      question: 'Come senti il tuo capello al tatto?',
      selectionType: 'single',
      options: [
        { id: 'd6b_morbido', text: 'Morbido e scorrevole', scores: {} },
        { id: 'd6b_ruvido', text: 'Ruvido o poroso', scores: { rinascita: 1 } },
        { id: 'd6b_secco', text: 'Secco e fragile', scores: { rinascita: 2 } },
        { id: 'd6b_paglia', text: '«Di paglia», senza vita', scores: { rinascita: 3, rituale: 1 } },
      ],
    },
    {
      id: 'd7b',
      label: 'Obiettivo struttura',
      question: 'Cosa vorresti ottenere?',
      selectionType: 'single',
      options: [
        { id: 'd7b_morbidezza', text: 'Ritrovare morbidezza e lucentezza', scores: { rinascita: 1 } },
        { id: 'd7b_rinforzare', text: 'Rinforzare e fermare la rottura', scores: { rinascita: 2 } },
        { id: 'd7b_ricominciare', text: 'Ricominciare da zero con un percorso completo', scores: { rinascita: 2, rituale: 2 } },
      ],
    },
  ],

  colore: [
    {
      id: 'd4c',
      label: 'Situazione colore',
      question: 'Qual è la tua situazione attuale con il colore?',
      selectionType: 'single',
      options: [
        { id: 'd4c_naturale', text: 'Porto il mio colore naturale', scores: { colore: 1 } },
        { id: 'd4c_tinta', text: 'Faccio la tinta regolarmente', scores: { colore: 2 } },
        { id: 'd4c_decolorazioni', text: 'Ho decolorazioni o colpi di sole', scores: { colore: 2, rinascita: 1 } },
        { id: 'd4c_grigi_coprire', text: 'Ho i capelli grigi e li copro', scores: { colore: 2 } },
        { id: 'd4c_grigi_valorizzare', text: 'Ho i capelli grigi e vorrei valorizzarli', scores: { colore: 2, armonia: 1 } },
      ],
    },
    {
      id: 'd5c',
      label: 'Problema colore',
      question: 'Cosa non ti convince del tuo colore attuale?',
      subtitle: 'Seleziona fino a 2 risposte',
      selectionType: 'multi',
      maxSelections: 2,
      options: [
        { id: 'd5c_spegne', text: 'Si spegne troppo in fretta', scores: { colore: 1 } },
        { id: 'd5c_luminoso', text: 'Non è luminoso come vorrei', scores: { colore: 1 } },
        { id: 'd5c_uniforme', text: 'Non è uniforme', scores: { colore: 1 } },
        { id: 'd5c_viso', text: 'Non valorizza il mio viso', scores: { colore: 1, armonia: 1 } },
        { id: 'd5c_danneggia', text: 'Danneggia il capello', scores: { colore: 1, rinascita: 2 } },
      ],
    },
    {
      id: 'd6c',
      label: 'Frequenza colore',
      question: 'Quanto spesso colori i capelli?',
      selectionType: 'single',
      options: [
        { id: 'd6c_frequente', text: 'Ogni 3-4 settimane', scores: { colore: 2, rinascita: 1 } },
        { id: 'd6c_normale', text: 'Ogni 6-8 settimane', scores: { colore: 1 } },
        { id: 'd6c_raro', text: 'Ogni 3+ mesi', scores: {} },
        { id: 'd6c_mai', text: 'Raramente o mai', scores: {} },
      ],
    },
    {
      id: 'd7c',
      label: 'Obiettivo colore',
      question: 'Cosa cerchi nel colore ideale?',
      selectionType: 'single',
      options: [
        { id: 'd7c_naturalezza', text: 'Naturalezza e armonia con il mio incarnato', scores: { colore: 1 } },
        { id: 'd7c_luminosita', text: 'Luminosità e dimensione', scores: { colore: 2 } },
        { id: 'd7c_copertura', text: 'Copertura perfetta dei grigi', scores: { colore: 1 } },
        { id: 'd7c_cambiamento', text: 'Un cambiamento deciso', scores: { colore: 1, rituale: 1 } },
        { id: 'd7c_bianco', text: 'Accompagnare il passaggio al bianco o rendere la ricrescita meno visibile', scores: { colore: 2 } },
      ],
    },
  ],

  forma: [
    {
      id: 'd4d',
      label: 'Difficoltà principale',
      question: 'Qual è la tua difficoltà principale?',
      selectionType: 'single',
      options: [
        { id: 'd4d_volume', text: 'Il volume — ne ho troppo o troppo poco', scores: { armonia: 2 } },
        { id: 'd4d_ricci', text: 'I ricci non sono definiti come vorrei', scores: { armonia: 2 } },
        { id: 'd4d_piega', text: 'La piega non tiene mai', scores: { armonia: 1 } },
        { id: 'd4d_taglio', text: 'Non so quale taglio mi valorizzi davvero', scores: { armonia: 1, rituale: 1 } },
      ],
    },
    {
      id: 'd5d',
      label: 'Tempo quotidiano',
      question: 'Quanto tempo dedichi ai capelli ogni mattina?',
      selectionType: 'single',
      options: [
        { id: 'd5d_poco', text: 'Meno di 5 minuti', scores: { armonia: 1 } },
        { id: 'd5d_medio', text: '5-15 minuti', scores: {} },
        { id: 'd5d_molto', text: 'Più di 15 minuti', scores: { armonia: 1, rituale: 1 } },
        { id: 'd5d_troppo', text: 'Troppo, e vorrei dedicarne meno', scores: { armonia: 1, rituale: 1 } },
      ],
    },
    {
      id: 'd6d',
      label: 'Strumenti a caldo',
      question: 'Usi strumenti a caldo (piastra, arricciacapelli, phon)?',
      selectionType: 'single',
      options: [
        { id: 'd6d_mai', text: 'Mai o raramente', scores: {} },
        { id: 'd6d_qualche', text: 'Qualche volta a settimana', scores: { rinascita: 1 } },
        { id: 'd6d_sempre', text: 'Quasi ogni giorno', scores: { rinascita: 2, armonia: 1 } },
      ],
    },
    {
      id: 'd7d',
      label: 'Sensazione desiderata',
      question: 'Come vorresti sentire i tuoi capelli?',
      selectionType: 'single',
      options: [
        { id: 'd7d_liberi', text: 'Liberi e naturali, con la loro forma vera', scores: { armonia: 2 } },
        { id: 'd7d_disciplinati', text: 'Disciplinati e sotto controllo', scores: { armonia: 1 } },
        { id: 'd7d_voluminosi', text: 'Voluminosi e pieni di vita', scores: { armonia: 1 } },
        { id: 'd7d_scoprire', text: 'Vorrei scoprirlo con una professionista', scores: { armonia: 1, rituale: 2 } },
      ],
    },
  ],

  completo: [
    {
      id: 'd4e',
      label: 'Prima priorità',
      question: 'Se dovessi dare una priorità, cosa viene prima?',
      selectionType: 'single',
      options: [
        { id: 'd4e_cute', text: 'La salute della cute e delle radici', scores: { rituale: 2, cute: 1 } },
        { id: 'd4e_capello', text: 'La qualità e la forza del capello', scores: { rituale: 2, rinascita: 1 } },
        { id: 'd4e_colore', text: 'Il colore giusto per me', scores: { rituale: 2, colore: 1 } },
        { id: 'd4e_forma', text: 'La forma e il volume', scores: { rituale: 2, armonia: 1 } },
        { id: 'd4e_nonso', text: 'Non saprei, vorrei un parere professionale', scores: { rituale: 3 } },
      ],
    },
    {
      id: 'd5e',
      label: 'Situazione attuale',
      question: 'Hai già un salone di fiducia o stai cercando?',
      selectionType: 'single',
      options: [
        { id: 'd5e_cercando', text: 'Sto cercando, non ho trovato il posto giusto', scores: { rituale: 1 } },
        { id: 'd5e_insoddisfatta', text: 'Ho un salone ma non sono soddisfatta', scores: { rituale: 1 } },
        { id: 'd5e_prima', text: 'È la prima volta che cerco un percorso serio', scores: { rituale: 1 } },
      ],
    },
    {
      id: 'd6e',
      label: 'Aspettative',
      question: 'Cosa ti aspetti da un percorso di cura?',
      selectionType: 'single',
      options: [
        { id: 'd6e_risultati', text: 'Risultati visibili e duraturi', scores: { rituale: 1 } },
        { id: 'd6e_presa', text: 'Qualcuno che mi prenda in carico davvero', scores: { rituale: 2 } },
        { id: 'd6e_capire', text: 'Capire finalmente cosa serve al mio capello', scores: { rituale: 1 } },
        { id: 'd6e_tutto', text: 'Tutte queste cose insieme', scores: { rituale: 3 } },
      ],
    },
    {
      id: 'd7e',
      label: 'Continuità',
      question: 'Saresti disposta a seguire un percorso di più sedute nel tempo?',
      selectionType: 'single',
      options: [
        { id: 'd7e_se_funziona', text: 'Sì, se vedo che funziona', scores: { rituale: 1 } },
        { id: 'd7e_continuita', text: "Sì, mi piace l'idea di continuità", scores: { rituale: 1 } },
        { id: 'd7e_valutare', text: 'Preferisco valutare dopo il primo incontro', scores: { rituale: 1 } },
      ],
    },
  ],
};

// ── FASE 3: STILE DI VITA ──────────────────────────────────────

const questionPhase3: QuestionDef[] = [
  {
    id: 'd8',
    label: 'Frequenza lavaggio',
    question: 'Ogni quanto lavi i capelli?',
    selectionType: 'single',
    options: [
      { id: 'd8_ogni_giorno', text: 'Ogni giorno', scores: { cute: 1 } },
      { id: 'd8_2_3', text: 'Ogni 2-3 giorni', scores: {} },
      { id: 'd8_settimana', text: 'Una volta a settimana', scores: {} },
      { id: 'd8_meno', text: 'Meno di una volta a settimana', scores: { cute: 1 } },
    ],
  },
  {
    id: 'd9',
    label: 'Rapporto con i capelli',
    question: 'Come descriveresti il tuo rapporto con i tuoi capelli?',
    selectionType: 'single',
    options: [
      { id: 'd9_amo', text: 'Li amo, ma vorrei valorizzarli di più', scores: { armonia: 1 } },
      { id: 'd9_non_piacciono', text: 'Non mi piacciono, li sopporto', scores: { rituale: 1 } },
      { id: 'd9_trascuro', text: 'Li trascuro perché non so come prendermene cura', scores: { rituale: 1, cute: 1 } },
      { id: 'd9_ci_lavoro', text: 'Ci sto lavorando, ma mi serve aiuto', scores: { rituale: 1 } },
    ],
  },
];

// ── D10: SPAZIO LIBERO ─────────────────────────────────────────

const questionD10: QuestionDef = {
  id: 'd10',
  label: 'Spazio libero',
  question: "C'è qualcosa che vorresti raccontarci prima del nostro primo incontro?",
  subtitle: 'Uno spazio libero, tutto tuo. Facoltativo.',
  selectionType: 'text',
  options: [],
};

// ── HELPERS ────────────────────────────────────────────────────

function getBranchKey(d3: string): BranchKey {
  const map: Record<string, BranchKey> = {
    d3_cute: 'cute',
    d3_rovinato: 'struttura',
    d3_colore: 'colore',
    d3_forma: 'forma',
    d3_tutto: 'completo',
  };
  return map[d3] ?? 'completo';
}

function buildQuestionSequence(d3Answer: string | undefined): QuestionDef[] {
  if (!d3Answer) return questionPhase1;
  return [
    ...questionPhase1,
    ...questionBranches[getBranchKey(d3Answer)],
    ...questionPhase3,
    questionD10,
  ];
}

function computeScores(answers: Answers, sequence: QuestionDef[]): Scores {
  const scores: Scores = { cute: 0, rinascita: 0, colore: 0, armonia: 0, rituale: 0 };

  for (const q of sequence) {
    if (q.selectionType === 'text') continue;
    const ans = answers[q.id];
    if (!ans) continue;
    const selected = Array.isArray(ans) ? ans : [ans];
    for (const optId of selected) {
      const opt = q.options.find(o => o.id === optId);
      if (!opt) continue;
      for (const [k, v] of Object.entries(opt.scores)) {
        if (v !== undefined) scores[k as Percorso] += v;
      }
    }
  }

  // Bonus: D4a ≥2 risposte → +1 cute
  const d4a = answers['d4a'];
  if (Array.isArray(d4a) && d4a.length >= 2) scores.cute += 1;

  // Bonus: D4b decolorazioni+stiratura → +1 rinascita; ≥3 → +1 rituale
  const d4b = answers['d4b'];
  if (Array.isArray(d4b)) {
    if (d4b.includes('d4b_decolorazioni') && d4b.includes('d4b_stiratura')) scores.rinascita += 1;
    if (d4b.length >= 3) scores.rituale += 1;
  }

  return scores;
}

function getPercorsoResult(scores: Scores): {
  primary: Percorso;
  secondary: Percorso | null;
  primaryPct: number;
  secondaryPct: number;
} {
  const entries = (Object.entries(scores) as [Percorso, number][]).sort((a, b) => b[1] - a[1]);
  const [first, second] = entries;
  const primary = first[0];
  const primaryPct = first[1] > 0 ? Math.min(Math.round((first[1] / MAX_SCORES[primary]) * 100), 99) : 0;

  // Soglie qualitative per il percorso secondario — basate su segnali reali dell'area
  const SECONDARY_THRESHOLDS: Record<Percorso, number> = {
    cute: 3,
    rinascita: 3,
    colore: 3,
    armonia: 3,
    rituale: 4,
  };

  let secondary: Percorso | null = null;
  let secondaryPct = 0;
  if (second && second[0] !== primary && second[1] >= SECONDARY_THRESHOLDS[second[0]]) {
    secondary = second[0];
    secondaryPct = Math.min(Math.round((second[1] / MAX_SCORES[second[0]]) * 100), 99);
  }
  return { primary, secondary, primaryPct, secondaryPct };
}

// ── ESPERIENZE UFFICIALI (9) ────────────────────────────────────

const ES: Record<string, EsperienzaDef> = {
  consulenzeSpecialistiche: { nome: 'Consulenze Specialistiche', sottotitolo: 'Il primo incontro — ascolto, lettura, direzione.' },
  areaBenessere: { nome: 'Area Benessere', sottotitolo: 'Quando la cura della cute diventa un rituale.' },
  cheratinaNutrizionePro: { nome: 'Cheratina Nutrizione Pro', sottotitolo: 'Ordine, morbidezza e resistenza duratura.' },
  piegaLux: { nome: 'PiegaLux', sottotitolo: 'Il gesto che conclude ogni percorso.' },
  taglioSignature: { nome: 'Taglio Signature', sottotitolo: 'Un taglio costruito sulla morfologia, non su una formula.' },
  nuances: { nome: 'Nuances', sottotitolo: 'Il colore nella sua espressione più raffinata.' },
  luceSignature: { nome: 'Luce Signature', sottotitolo: 'Schiariture costruite con precisione e rispetto della fibra.' },
  ricciOsa: { nome: 'RicciOsa', sottotitolo: "L'esperienza dedicata al capello riccio autentico." },
  ricciOso: { nome: 'RicciOso', sottotitolo: 'Il taglio costruito sulla morfologia del capello riccio.' },
};

// ── MAPPING PUBBLICO ────────────────────────────────────────────

const PUBLIC_PERCORSO_NAMES: Record<PublicPercorso, string> = {
  benessere: 'BenEssere',
  colorlux: 'ColorLux',
  rituale: 'Rituale Luxosa',
};

function getPublicPercorso(primary: Percorso, scores: Scores): PublicPercorso {
  if (primary === 'cute' || primary === 'rinascita') return 'benessere';
  if (primary === 'colore') return 'colorlux';
  if (primary === 'rituale') return 'rituale';
  // primary === 'armonia': default BenEssere; Rituale solo se segnali di complessità multi-area forti
  if (scores.rituale >= 4) return 'rituale';
  return 'benessere';
}

function getSecondaryPublic(primary: Percorso, secondary: Percorso | null, scores: Scores): PublicPercorso | null {
  if (!secondary) return null;
  const primaryPub = getPublicPercorso(primary, scores);
  const secondPub = getPublicPercorso(secondary, scores);
  if (secondPub === primaryPub) return null;
  return secondPub;
}

// ── LIVELLO DI ATTENZIONE ───────────────────────────────────────

function getAttentionLevel(answers: Answers, primary: Percorso): AttentionLevel {
  let score = 0;
  const d3 = answers['d3'] as string | undefined;
  const branch = d3 ? getBranchKey(d3) : 'completo';

  if (branch === 'cute') {
    const d5a = answers['d5a'] as string | undefined;
    if (d5a === 'd5a_sempre' || d5a === 'd5a_anno') score += 2;
    else if (d5a === 'd5a_mesi') score += 1;
    const d4a = answers['d4a'];
    if (Array.isArray(d4a) && d4a.length >= 2) score += 1;
  } else if (branch === 'struttura') {
    const d5b = answers['d5b'] as string | undefined;
    if (d5b === 'd5b_spezzano') score += 2;
    else if (d5b === 'd5b_aperte') score += 1;
    const d7b = answers['d7b'] as string | undefined;
    if (d7b === 'd7b_ricominciare') score += 1;
    const d4b = answers['d4b'];
    if (Array.isArray(d4b) && d4b.length >= 3) score += 1;
  } else if (branch === 'colore') {
    const d6c = answers['d6c'] as string | undefined;
    if (d6c === 'd6c_frequente') score += 1;
    const d5c = answers['d5c'];
    if (Array.isArray(d5c) && d5c.includes('d5c_danneggia')) score += 1;
  } else if (branch === 'forma') {
    const d5d = answers['d5d'] as string | undefined;
    if (d5d === 'd5d_troppo') score += 1;
    const d6d = answers['d6d'] as string | undefined;
    if (d6d === 'd6d_sempre') score += 1;
  } else {
    const d5e = answers['d5e'] as string | undefined;
    if (d5e === 'd5e_insoddisfatta' || d5e === 'd5e_prima') score += 2;
    const d6e = answers['d6e'] as string | undefined;
    if (d6e === 'd6e_tutto') score += 1;
    score += 1;
  }

  const d9 = answers['d9'] as string | undefined;
  if (d9 === 'd9_non_piacciono') score += 2;
  else if (d9 === 'd9_trascuro') score += 1;

  const d10 = answers['d10'] as string | undefined;
  if (d10 && d10.trim().length > 30) score += 1;
  if (d10 && d10.trim().length > 100) score += 1;

  if (primary === 'rituale') score += 1;

  if (score >= 4) return 'prioritaria';
  if (score >= 2) return 'mirata';
  return 'ordinaria';
}

// ── CONDIZIONE DI PARTENZA ──────────────────────────────────────

function buildConditionSummary(answers: Answers, _primary: Percorso): string {
  const d1 = answers['d1'] as string | undefined;
  const d2 = answers['d2'];
  const d3 = answers['d3'] as string | undefined;
  const d8 = answers['d8'] as string | undefined;
  const d9 = answers['d9'] as string | undefined;

  const tipoMap: Record<string, string> = {
    d1_lisci: 'lisci', d1_mossi: 'mossi',
    d1_ricci: 'ricci', d1_molto_ricci: 'molto ricci',
  };
  const tipo = d1 ? (tipoMap[d1] ?? 'nella loro struttura naturale') : 'nella loro struttura naturale';

  const statoLabels: Record<string, string> = {
    d2_fragili: 'fragili e con scarsa resistenza',
    d2_crespi: 'difficili da gestire per via della crespa',
    d2_sottili: 'sottili e con poco volume',
    d2_grassi: 'con tendenza alla radice grassa',
    d2_secchi: 'secchi e opachi',
    d2_sani: 'in buona salute, ma con margine di miglioramento',
  };
  const d2arr = Array.isArray(d2) ? d2 : d2 ? [d2] : [];
  let statoDesc = d2arr.map(id => statoLabels[id] ?? '').filter(Boolean).join(' e ');
  // Evita contraddizione: "in buona salute" + danno da colore rilevato in d5c
  const d5cForCond = answers['d5c'];
  const d5cArrForCond = Array.isArray(d5cForCond) ? (d5cForCond as string[]) : d5cForCond ? [d5cForCond as string] : [];
  if (d3 && getBranchKey(d3) === 'colore' && d5cArrForCond.includes('d5c_danneggia') && d2arr.includes('d2_sani')) {
    statoDesc = 'con una base ancora ordinata, ma con attenzione alla fibra dalla storia colore';
  }

  const lavaggio: Record<string, string> = {
    d8_ogni_giorno: 'ogni giorno', d8_2_3: 'ogni 2–3 giorni',
    d8_settimana: 'una volta a settimana', d8_meno: 'meno di una volta a settimana',
  };
  const lavaggioDesc = d8 ? (lavaggio[d8] ?? '') : '';

  const branch = d3 ? getBranchKey(d3) : 'completo';
  let specificPart = '';

  if (branch === 'cute') {
    const d4a = answers['d4a'];
    const d4aArr = Array.isArray(d4a) ? d4a : d4a ? [d4a] : [];
    const sintoMap: Record<string, string> = {
      d4a_prurito: 'prurito', d4a_desquamazione: 'desquamazione',
      d4a_grassa: 'eccesso di sebo', d4a_rossori: 'rossori', d4a_tira: 'cute che tira',
    };
    const sintomi = d4aArr.map(id => sintoMap[id] ?? '').filter(Boolean).join(', ');
    const d5a = answers['d5a'] as string | undefined;
    const durataMap: Record<string, string> = {
      d5a_settimane: 'da poche settimane', d5a_mesi: 'da qualche mese',
      d5a_anno: 'da più di un anno', d5a_sempre: 'da sempre',
    };
    const durata = d5a ? (durataMap[d5a] ?? '') : '';
    specificPart = `La priorità dichiarata è la cute${sintomi ? ` — ${sintomi}` : ''}${durata ? `, presenti ${durata}` : ''}.`;
  } else if (branch === 'struttura') {
    const d4b = answers['d4b'];
    const d4bArr = Array.isArray(d4b) ? d4b : d4b ? [d4b] : [];
    const trattMap: Record<string, string> = {
      d4b_colorazioni: 'colorazioni', d4b_decolorazioni: 'decolorazioni',
      d4b_stiratura: 'stirature', d4b_calore: 'calore frequente', d4b_aggressivi: 'prodotti aggressivi',
    };
    const trattamenti = d4bArr.map(id => trattMap[id] ?? '').filter(Boolean).join(', ');
    const d5b = answers['d5b'] as string | undefined;
    const condMap: Record<string, string> = {
      d5b_sane: 'le punte sono ancora integre', d5b_aperte: 'le punte tendono ad aprirsi',
      d5b_spezzano: 'il capello si spezza lungo la lunghezza',
    };
    const cond = d5b ? (condMap[d5b] ?? '') : '';
    specificPart = `${trattamenti ? `Il capello ha subito nel tempo: ${trattamenti}.` : 'La fibra è stata sollecitata nel tempo.'} ${cond ? `Oggi ${cond}.` : ''}`.trim();
  } else if (branch === 'colore') {
    const d4c = answers['d4c'] as string | undefined;
    const colorMap: Record<string, string> = {
      d4c_naturale: 'il colore naturale', d4c_tinta: 'una tinta',
      d4c_decolorazioni: 'decolorazioni', d4c_grigi_coprire: 'grigi da coprire',
      d4c_grigi_valorizzare: 'grigi da valorizzare',
    };
    const colorDesc = d4c ? (colorMap[d4c] ?? 'il colore attuale') : 'il colore attuale';
    const d5c = answers['d5c'];
    const d5cArr = Array.isArray(d5c) ? d5c : d5c ? [d5c] : [];
    const preoMap: Record<string, string> = {
      d5c_spegne: 'si spegne rapidamente', d5c_luminoso: 'manca di luminosità',
      d5c_uniforme: 'non risulta uniforme', d5c_viso: 'non valorizza il viso come vorresti',
      d5c_danneggia: 'preoccupa per i possibili danni alla fibra',
    };
    const preoc = d5cArr.map(id => preoMap[id] ?? '').filter(Boolean).join(' e ');
    specificPart = `Il punto di partenza è ${colorDesc}.${preoc ? ` Il colore ${preoc}.` : ''}`;
  } else if (branch === 'forma') {
    const d4d = answers['d4d'];
    const d4dArr = Array.isArray(d4d) ? d4d : d4d ? [d4d] : [];
    const formaMap: Record<string, string> = {
      d4d_volume: 'il volume', d4d_ricci: 'la gestione del riccio',
      d4d_piega: 'la tenuta della piega', d4d_taglio: 'la forma del taglio',
    };
    const formaDesc = d4dArr.map(id => formaMap[id] ?? '').filter(Boolean).join(', ');
    const d5d = answers['d5d'] as string | undefined;
    const volumeMap: Record<string, string> = {
      d5d_poco: 'non abbastanza', d5d_medio: 'nella media',
      d5d_molto: 'abbastanza voluminosi', d5d_troppo: 'eccessivo e difficile da gestire',
    };
    const volumeDesc = d5d ? (volumeMap[d5d] ?? '') : '';
    specificPart = `Le esigenze principali riguardano ${formaDesc || 'la forma e il movimento'}${volumeDesc ? ` — il volume attuale risulta ${volumeDesc}` : ''}.`;
  } else {
    const d5e = answers['d5e'] as string | undefined;
    const d6e = answers['d6e'] as string | undefined;
    const satMap: Record<string, string> = {
      d5e_cercando: 'stai cercando ancora la direzione giusta',
      d5e_insoddisfatta: 'hai provato soluzioni che non hanno risposto davvero',
      d5e_prima: 'è la prima volta che cerchi un percorso strutturato',
    };
    const d6eMap: Record<string, string> = {
      d6e_risultati: 'cerchi risultati concreti e misurabili',
      d6e_presa: 'vuoi essere presa davvero in carico',
      d6e_capire: 'prima di tutto vuoi capire',
      d6e_tutto: 'vuoi prenderti cura di tutto in modo integrato',
    };
    const satDesc = d5e ? (satMap[d5e] ?? '') : '';
    const aspDesc = d6e ? (d6eMap[d6e] ?? '') : '';
    specificPart = `Dalla lettura del profilo emerge una situazione articolata${satDesc ? `: ${satDesc}` : ''}. ${aspDesc ? `In questo momento ${aspDesc}.` : ''}`.trim();
  }

  const d9Ctx: Record<string, string> = {
    d9_amo: 'Tieni molto ai tuoi capelli e vorresti valorizzarli di più.',
    d9_non_piacciono: 'Il rapporto con i tuoi capelli è complicato — li sopporti più che amarli.',
    d9_trascuro: 'Ammetti di trascurarli, spesso per mancanza di strumenti o punti di riferimento.',
    d9_ci_lavoro: 'Ci stai lavorando attivamente, ma senti di avere bisogno di un supporto più esperto.',
  };
  const d9Phrase = d9 ? (d9Ctx[d9] ?? '') : '';

  const parts = [
    `Capelli ${tipo}${statoDesc ? `, che descrivi come ${statoDesc}` : ''}.`,
    specificPart,
    d9Phrase,
    lavaggioDesc ? `Frequenza di lavaggio: ${lavaggioDesc}.` : '',
  ].filter(Boolean);

  return parts.join(' ');
}

// ── SEGNALI PRINCIPALI ──────────────────────────────────────────

function buildMainSignals(answers: Answers, _primary: Percorso): string[] {
  const d3 = answers['d3'] as string | undefined;
  const branch = d3 ? getBranchKey(d3) : 'completo';
  const d9 = answers['d9'] as string | undefined;
  const d2 = answers['d2'];
  const d2arr = Array.isArray(d2) ? (d2 as string[]) : d2 ? [d2 as string] : [];
  const signals: string[] = [];

  if (branch === 'cute') {
    const d4a = answers['d4a'];
    const d4aArr = Array.isArray(d4a) ? d4a : d4a ? [d4a] : [];
    if (d4aArr.includes('d4a_prurito')) signals.push('Prurito ricorrente — segnale di squilibrio del cuoio capelluto');
    if (d4aArr.includes('d4a_desquamazione')) signals.push('Desquamazione presente — risposta della cute da esaminare in presenza');
    if (d4aArr.includes('d4a_grassa')) signals.push('Eccesso di sebo alla radice — pattern che influenza anche il capello');
    if (d4aArr.includes('d4a_rossori')) signals.push('Rossori o irritazione — cute in condizione di reattività');
    if (d4aArr.includes('d4a_tira')) signals.push('Sensazione di cute che tira — mancanza di equilibrio da valutare');
    const d7a = answers['d7a'] as string | undefined;
    if (d7a === 'd7a_evidente') signals.push('Diradamento evidente — aspetto da approfondire in consulenza');
    else if (d7a === 'd7a_lieve') signals.push('Lieve diradamento in alcune zone — da monitorare');
  } else if (branch === 'struttura') {
    const d5b = answers['d5b'] as string | undefined;
    if (d5b === 'd5b_spezzano') signals.push('Capello che si spezza — fibra strutturalmente indebolita');
    else if (d5b === 'd5b_aperte') signals.push('Punte aperte — fibra che necessita di rinforzo');
    const d6b = answers['d6b'] as string | undefined;
    if (d6b === 'd6b_paglia') signals.push('Texture simile alla paglia — segnale di disidratazione profonda');
    else if (d6b === 'd6b_secco') signals.push('Capello secco al tatto — fibra povera di idratazione');
    else if (d6b === 'd6b_ruvido') signals.push('Superficie ruvida — cuticole alterate');
    const d7b = answers['d7b'] as string | undefined;
    if (d7b === 'd7b_ricominciare') signals.push('Desiderio di ricominciare — non solo migliorare, ma ricostruire su basi solide');
    const d4b = answers['d4b'];
    const d4bArr = Array.isArray(d4b) ? d4b : d4b ? [d4b] : [];
    if (d4bArr.includes('d4b_decolorazioni') && d4bArr.includes('d4b_stiratura')) {
      signals.push('Combinazione di decolorazioni e stirature — stress multiplo sulla stessa fibra');
    } else if (d4bArr.includes('d4b_decolorazioni')) {
      signals.push('Decolorazioni nel tempo — impatto diretto sulla struttura della fibra');
    }
  } else if (branch === 'colore') {
    const d5c = answers['d5c'];
    const d5cArr = Array.isArray(d5c) ? d5c : d5c ? [d5c] : [];
    if (d5cArr.includes('d5c_spegne')) signals.push('Colore che si spegne rapidamente — ossidazione precoce da gestire');
    if (d5cArr.includes('d5c_luminoso')) signals.push('Mancanza di luminosità — colore che non riflette come dovrebbe');
    if (d5cArr.includes('d5c_uniforme')) signals.push('Disuniformità cromatica — da leggere e progettare in consulenza');
    if (d5cArr.includes('d5c_danneggia')) signals.push('Attenzione alla fibra — la protezione entra nella progettazione del colore');
    const d6c = answers['d6c'] as string | undefined;
    if (d6c === 'd6c_frequente') signals.push('Frequenza alta delle colorazioni — ciclo da ottimizzare per fibra e risultato');
    const d7c = answers['d7c'] as string | undefined;
    if (d7c === 'd7c_luminosita') signals.push('Obiettivo luminosità — direzione cromatica da costruire con precisione');
    else if (d7c === 'd7c_naturalezza') signals.push('Obiettivo naturalezza — colore che si integra, non che si impone');
    else if (d7c === 'd7c_copertura') signals.push('Obiettivo copertura — tecnica da valutare in base alla fibra e al viso');
    else if (d7c === 'd7c_cambiamento') signals.push('Desiderio di cambiamento cromatico — da progettare con gradualità');
    else if (d7c === 'd7c_bianco') signals.push('Strategia cromatica evolutiva — gestione del passaggio al bianco o morbidezza visiva sulla ricrescita');
  } else if (branch === 'forma') {
    const d1 = answers['d1'] as string | undefined;
    if (d1 === 'd1_ricci' || d1 === 'd1_molto_ricci') signals.push('Capello riccio — morfologia che richiede lettura e approccio specifici');
    else if (d1 === 'd1_mossi') signals.push('Capello mosso — texture con gestione propria tra liscio e riccio');
    // Relational signal — alta priorità, prima dei segnali tecnici
    if (d9 === 'd9_non_piacciono') signals.push('Relazione con i capelli da ricostruire — dimensione personale da tenere presente nel percorso');
    else if (d9 === 'd9_trascuro') signals.push('Una cura ancora da costruire — punto di partenza pulito, senza giudizio');
    // Condizione della fibra — segnali da d2, rilevanti anche in percorso forma
    if (d2arr.includes('d2_fragili')) signals.push('Fibra fragile — resistenza ridotta da considerare anche nel progetto di forma');
    if (d2arr.includes('d2_secchi')) signals.push('Capello secco e opaco — idratazione da integrare nel percorso');
    if (d2arr.includes('d2_crespi')) signals.push('Crespo strutturale — elemento da leggere insieme alla morfologia del capello');
    if (d2arr.includes('d2_grassi')) signals.push('Tendenza alla radice grassa — comfort cute da valutare nel percorso');
    const d4d = answers['d4d'];
    const d4dArr = Array.isArray(d4d) ? d4d : d4d ? [d4d] : [];
    if (d4dArr.includes('d4d_volume')) signals.push('Volume da gestire — obiettivo forma e leggerezza');
    if (d4dArr.includes('d4d_ricci')) signals.push('Definizione del riccio da migliorare — potenziale da esprimere');
    if (d4dArr.includes('d4d_piega')) signals.push('Piega che non regge — tecnica e prodotto da rivedere');
    if (d4dArr.includes('d4d_taglio')) signals.push('Taglio che non valorizza — costruzione sulla morfologia reale');
    const d7d = answers['d7d'] as string | undefined;
    if (d7d === 'd7d_liberi') signals.push('Desiderio di capelli liberi e naturali — meno intervento, più identità');
    else if (d7d === 'd7d_disciplinati') signals.push('Desiderio di più ordine e forma definita');
  } else {
    signals.push('Situazione articolata che tocca più aspetti contemporaneamente');
    const d4e = answers['d4e'] as string | undefined;
    if (d4e === 'd4e_cute') signals.push('Salute della cute — parte integrante della presa in carico');
    if (d4e === 'd4e_capello') signals.push('Struttura della fibra — aspetto centrale del percorso');
    if (d4e === 'd4e_colore') signals.push('Colore e cromatica — da integrare nel progetto complessivo');
    if (d4e === 'd4e_forma') signals.push('Forma e movimento — da leggere insieme agli altri elementi');
    const d7e = answers['d7e'] as string | undefined;
    if (d7e === 'd7e_continuita') signals.push('Ricerca di continuità — non un episodio, ma una relazione professionale nel tempo');
  }

  // Per forma branch i segnali d9 sono già stati inseriti con priorità alta sopra
  if (branch !== 'forma') {
    if (d9 === 'd9_non_piacciono') signals.push('Relazione con i capelli da ricostruire — dimensione personale da tenere presente nel percorso');
    if (d9 === 'd9_trascuro') signals.push('Una cura ancora da costruire — punto di partenza pulito, senza giudizio');
  }

  return signals.slice(0, 5);
}

// ── CONDIZIONE DESIDERATA ───────────────────────────────────────

function buildDesiredOutcome(pub: PublicPercorso, primary: Percorso, answers: Answers): string {
  if (pub === 'benessere' && primary === 'cute') {
    return 'La direzione consigliata è verso un maggiore equilibrio del cuoio capelluto — meno fastidi, meno necessità di intervento quotidiano, più leggerezza e risposta sana.';
  }
  if (pub === 'benessere' && primary === 'rinascita') {
    return 'La direzione consigliata è verso una fibra più forte e più morbida — restituire al capello la struttura che i trattamenti o il tempo hanno ridotto, con continuità e metodo.';
  }
  if (pub === 'benessere' && primary === 'armonia') {
    const d9 = answers['d9'] as string | undefined;
    const d2 = answers['d2'];
    const d2arr = Array.isArray(d2) ? (d2 as string[]) : d2 ? [d2 as string] : [];
    const hasFibraFragile = d2arr.includes('d2_fragili') || d2arr.includes('d2_secchi');
    const hasRelational = d9 === 'd9_non_piacciono' || d9 === 'd9_trascuro';
    if (hasFibraFragile && hasRelational) {
      return 'La direzione consigliata abbraccia più di un aspetto: struttura della fibra, morfologia del capello, e il rapporto con entrambi. Il punto di partenza è la lettura reale — senza preconcetti, senza semplificazioni.';
    }
    if (hasFibraFragile) {
      return 'La direzione consigliata è verso una forma più autentica, costruita anche su una fibra più solida. Morfologia e struttura si leggono insieme — quando la fibra risponde, la forma può esprimersi al meglio.';
    }
    if (hasRelational) {
      return 'La direzione consigliata è verso un capello che smette di essere un problema e diventa un\'espressione più coerente di sé. La forma giusta è quella che si comprende — non quella che si sopporta.';
    }
    return 'La direzione consigliata è verso una forma più coerente con la propria natura — meno gestione quotidiana, più identità. Un capello che si lascia leggere nella sua morfologia e poi esprimere al meglio.';
  }
  if (pub === 'colorlux') {
    const d5c = answers['d5c'];
    const d5cArr = Array.isArray(d5c) ? (d5c as string[]) : d5c ? [d5c as string] : [];
    if (d5cArr.includes('d5c_danneggia')) {
      return 'La direzione consigliata è verso un colore che valorizza senza costo per la fibra — luminosità costruita con metodo, continuità cromatica nel tempo, struttura rispettata a ogni incontro.';
    }
    return 'La direzione consigliata è verso un colore più luminoso e coerente — riflessi costruiti sul viso, continuità cromatica nel tempo, risultato leggibile e raffinato senza sforzo quotidiano.';
  }
  if (pub === 'rituale' && primary === 'armonia') {
    return 'La direzione consigliata è verso una forma più coerente con la propria natura — meno gestione quotidiana, più identità. Un capello che si lascia leggere nella sua morfologia e poi esprimere al meglio.';
  }
  return 'La direzione consigliata è verso una presa in carico integrata — cute, struttura, colore e forma letti insieme, in un progetto costruito nel tempo e adattato alle esigenze reali.';
}

// ── RATIONALE DEL PERCORSO ──────────────────────────────────────

function buildPercorsoRationale(pub: PublicPercorso, primary: Percorso, answers: Answers, attention: AttentionLevel): string {
  if (pub === 'benessere' && primary === 'cute') {
    const d6a = answers['d6a'] as string | undefined;
    const mai = d6a === 'd6a_mai';
    return `Il percorso BenEssere parte dalla cute e la legge nel tempo, con metodo. Non un singolo intervento, ma una sequenza costruita per restituire equilibrio reale${mai ? ' — in un contesto mai affrontato in modo professionale' : ''}. La lettura in presenza permetterà di valutare la condizione reale e definire i passi più adatti.`;
  }
  if (pub === 'benessere' && primary === 'rinascita') {
    return 'Il percorso BenEssere, nella declinazione orientata alla fibra, è pensato per restituire al capello una base solida da cui ripartire. Non una copertura superficiale, ma un lavoro in profondità, seduta dopo seduta. La consulenza in presenza definirà la sequenza più adatta alla situazione reale.';
  }
  if (pub === 'benessere' && primary === 'armonia') {
    const d4d = answers['d4d'] as string | undefined;
    const d2rat = answers['d2'];
    const d2ratArr = Array.isArray(d2rat) ? (d2rat as string[]) : d2rat ? [d2rat as string] : [];
    const hasFibraFragileRat = d2ratArr.includes('d2_fragili') || d2ratArr.includes('d2_secchi');
    const d9rat = answers['d9'] as string | undefined;
    const hasRelationalRat = d9rat === 'd9_non_piacciono' || d9rat === 'd9_trascuro';
    const isComplexRat = hasFibraFragileRat || hasRelationalRat;
    if (isComplexRat && d4d === 'd4d_taglio') {
      return 'Il percorso BenEssere, orientato verso la forma, affronta anche le condizioni della fibra — perché un taglio costruito sulla morfologia reale richiede una base su cui poggiare. La consulenza in presenza definirà la priorità giusta e la sequenza più efficace.';
    }
    if (isComplexRat) {
      return "Il percorso BenEssere, orientato verso la forma, tiene conto anche delle condizioni della fibra e del rapporto quotidiano con il proprio capello. La consulenza in presenza inizierà da una lettura senza preconcetti — morfologia, resistenza, routine — per costruire un punto di partenza coerente con la situazione reale.";
    }
    if (d4d === 'd4d_taglio') {
      return 'Il percorso BenEssere, orientato verso la forma, porta le prime Esperienze direttamente sulla morfologia — un taglio costruito sul capello reale e un ascolto della gestione quotidiana. La consulenza in presenza definirà il punto di partenza e la direzione più adatta.';
    }
    return "Il percorso BenEssere, orientato verso la forma e l'espressione del capello, offre già dai primi incontri Esperienze calibrate sulla morfologia specifica — piega, definizione, o cura del riccio. La consulenza in presenza valuterà insieme qual è il gesto più coerente da cui partire.";
  }
  if (pub === 'colorlux') {
    return "Il percorso ColorLux è costruito per chi desidera che il colore smetta di essere un'urgenza ripetuta e possa diventare un progetto di lungo periodo — pensato per la fibra, non solo per l'estetica immediata. La consulenza in presenza permetterà di progettare insieme la direzione cromatica più adatta.";
  }
  if (pub === 'rituale' && primary === 'armonia') {
    if (attention === 'prioritaria') {
      return 'La forma e il movimento del capello si leggono meglio all\'interno di una valutazione più ampia — struttura della fibra, morfologia, routine quotidiana. Il Rituale Luxosa è il contesto più adatto per iniziare questa lettura, con prime Esperienze già molto mirate sulla forma specifica. La consulenza in presenza confermerà la direzione più coerente.';
    }
    return 'La forma e il movimento del capello si leggono meglio all\'interno di una valutazione complessiva. Il Rituale Luxosa è l\'orientamento consigliato come cornice di partenza — da confermare in consulenza, con prime Esperienze già calibrate sulla morfologia specifica e sull\'obiettivo dichiarato.';
  }
  return 'Il Rituale Luxosa è il percorso più completo: abbraccia cute, struttura, colore e forma in un progetto di cura integrata. Non la somma di più interventi, ma un percorso pensato per prendere in carico ogni aspetto in modo coerente. La consulenza in presenza definirà le priorità e la sequenza delle Esperienze.';
}

// ── ESPERIENZE SUGGERITE ────────────────────────────────────────

function getNewEsperienze(pub: PublicPercorso, primary: Percorso, answers: Answers): { es: EsperienzaDef; perche: string }[] {
  const d1 = answers['d1'] as string | undefined;
  const d2 = answers['d2'];
  const d4b = answers['d4b'];
  const d4c = answers['d4c'] as string | undefined;
  const d4d = answers['d4d'] as string | undefined;
  const d4e = answers['d4e'] as string | undefined;
  const d5b = answers['d5b'] as string | undefined;
  const d5c = answers['d5c'];
  const d6b = answers['d6b'] as string | undefined;
  const d7c = answers['d7c'] as string | undefined;

  const d2arr = Array.isArray(d2) ? (d2 as string[]) : d2 ? [d2 as string] : [];
  const d4barr = Array.isArray(d4b) ? (d4b as string[]) : [];
  const d5carr = Array.isArray(d5c) ? (d5c as string[]) : [];

  const isRicci = d1 === 'd1_ricci' || d1 === 'd1_molto_ricci';
  const isMossi = d1 === 'd1_mossi';

  // Signal flags for slot-3 selection
  const hasFibraFragile = d2arr.includes('d2_fragili') || d2arr.includes('d2_secchi')
    || d5b === 'd5b_spezzano' || d6b === 'd6b_secco' || d6b === 'd6b_paglia';
  const hasCrespo = d2arr.includes('d2_crespi');
  const hasRadiceGrassa = d2arr.includes('d2_grassi');

  // In forma branch: d4d_taglio = client needs taglio; everything else = piega/gestione
  const needsTaglioForma = d4d === 'd4d_taglio';

  const result: { es: EsperienzaDef; perche: string }[] = [];

  // ── Slot 1: sempre Consulenze Specialistiche ──────────────────
  result.push({
    es: ES.consulenzeSpecialistiche,
    perche: 'Il primo gesto è la lettura — del capello, della cute, della persona. Il punto di partenza per qualsiasi percorso.',
  });

  if (pub === 'benessere' && primary === 'cute') {
    // Slot 2: cura cute
    result.push({
      es: ES.areaBenessere,
      perche: "Trasforma la cura della cute da urgenza a rituale — l'esperienza più mirata per questa condizione.",
    });
    // Slot 3: complement styling
    if (isRicci) {
      result.push({ es: ES.ricciOsa, perche: 'Definizione e gestione del capello riccio — per valorizzare ogni incontro.' });
    } else {
      result.push({ es: ES.piegaLux, perche: 'Il gesto che valorizza il risultato di ogni incontro.' });
    }

  } else if (pub === 'benessere' && primary === 'rinascita') {
    // Slot 2: fibra
    result.push({
      es: ES.cheratinaNutrizionePro,
      perche: 'Restituisce ordine, morbidezza e resistenza a una fibra che ha subito trattamenti intensi nel tempo.',
    });
    // Slot 3
    if (d4barr.includes('d4b_decolorazioni')) {
      result.push({ es: ES.areaBenessere, perche: 'La fibra decolorata beneficia di un approccio integrato alla salute del capello.' });
    } else if (isRicci) {
      result.push({ es: ES.ricciOsa, perche: 'Dopo aver ristabilito la salute della fibra, la gestione del riccio trova il suo spazio naturale.' });
    } else {
      result.push({ es: ES.piegaLux, perche: 'Per vedere la fibra nella sua versione valorizzata già dal primo incontro.' });
    }

  } else if (pub === 'benessere' && primary === 'armonia') {
    // Slot 2: servizio styling principale sulla morfologia
    if (isRicci) {
      if (needsTaglioForma) {
        result.push({ es: ES.ricciOso, perche: 'Il taglio costruito sulla morfologia del riccio — la base strutturale da cui tutto parte.' });
      } else {
        result.push({ es: ES.ricciOsa, perche: "Definizione, gestione e piega del capello riccio — l'esperienza dedicata alla morfologia riccio autentica." });
      }
    } else if (isMossi) {
      if (needsTaglioForma) {
        result.push({ es: ES.taglioSignature, perche: 'Un taglio costruito sulla morfologia mosso porta armonia e gestibilità duratura.' });
      } else {
        result.push({ es: ES.piegaLux, perche: 'Il finish che valorizza il mosso nella sua forma più naturale e definita.' });
      }
    } else {
      // lisci / senzaforma
      if (needsTaglioForma) {
        result.push({ es: ES.taglioSignature, perche: 'Un taglio costruito sulla morfologia specifica può cambiare la gestione quotidiana in modo duraturo.' });
      } else {
        result.push({ es: ES.piegaLux, perche: 'Il gesto che rivela il potenziale del capello nella sua versione più valorizzata.' });
      }
    }
    // Slot 3: complementare intelligente
    if (isRicci && needsTaglioForma) {
      // RicciOso in slot 2 → RicciOsa o Cheratina come complemento
      if (hasFibraFragile || hasCrespo) {
        result.push({ es: ES.cheratinaNutrizionePro, perche: 'Ordine e morbidezza della fibra riccio — la base per un taglio che esprima tutta la morfologia.' });
      } else {
        result.push({ es: ES.ricciOsa, perche: 'Gestione e definizione del riccio — il gesto che valorizza il risultato del taglio morfologico.' });
      }
    } else if (hasFibraFragile) {
      result.push({ es: ES.cheratinaNutrizionePro, perche: 'Restituisce morbidezza e struttura alla fibra — il complemento ideale alla cura della forma.' });
    } else if (hasCrespo && !isRicci) {
      result.push({ es: ES.cheratinaNutrizionePro, perche: 'Disciplina il crespo strutturalmente — la base per una forma più definita e gestibile.' });
    } else if (hasRadiceGrassa) {
      result.push({ es: ES.areaBenessere, perche: 'Quando la radice grassa condiziona la piega e la gestione quotidiana, la cute entra nel progetto.' });
    }
    // else: 2 esperienze — Consulenza + styling (nel range "2-3")

  } else if (pub === 'colorlux') {
    // Slot 2: servizio colore
    if (d7c === 'd7c_bianco') {
      // d7c_bianco override: sempre Luce Signature con copy specifico, mai Nuances
      result.push({ es: ES.luceSignature, perche: 'Una strategia cromatica evolutiva — pensata per accompagnare la ricrescita, il passaggio al bianco o una maggiore morbidezza visiva tra base naturale e lunghezze. La direzione specifica sarà definita durante la consulenza in presenza.' });
    } else if (d4c === 'd4c_decolorazioni' || d4c === 'd4c_grigi_coprire') {
      const lucePerche = d4c === 'd4c_grigi_coprire'
        ? 'Copertura e continuità cromatica costruite con metodo — per una ricrescita gestita e un colore sempre coerente nel tempo.'
        : 'Schiariture costruite con precisione — luce, profondità e rispetto della fibra a ogni incontro.';
      result.push({ es: ES.luceSignature, perche: lucePerche });
    } else if (d4c === 'd4c_naturale' || d4c === 'd4c_grigi_valorizzare') {
      result.push({ es: ES.nuances, perche: 'Valorizza il colore nella sua espressione più raffinata, senza stravolgere.' });
    } else if (d4c === 'd4c_tinta') {
      if (d7c === 'd7c_cambiamento' || d7c === 'd7c_luminosita') {
        result.push({ es: ES.luceSignature, perche: d7c === 'd7c_cambiamento' ? 'Schiariture e tecniche di luce per un cambiamento costruito con metodo — non una svolta, ma una direzione.' : 'Luce e dimensione costruite con precisione — per un colore che valorizza senza appesantire.' });
      } else {
        result.push({ es: ES.nuances, perche: 'Il colore nella sua versione più raffinata e duratura.' });
      }
    } else {
      result.push({ es: ES.nuances, perche: 'Il colore nella sua espressione più raffinata.' });
    }
    // Slot 3
    if (d5carr.includes('d5c_danneggia')) {
      result.push({ es: ES.cheratinaNutrizionePro, perche: 'Quando il colore impatta sulla fibra, la cura strutturale entra nel progetto cromatico.' });
    } else if (isRicci) {
      result.push({ es: ES.ricciOsa, perche: 'Il colore valorizzato nella sua forma più autentica — riccio, definito, luminoso.' });
    } else {
      result.push({ es: ES.piegaLux, perche: 'Per valorizzare subito il risultato colore con il gesto giusto.' });
    }

  } else {
    // pub === 'rituale' (primary rituale o armonia escalata a complessità multi-area)
    // Slot 2: styling principale per morfologia
    if (isRicci) {
      if (d4e === 'd4e_forma' || needsTaglioForma) {
        result.push({ es: ES.ricciOso, perche: 'Il taglio costruito sulla morfologia del riccio — la base strutturale del percorso integrato.' });
      } else {
        result.push({ es: ES.ricciOsa, perche: 'Gestione, definizione e piega del riccio — il gesto fondante per un percorso che parte dalla morfologia.' });
      }
    } else {
      // mossi o lisci → Taglio Signature (mai RicciOso)
      result.push({ es: ES.taglioSignature, perche: 'Il taglio costruito sulla morfologia è il gesto fondante di ogni percorso integrato.' });
    }
    // Slot 3: concern primario del percorso completo
    if (d4e === 'd4e_cute') {
      result.push({ es: ES.areaBenessere, perche: 'La cute è parte integrante del percorso — la sua salute è il punto di partenza.' });
    } else if (d4e === 'd4e_capello') {
      result.push({ es: ES.cheratinaNutrizionePro, perche: 'Restituisce morbidezza e struttura alla fibra — base per tutto il resto.' });
    } else if (d4e === 'd4e_colore') {
      result.push({ es: ES.nuances, perche: 'Il colore entra nel percorso come elemento di valorizzazione, progettato insieme.' });
    } else if (d4e === 'd4e_forma') {
      // forma già in slot 2; se ricci con RicciOso, RicciOsa come complemento
      if (isRicci && result.some(r => r.es.nome === ES.ricciOso.nome)) {
        result.push({ es: ES.ricciOsa, perche: 'Gestione e definizione del riccio — il gesto che valorizza il risultato del taglio morfologico.' });
      } else if (hasFibraFragile) {
        result.push({ es: ES.cheratinaNutrizionePro, perche: 'Fibra e forma si sostengono — la struttura sana è la base di ogni risultato duraturo.' });
      } else {
        result.push({ es: ES.piegaLux, perche: 'Il gesto che rende visibile la direzione del percorso.' });
      }
    } else {
      // d4e_nonso o non definito
      if (hasFibraFragile) {
        result.push({ es: ES.cheratinaNutrizionePro, perche: 'Restituisce morbidezza, corpo e resistenza — la base per qualsiasi percorso integrato.' });
      } else {
        result.push({ es: ES.areaBenessere, perche: "Benessere e struttura — le fondamenta di ogni percorso che parte dall'inizio." });
      }
    }
  }

  // Dedup safety net (la logica sopra non genera duplicati, ma per sicurezza)
  const seen = new Set<string>();
  return result.filter(item => {
    if (seen.has(item.es.nome)) return false;
    seen.add(item.es.nome);
    return true;
  });
}

// ── COSA APPROFONDIRE IN CONSULENZA ────────────────────────────

function buildConsultationFocus(primary: Percorso, answers: Answers, esperienzaNames: Set<string>): string[] {
  const d9 = answers['d9'] as string | undefined;
  const d6a = answers['d6a'] as string | undefined;
  const d4b = answers['d4b'];

  if (primary === 'cute') {
    const points = [
      'Lo stato reale del cuoio capelluto — equilibrio sebaceo, sensibilità, reattività',
      'La routine domestica attuale — prodotti usati, frequenza di lavaggio, esposizione al calore',
    ];
    points.push(d6a === 'd6a_mai'
      ? 'La storia della cute — un aspetto mai affrontato in modo professionale, che sarà osservato senza preconcetti'
      : 'Le soluzioni già provate — cosa ha funzionato, cosa no, e perché');
    return points;
  }

  if (primary === 'rinascita') {
    const d4bArr = Array.isArray(d4b) ? d4b : d4b ? [d4b] : [];
    return [
      'Lo stato reale della fibra — elasticità, coesione, punti critici lungo la lunghezza',
      'La storia dei trattamenti — frequenza, prodotti, data dell\'ultimo intervento chimico o termico',
      d4bArr.includes('d4b_decolorazioni')
        ? 'Il rapporto tra colore e struttura — attenzione tecnica da valutare in presenza con cura'
        : "L'aspettativa rispetto ai tempi — i risultati solidi si costruiscono con continuità",
    ];
  }

  if (primary === 'colore') {
    const d7cFocus = answers['d7c'] as string | undefined;
    const points = [
      'La storia cromatica — prodotti usati, frequenza, tecnica degli interventi precedenti',
      'Lo stato attuale della fibra colorata — porosità e risposta al calore',
      d7cFocus === 'd7c_bianco'
        ? 'La strategia evolutiva sulla ricrescita — ritmo degli incontri, tecniche più adatte (airtouch, babylight, degradé) e gradualità del percorso: da valutare in consulenza'
        : 'La direzione cromatica desiderata — luminosità, profondità, uniformità o cambiamento',
    ];
    const d5cFocus = answers['d5c'];
    const d5cFocusArr = Array.isArray(d5cFocus) ? (d5cFocus as string[]) : d5cFocus ? [d5cFocus as string] : [];
    if (d5cFocusArr.includes('d5c_danneggia') && !esperienzaNames.has('Cheratina Nutrizione Pro')) {
      points.push('La protezione strutturale durante il percorso colore — da valutare se integrare Cheratina Nutrizione Pro');
    }
    return points;
  }

  if (primary === 'armonia') {
    const points = [
      'La morfologia reale del capello — tipo di riccio o mosso, diametro, porosità, movimento naturale',
      'La routine quotidiana — prodotti, tecnica di asciugatura, tempo e difficoltà di gestione',
      "L'aspettativa sulla forma — riccio libero e naturale, definito, o strutturato con il taglio",
    ];
    const d2arm = answers['d2'];
    const d2armArr = Array.isArray(d2arm) ? (d2arm as string[]) : d2arm ? [d2arm as string] : [];
    if (d2armArr.includes('d2_grassi') && !esperienzaNames.has('Area Benessere')) {
      points.push('Il comfort della cute e la tendenza alla radice grassa — da valutare se integrare Area Benessere nel percorso');
    }
    if ((d2armArr.includes('d2_fragili') || d2armArr.includes('d2_secchi')) && !esperienzaNames.has('Cheratina Nutrizione Pro')) {
      points.push('La resistenza della fibra — fragile o secca, aspetto da considerare nella sequenza delle Esperienze');
    }
    return points;
  }

  const d7e = answers['d7e'] as string | undefined;
  return [
    'Lo stato complessivo — cute, fibra, colore e forma osservati insieme in presenza',
    'La storia professionale passata — cosa è stato provato e perché non ha soddisfatto',
    d7e === 'd7e_continuita' || d9 === 'd9_non_piacciono'
      ? "La continuità — come costruire un percorso che abbia senso nel tempo e risponda davvero"
      : "Le aspettative — cosa è realistico fare nel breve e cosa richiede più sedute",
  ];
}

// ── CHIUSURA ────────────────────────────────────────────────────

function buildClosing(pub: PublicPercorso, attention: AttentionLevel, primary: Percorso, answers: Answers): string {
  if (pub === 'benessere' && primary === 'cute') {
    if (attention === 'prioritaria') {
      return 'La cute è il terreno — e un terreno in difficoltà ha bisogno di ascolto prima di qualsiasi intervento. Il percorso BenEssere inizia da questa lettura, concreta e metodica.';
    }
    return 'La cute è il terreno. Quando è in equilibrio, il capello può rispondere meglio. Il percorso BenEssere inizia da questa lettura — senza fretta, con metodo.';
  }
  if (pub === 'benessere' && primary === 'rinascita') {
    if (attention === 'prioritaria') {
      return "Quando la fibra ha attraversato molto, il punto di partenza non può essere una soluzione rapida. Può essere la lettura onesta di quello che c'è — e da lì, la costruzione di una base reale.";
    }
    return 'La fibra si ricostruisce con metodo e continuità. Il percorso BenEssere è la risposta consigliata — non per coprire, ma per restituire.';
  }
  if (pub === 'benessere' && primary === 'armonia') {
    const d9cl = answers['d9'] as string | undefined;
    const d2cl = answers['d2'];
    const d2clArr = Array.isArray(d2cl) ? (d2cl as string[]) : d2cl ? [d2cl as string] : [];
    const hasFibraFragileCl = d2clArr.includes('d2_fragili') || d2clArr.includes('d2_secchi');
    const hasRelationalCl = d9cl === 'd9_non_piacciono' || d9cl === 'd9_trascuro';
    const d1cl = answers['d1'] as string | undefined;
    const isRicciCl = d1cl === 'd1_ricci' || d1cl === 'd1_molto_ricci';
    if (hasFibraFragileCl && hasRelationalCl) {
      return 'Quando fibra, forma e rapporto con il proprio capello si intrecciano, la risposta non può essere un gesto singolo. Il percorso BenEssere è il contesto in cui questa complessità viene accolta e trasformata in una direzione concreta.';
    }
    if (hasFibraFragileCl) {
      return 'Forma e struttura si leggono insieme. Quando la fibra è indebolita, la morfologia non può esprimersi al meglio — il percorso BenEssere inizia da questa lettura integrata, per costruire un risultato che regge nel tempo.';
    }
    if (hasRelationalCl) {
      return 'Un capello che non piace ancora merita di essere compreso prima di essere trasformato. Il percorso BenEssere inizia da questo ascolto — senza giudizio, con metodo.';
    }
    if (isRicciCl) {
      return "La forma del capello riccio può diventare più coerente con la propria natura. Il percorso BenEssere porta le prime Esperienze direttamente sulla morfologia — costruite sull'osservazione in presenza, non su una formula.";
    }
    return "Il momento in cui il capello trova la sua forma giusta è quello in cui la gestione smette di essere un problema. Il percorso BenEssere porta a quel momento con metodo — osservazione, morfologia, gesto calibrato.";
  }
  if (pub === 'colorlux') {
    const d5ccl = answers['d5c'];
    const d5cclArr = Array.isArray(d5ccl) ? (d5ccl as string[]) : d5ccl ? [d5ccl as string] : [];
    if (d5cclArr.includes('d5c_danneggia')) {
      return 'Un colore che valorizza e rispetta la fibra è un progetto — non un prodotto. Il percorso ColorLux inizia dalla lettura integrata di colore e struttura, per trovare la direzione cromatica che dura senza costo per il capello.';
    }
    if (attention === 'prioritaria') {
      return "Il colore che dura e valorizza non si trova per caso — si progetta. Il percorso ColorLux può trasformare la colorazione da urgenza ripetuta a scelta consapevole e duratura.";
    }
    return "Il colore giusto non si sceglie a scaffale — si comprende. Il percorso ColorLux è il contesto in cui questa comprensione può diventare un risultato reale.";
  }
  if (pub === 'rituale' && primary === 'armonia') {
    return 'La forma del capello può diventare più coerente con la propria natura. Il primo passo è comprenderla davvero — con la lettura giusta e le Esperienze più adatte alla morfologia specifica.';
  }
  if (attention === 'prioritaria') {
    return "Quando la complessità viene accolta invece di semplificata, il percorso può diventare reale. Il Rituale Luxosa inizia da una cosa sola: capire davvero.";
  }
  return 'La presa in carico integrata è la risposta più coerente per chi sente che un singolo gesto non basta. Il Rituale Luxosa è il contesto in cui questa risposta può prendere forma.';
}

// ── NOTA D10 ────────────────────────────────────────────────────

function buildD10Note(d10: string | undefined): string | null {
  if (!d10 || d10.trim().length <= 10) return null;
  return d10.trim();
}


// ── SEDI ──────────────────────────────────────────────────────────

const LUXOSA_LOCATIONS = [
  {
    id: 'messina-cavour',
    label: 'Messina Cavour',
    whatsapp: '390902403220',
  },
] as const;

// ── WHATSAPP MESSAGE BUILDER ─────────────────────────────────────

function buildWhatsAppMessage(
  nome: string,
  email: string,
  whatsapp: string,
  fascia: string,
  sede: string,
  answers: Answers
): string {
  const d3 = answers['d3'] as string | undefined;
  const sequence = buildQuestionSequence(d3);
  const scores = computeScores(answers, sequence);
  const { primary, secondary } = getPercorsoResult(scores);
  const pub = getPublicPercorso(primary, scores);
  const secondPub = getSecondaryPublic(primary, secondary, scores);
  const attention = getAttentionLevel(answers, primary);
  const percorsoName = PUBLIC_PERCORSO_NAMES[pub];
  const attentionLabels: Record<AttentionLevel, string> = {
    ordinaria: 'In fase di ascolto',
    mirata: 'Attenzione mirata consigliata',
    prioritaria: "Richiede un'attenzione dedicata",
  };
  const conditionSummary = buildConditionSummary(answers, primary);
  const mainSignals = buildMainSignals(answers, primary);
  const desiredOutcome = buildDesiredOutcome(pub, primary, answers);
  const percorsoRationale = buildPercorsoRationale(pub, primary, answers, attention);
  const esperienze = getNewEsperienze(pub, primary, answers);
  const esperienzaNames = new Set(esperienze.map(e => e.es.nome));
  const consultationFocus = buildConsultationFocus(primary, answers, esperienzaNames);
  const d10Note = buildD10Note(answers['d10'] as string | undefined);
  const closing = buildClosing(pub, attention, primary, answers);

  const lines: string[] = [];
  lines.push('Buongiorno, vorrei maggiori informazioni circa la mia condizione, e chiedo il ricontatto da parte di un vostro consulente.');
  lines.push('');
  lines.push(`Fascia oraria preferita: ${fascia}`);
  lines.push(`Sede selezionata: ${sede}`);
  lines.push('');
  lines.push('DATI INSERITI NEL LUXOSA TEST');
  lines.push(`Nome: ${nome}`);
  lines.push(`Email: ${email}`);
  lines.push(`WhatsApp: ${whatsapp}`);
  lines.push('');
  lines.push('--- REPORT LUXOSA TEST ---');
  lines.push('');
  lines.push(`PERCORSO: ${percorsoName}`);
  lines.push(`Attenzione: ${attentionLabels[attention]}`);
  lines.push('');
  lines.push('CONDIZIONE DI PARTENZA');
  lines.push(conditionSummary);
  lines.push('');
  lines.push('SEGNALI PRINCIPALI');
  mainSignals.forEach(s => lines.push(`- ${s}`));
  lines.push('');
  lines.push('DIREZIONE DEL PERCORSO');
  lines.push(desiredOutcome);
  lines.push('');
  lines.push("PERCHE' QUESTO PERCORSO");
  lines.push(percorsoRationale);
  lines.push('');
  lines.push('ESPERIENZE SUGGERITE');
  esperienze.forEach(e => {
    lines.push(`- ${e.es.nome}`);
    lines.push(`  ${e.perche}`);
  });
  if (secondPub) {
    lines.push('');
    lines.push(`PERCORSO SECONDARIO: ${PUBLIC_PERCORSO_NAMES[secondPub]}`);
  }
  lines.push('');
  lines.push('COSA APPROFONDIRE IN CONSULENZA');
  consultationFocus.forEach(f => lines.push(`- ${f}`));
  if (d10Note) {
    lines.push('');
    lines.push('NOTE AGGIUNTIVE');
    lines.push(d10Note);
  }
  lines.push('');
  lines.push(closing);
  lines.push('');
  lines.push('---');
  lines.push(REPORT_DISCLAIMER);
  return lines.join('\n');
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── DISCLAIMER SCREEN ──────────────────────────────────────────

function DisclaimerScreen({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="w-full max-w-[720px] mx-auto px-6 md:px-10 py-10 md:py-14"
    >
      <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">Luxosa Test</span>
      <h2 className="font-serif text-[26px] md:text-[34px] font-light leading-[1.15] text-charcoal mb-2">
        Scopri il tuo percorso ideale
      </h2>
      <p className="text-[17px] leading-[1.8] text-anthracite/55 font-light mb-8">
        Rispondi a poche domande sul tuo capello, sulla tua cute e sulle tue abitudini. In pochi minuti riceverai un suggerimento personalizzato.
      </p>

      <div className="border border-sand/50 p-6 md:p-8 bg-ecru/20 mb-8 space-y-4 text-[16px] leading-[1.85] text-anthracite/65 font-light">
        <p>
          <strong className="text-charcoal/80 font-normal">IMPORTANTE:</strong> Il risultato di questo test ha valore esclusivamente orientativo e non costituisce in alcun modo una diagnosi medica, tricologica o dermatologica. La valutazione definitiva avviene esclusivamente in sede, durante la consulenza professionale con la tua professionista Luxosa.
        </p>
        <p>
          <strong className="text-charcoal/80 font-normal">TRATTAMENTO DEI DATI:</strong> Compilando questo test e fornendo i tuoi dati di contatto, autorizzi Luxosa a raccogliere e trattare le informazioni per elaborare il risultato personalizzato, contattarti per la consulenza gratuita in sede e inviarti comunicazioni relative ai servizi Luxosa. Puoi revocare il consenso scrivendo a{' '}
          <a href="mailto:privacy@luxosa.it" className="text-brass hover:underline underline-offset-2">
            privacy@luxosa.it
          </a>
          . Consulta la nostra{' '}
          <Link to="/privacy-policy" target="_blank" className="text-brass hover:underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <button
        onClick={() => setAccepted(v => !v)}
        className="flex items-start gap-4 mb-10 text-left group w-full"
      >
        <div className={`mt-0.5 w-5 h-5 border flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
          accepted ? 'bg-brass border-brass' : 'border-anthracite/30 group-hover:border-brass/50'
        }`}>
          {accepted && <Check size={11} strokeWidth={2.5} className="text-ivory" />}
        </div>
        <span className="text-[16px] leading-[1.7] text-anthracite/65 font-light">
          Ho letto e accetto le condizioni sopra indicate. *
        </span>
      </button>

      <button
        onClick={accepted ? onAccept : undefined}
        disabled={!accepted}
        className={`inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4 transition-all duration-500 ${
          accepted
            ? 'relative overflow-hidden group bg-charcoal text-ivory cursor-pointer'
            : 'bg-anthracite/10 text-anthracite/25 cursor-not-allowed'
        }`}
      >
        {accepted && (
          <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
        )}
        <span className={`flex items-center gap-3 ${accepted ? 'relative z-10' : ''}`}>
          Inizia il Luxosa Test
          <ArrowRight size={14} strokeWidth={1.5} />
        </span>
      </button>
    </motion.div>
  );
}

// ── QUIZ CONTENT ───────────────────────────────────────────────

// ── LAYOUT HELPERS (count-based, no per-question overrides) ────

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
                <p className="mt-0.5 text-[10px] text-anthracite/50 font-light leading-snug">{opt.subtext}</p>
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
              <p className="mt-2 text-[10px] md:text-[12px] leading-[1.5] text-anthracite/40 font-light">{opt.subtext}</p>
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
          <p className="text-[12px] md:text-[16px] text-anthracite/40 font-light italic">{q.subtitle}</p>
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
            placeholder="Scrivi qui liberamente…"
            className="w-full h-36 md:h-44 bg-ivory/80 border border-sand/50 px-5 py-4 text-[17px] text-anthracite/80 font-light leading-[1.8] resize-none outline-none focus:border-brass/50 transition-colors duration-300 placeholder:text-anthracite/25"
          />
          <div className="text-right mt-1.5">
            <span className="text-[11px] text-anthracite/25 font-light">{textValue.length}/500</span>
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
        enabled ? 'bg-charcoal text-ivory cursor-pointer' : 'bg-anthracite/10 text-anthracite/25 cursor-not-allowed'
      }`}
    >
      {enabled && (
        <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
      )}
      <span className={`flex items-center gap-3 ${enabled ? 'relative z-10' : ''}`}>
        Continua
        <ArrowRight size={14} strokeWidth={1.5} className={enabled ? 'group-hover:translate-x-1 transition-transform duration-300' : ''} />
      </span>
    </button>
  );
}

// ── FORM SCREEN ────────────────────────────────────────────────

function FormScreen({ onSubmit }: { onSubmit: (data: ContactFormData) => void }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<PhoneValue | undefined>(undefined);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!nome.trim() || !email.trim()) {
      setError('Completa tutti i campi per scoprire la tua soluzione.');
      return;
    }
    if (!phone || !isPossiblePhoneNumber(phone)) {
      setError('Controlla il numero inserito: sembra incompleto o non corretto.');
      return;
    }
    onSubmit({ nome: nome.trim(), email: email.trim(), whatsapp: phone });
  };

  const inputClass = 'w-full bg-ivory/80 border border-sand/50 px-5 py-4 text-[17px] text-anthracite/80 font-light outline-none focus:border-brass/50 transition-colors duration-300 placeholder:text-anthracite/28';

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
        <img src="/images/zona-consulenza.png" alt="" className="w-full h-full object-cover opacity-[0.04] lg:opacity-[0.06]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/50 via-ivory/85 to-ivory" />
      </div>

      <div className="relative z-10 max-w-[580px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">Quasi pronta</span>
        <h2 className="font-serif text-[26px] md:text-[34px] font-light leading-[1.15] text-charcoal mb-4">
          Ricevi il tuo risultato.
        </h2>
        <p className="text-[17px] leading-[1.8] text-anthracite/55 font-light mb-10">
          Per ricevere il tuo risultato personalizzato e permetterci di contattarti per la consulenza gratuita in sede, lasciaci i tuoi dati.
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

          {error && (
            <p className="text-[12px] text-brass-muted font-light italic pt-1">{error}</p>
          )}

          <div className="pt-2">
            <button
              onClick={handleSubmit}
              className="relative overflow-hidden group w-full inline-flex items-center justify-center gap-3 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light py-5"
            >
              <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
              <span className="relative z-10 flex items-center gap-3">
                Scopri il tuo orientamento
                <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── RESULT SCREEN ──────────────────────────────────────────────

function ResultScreen({
  nome,
  email,
  whatsapp,
  answers,
  onReset,
}: {
  nome: string;
  email: string;
  whatsapp: string;
  answers: Answers;
  onReset: () => void;
}) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<typeof LUXOSA_LOCATIONS[number]['id']>('messina-cavour');
  const [selectedFascia, setSelectedFascia] = useState<string | null>(null);
  const d3 = answers['d3'] as string | undefined;
  const sequence = buildQuestionSequence(d3);
  const scores = computeScores(answers, sequence);
  const { primary, secondary } = getPercorsoResult(scores);

  const pub = getPublicPercorso(primary, scores);
  const secondPub = getSecondaryPublic(primary, secondary, scores);
  const attention = getAttentionLevel(answers, primary);
  const percorsoName = PUBLIC_PERCORSO_NAMES[pub];

  const conditionSummary = buildConditionSummary(answers, primary);
  const mainSignals = buildMainSignals(answers, primary);
  const desiredOutcome = buildDesiredOutcome(pub, primary, answers);
  const percorsoRationale = buildPercorsoRationale(pub, primary, answers, attention);
  const esperienze = getNewEsperienze(pub, primary, answers);
  const esperienzaNames = new Set(esperienze.map(e => e.es.nome));
  const consultationFocus = buildConsultationFocus(primary, answers, esperienzaNames);
  const d10Note = buildD10Note(answers['d10'] as string | undefined);
  const closing = buildClosing(pub, attention, primary, answers);

  const attentionLabels: Record<AttentionLevel, string> = {
    ordinaria: 'In fase di ascolto',
    mirata: 'Attenzione mirata consigliata',
    prioritaria: "Richiede un'attenzione dedicata",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: premiumEase }}
      className="relative w-full"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src="/images/prima_consulenza.png" alt="" className="w-full h-full object-cover opacity-[0.04] lg:opacity-[0.07]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/50 via-ivory/85 to-ivory" />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 md:px-10 py-10 md:py-14">

        {/* 1 — Apertura personalizzata */}
        <div className="mb-12 md:mb-16">
          <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">Il tuo orientamento Luxosa</span>
          <h2 className="font-serif text-[24px] md:text-[34px] font-light leading-[1.15] text-charcoal mb-6">
            {nome ? `${nome}, il percorso pensato per te è…` : 'Il percorso pensato per te è…'}
          </h2>
          <div className="border-l-[3px] border-brass pl-6">
            <p className="font-serif text-[38px] md:text-[50px] font-light leading-[1.05] text-charcoal">{percorsoName}</p>
          </div>
        </div>

        {/* 2 — Condizione di partenza */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">Condizione di partenza</span>
          <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/65 font-light">{conditionSummary}</p>
        </div>

        {/* 3 — Segnali principali */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-5">Segnali principali</span>
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
                <p className="text-[16px] md:text-[17px] leading-[1.75] text-anthracite/65 font-light">{signal}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 4 — Livello di attenzione */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">Livello di attenzione</span>
          <span className={`inline-flex items-center px-4 py-2 text-[11px] tracking-[0.18em] uppercase font-light ${
            attention === 'prioritaria'
              ? 'bg-brass/10 text-brass-muted border border-brass/30'
              : attention === 'mirata'
              ? 'bg-ecru text-anthracite/55 border border-sand/50'
              : 'bg-ecru/40 text-anthracite/40 border border-sand/30'
          }`}>
            {attentionLabels[attention]}
          </span>
        </div>

        {/* 5 — La direzione */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">La direzione</span>
          <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/65 font-light">{desiredOutcome}</p>
        </div>

        {/* 6 — Perché questo percorso */}
        <div className="mb-10 -mx-6 md:-mx-10 px-6 md:px-10 py-8 md:py-10 bg-ecru/25 border-t border-b border-sand/30">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">Perché questo percorso</span>
          <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/70 font-light">{percorsoRationale}</p>
        </div>

        {/* 7 — Esperienze suggerite */}
        <div className="mb-10 pt-4">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-6">Esperienze suggerite</span>
          <div className="space-y-4">
            {esperienze.map((item, i) => (
              <motion.div
                key={item.es.nome}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.55, ease: premiumEase }}
                className="border border-sand/40 p-5 md:p-6 bg-ivory/60"
              >
                <div className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-brass/60 mt-[8px] flex-shrink-0" />
                  <div>
                    <h4 className="font-serif text-[20px] md:text-[22px] font-light text-charcoal mb-1">{item.es.nome}</h4>
                    <p className="text-[12px] leading-[1.6] text-anthracite/40 font-light mb-3">{item.es.sottotitolo}</p>
                    <p className="text-[15px] md:text-[16px] leading-[1.75] text-anthracite/60 font-light italic">{item.perche}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 8 — Cosa approfondire in consulenza */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-5">Cosa approfondire in consulenza</span>
          <ul className="space-y-3">
            {consultationFocus.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sand mt-[9px] flex-shrink-0" />
                <p className="text-[15px] md:text-[16px] leading-[1.75] text-anthracite/60 font-light">{point}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 9 — Dal racconto (solo se D10 > 10 char) */}
        {d10Note && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: premiumEase }}
            className="mb-10 border-t border-sand/35 pt-8"
          >
            <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">Dal tuo racconto</span>
            <blockquote className="border-l-[2px] border-brass/30 pl-5">
              <p className="text-[16px] md:text-[17px] leading-[1.85] text-anthracite/55 font-light italic">«{d10Note}»</p>
            </blockquote>
          </motion.div>
        )}

        {/* 10 — Chiusura */}
        <div className="mb-12 border-t border-sand/35 pt-8">
          <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/70 font-light">{closing}</p>
        </div>

        {/* Percorso secondario */}
        {secondPub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-10 p-5 border border-brass/20 bg-brass/5"
          >
            <p className="text-[13px] leading-[1.75] text-anthracite/55 font-light">
              La consulenza potrebbe rivelare un'affinità anche con{' '}
              <strong className="text-charcoal/75 font-normal">{PUBLIC_PERCORSO_NAMES[secondPub]}</strong>
              . La lettura in presenza definirà la direzione più coerente.
            </p>
          </motion.div>
        )}

        {/* CTA */}
        <div className="border-t border-sand/35 pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowTimePicker(true)}
            className="relative overflow-hidden group inline-flex items-center gap-4 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5"
          >
            <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
            <span className="relative z-10 flex items-center gap-4">
              Voglio essere contattata per maggiori informazioni
              <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
          <button
            onClick={onReset}
            className="text-[11px] tracking-[0.2em] uppercase font-light text-anthracite/35 border border-anthracite/15 px-8 py-5 hover:text-anthracite/70 hover:border-anthracite/25 transition-all duration-300"
          >
            Ricomincia
          </button>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-[11px] leading-[1.7] text-anthracite/28 font-light italic text-center max-w-xl mx-auto">
          {REPORT_DISCLAIMER}
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
            <p className="text-[11px] tracking-[0.35em] uppercase text-brass-muted font-light mb-4">
              Luxosa · Consulenza
            </p>

            {/* Sede */}
            <p className="text-[11px] tracking-[0.2em] uppercase text-anthracite/50 font-light mb-2">
              Scegli la sede
            </p>
            <div className="relative mb-8">
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value as typeof LUXOSA_LOCATIONS[number]['id'])}
                className="w-full appearance-none px-5 py-3 border border-sand/60 bg-ivory text-[15px] font-light text-anthracite/80 focus:outline-none focus:border-brass/50 cursor-pointer"
              >
                {LUXOSA_LOCATIONS.map(l => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brass-muted text-[10px]">▾</span>
            </div>

            <h3 className="font-serif text-[22px] font-light text-charcoal leading-snug mb-2">
              In quale fascia oraria preferisci essere ricontattata?
            </h3>
            <div className="h-[1px] bg-sand/60 mb-8" />
            <div className="flex flex-col gap-3">
              {['09:00 – 11:00', '11:00 – 13:00', '13:00 – 15:00', '15:00 – 18:00', 'Indifferente'].map(fascia => (
                <button
                  key={fascia}
                  onClick={() => setSelectedFascia(fascia)}
                  className={`w-full text-left px-5 py-4 border text-[15px] font-light transition-all duration-300 ${
                    selectedFascia === fascia
                      ? 'border-brass/60 bg-ecru text-anthracite'
                      : 'border-sand/60 text-anthracite/70 hover:border-brass/40 hover:bg-ecru/40'
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
                window.open(url, '_blank', 'noopener,noreferrer');
                setShowTimePicker(false);
                setSelectedFascia(null);
              }}
              className={`mt-6 w-full py-4 text-[12px] tracking-[0.2em] uppercase font-light transition-all duration-300 ${
                selectedFascia
                  ? 'bg-charcoal text-ivory hover:bg-deep cursor-pointer'
                  : 'bg-sand/40 text-anthracite/30 cursor-not-allowed'
              }`}
            >
              Invia
            </button>

            <button
              onClick={() => { setShowTimePicker(false); setSelectedFascia(null); }}
              className="mt-3 w-full text-center text-[11px] tracking-[0.2em] uppercase font-light text-anthracite/35 hover:text-anthracite/60 transition-colors duration-300"
            >
              Annulla
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function DiagnosticTakeover({ onReset }: { onReset: () => void }) {
  const [screen, setScreen] = useState<Screen>('disclaimer');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contactData, setContactData] = useState<ContactFormData>({ nome: '', email: '', whatsapp: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const d3Answer = answers['d3'] as string | undefined;
  const questionSequence = useMemo(() => buildQuestionSequence(d3Answer), [d3Answer]);
  const currentQ = questionSequence[step] as QuestionDef | undefined;
  const totalSteps = questionSequence.length;

  // Lock body scroll + scroll to top
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Scroll to top on step/screen change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [step, screen]);

  // Transition quiz → form when all questions answered
  useEffect(() => {
    if (screen === 'quiz' && step >= totalSteps) {
      setScreen('form');
    }
  }, [step, totalSteps, screen]);

  const advanceStep = useCallback(() => setStep(s => s + 1), []);

  const handleSingleSelect = useCallback((qId: string, optId: string) => {
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    setTimeout(advanceStep, 450);
  }, [advanceStep]);

  const handleMultiToggle = useCallback((qId: string, optId: string, max: number) => {
    setAnswers(prev => {
      const cur = (prev[qId] as string[] | undefined) ?? [];
      if (cur.includes(optId)) return { ...prev, [qId]: cur.filter(id => id !== optId) };
      if (cur.length >= max) return prev;
      return { ...prev, [qId]: [...cur, optId] };
    });
  }, []);

  const handleTextChange = useCallback((qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  }, []);

  const handleFormSubmit = useCallback((data: ContactFormData) => {
    setContactData(data);
    setScreen('result');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="fixed inset-0 z-[9999] bg-ivory flex flex-col overflow-hidden"
    >
      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-ivory border-b border-sand/40 h-[64px] md:h-[80px] w-full flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-10 flex items-center justify-between gap-4">

          {/* Left: logo + optional back */}
          <div className="w-28 md:w-40 flex items-center flex-shrink-0 gap-3">
            <img
              src="/images/luxosa-logo-orizzontale-bianco-tras.png"
              alt="Luxosa"
              className="h-5 md:h-6 w-auto object-contain brightness-0"
            />
            {screen === 'quiz' && step > 0 && (
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                className="flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-charcoal/40 hover:text-charcoal transition-colors group outline-none"
              >
                <ArrowLeft size={14} strokeWidth={1} className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="hidden sm:inline font-light">Indietro</span>
              </button>
            )}
          </div>

          {/* Center: progress or label */}
          <div className="flex-1 min-w-0 flex justify-center">
            {screen === 'quiz' && currentQ ? (
              <div className="w-full max-w-[400px]">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[9px] tracking-[0.25em] uppercase text-brass font-bold">Luxosa Test</span>
                  <span className="text-[9px] text-charcoal/30 font-light italic hidden sm:block">{currentQ.label}</span>
                </div>
                <div className="h-[2px] bg-sand/30 w-full">
                  <motion.div
                    className="h-full bg-brass"
                    animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                    transition={{ duration: 0.6, ease: premiumEase }}
                  />
                </div>
                <p className="text-[8px] text-anthracite/25 font-light mt-1">{step + 1} di {totalSteps}</p>
              </div>
            ) : (
              <span className="text-[10px] tracking-[0.4em] uppercase font-light text-anthracite/35">
                {screen === 'result' ? 'Luxosa Test · Orientamento personalizzato' : screen === 'form' ? 'Ultimo passo' : ''}
              </span>
            )}
          </div>

          {/* Right: close */}
          <div className="w-20 md:w-32 flex justify-end flex-shrink-0">
            <button
              onClick={onReset}
              aria-label="Chiudi"
              className="group flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-anthracite/30 hover:text-anthracite transition-colors duration-300 outline-none"
            >
              <span className="hidden sm:inline font-light">Chiudi</span>
              <div className="w-8 h-8 border border-sand/60 rounded-full flex items-center justify-center group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-ivory transition-all duration-400">
                <X size={14} strokeWidth={1} />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ──────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-ivory">
        <AnimatePresence mode="wait">
          {screen === 'disclaimer' && (
            <DisclaimerScreen key="disclaimer" onAccept={() => setScreen('quiz')} />
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

          {screen === 'result' && (
            <ResultScreen
              key="result"
              nome={contactData.nome}
              email={contactData.email}
              whatsapp={contactData.whatsapp}
              answers={answers}
              onReset={onReset}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
