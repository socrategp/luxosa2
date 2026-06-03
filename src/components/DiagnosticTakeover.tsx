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

// -- CONSTANTS --------------------------------------------------

import { premiumEase } from '../lib/animations';
import { t } from '../i18n/t';

const MAX_SCORES: Scores = {
  cute: 19,
  rinascita: 17,
  colore: 15,
  armonia: 15,
  rituale: 20,
};

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

// -- FASE 1: CONOSCENZA (comuni a tutte) ------------------------

function getQuestionPhase1(): QuestionDef[] {
  return [
  {
    id: 'd1',
    label:t('test:diagnostic.takeover.001'),
    question:t('test:diagnostic.takeover.002'),
    selectionType: 'single',
    options: [
      { id: 'd1_lisci', text:t('test:diagnostic.takeover.003'), scores: { rinascita: 1, colore: 1 } },
      { id: 'd1_mossi', text:t('test:diagnostic.takeover.004'), scores: { rinascita: 1, colore: 1 } },
      { id: 'd1_ricci', text:t('test:diagnostic.takeover.005'), scores: { armonia: 2 } },
      { id: 'd1_molto_ricci', text:t('test:diagnostic.takeover.006'), scores: { armonia: 2 } },
    ],
  },
  {
    id: 'd2',
    label:t('test:diagnostic.takeover.007'),
    question:t('test:diagnostic.takeover.008'),
    subtitle:t('test:diagnostic.takeover.009'),
    selectionType: 'multi',
    maxSelections: 2,
    options: [
      { id: 'd2_fragili', text:t('test:diagnostic.takeover.010'), subtext:t('test:diagnostic.takeover.011'), scores: { rinascita: 2 } },
      { id: 'd2_crespi', text:t('test:diagnostic.takeover.012'), subtext:t('test:diagnostic.takeover.013'), scores: { armonia: 1 } },
      { id: 'd2_sottili', text:t('test:diagnostic.takeover.014'), subtext:t('test:diagnostic.takeover.015'), scores: { cute: 2 } },
      { id: 'd2_grassi', text:t('test:diagnostic.takeover.016'), subtext:t('test:diagnostic.takeover.017'), scores: { cute: 2 } },
      { id: 'd2_secchi', text:t('test:diagnostic.takeover.018'), subtext:t('test:diagnostic.takeover.019'), scores: { rinascita: 1, colore: 1 } },
      { id: 'd2_sani', text:t('test:diagnostic.takeover.020'), subtext:t('test:diagnostic.takeover.021'), scores: { armonia: 1, rituale: 1 } },
    ],
  },
  {
    id: 'd3',
    label:t('test:diagnostic.takeover.022'),
    question:t('test:diagnostic.takeover.023'),
    subtitle:t('test:diagnostic.takeover.024'),
    selectionType: 'single',
    options: [
      { id: 'd3_cute', text:t('test:diagnostic.takeover.025'), subtext:t('test:diagnostic.takeover.026'), scores: { cute: 3 } },
      { id: 'd3_rovinato', text:t('test:diagnostic.takeover.027'), subtext:t('test:diagnostic.takeover.028'), scores: { rinascita: 3 } },
      { id: 'd3_colore', text:t('test:diagnostic.takeover.029'), subtext:t('test:diagnostic.takeover.030'), scores: { colore: 3 } },
      { id: 'd3_forma', text:t('test:diagnostic.takeover.031'), subtext:t('test:diagnostic.takeover.032'), scores: { armonia: 3 } },
      { id: 'd3_tutto', text:t('test:diagnostic.takeover.033'), subtext:t('test:diagnostic.takeover.034'), scores: { rituale: 3 } },
    ],
  },
  ];
}

// -- FASE 2: APPROFONDIMENTO (ramificato) -----------------------

function getQuestionBranches(): Record<BranchKey, QuestionDef[]> {
  return {
  cute: [
    {
      id: 'd4a',
      label:t('test:diagnostic.takeover.035'),
      question:t('test:diagnostic.takeover.036'),
      subtitle:t('test:diagnostic.takeover.037'),
      selectionType: 'multi',
      maxSelections: 2,
      options: [
        { id: 'd4a_prurito', text:t('test:diagnostic.takeover.038'), scores: { cute: 1 } },
        { id: 'd4a_desquamazione', text:t('test:diagnostic.takeover.039'), scores: { cute: 1 } },
        { id: 'd4a_grassa', text:t('test:diagnostic.takeover.040'), scores: { cute: 1 } },
        { id: 'd4a_rossori', text:t('test:diagnostic.takeover.041'), scores: { cute: 1 } },
        { id: 'd4a_tira', text:t('test:diagnostic.takeover.042'), scores: { cute: 1 } },
      ],
    },
    {
      id: 'd5a',
      label:t('test:diagnostic.takeover.043'),
      question:t('test:diagnostic.takeover.044'),
      selectionType: 'single',
      options: [
        { id: 'd5a_settimane', text:t('test:diagnostic.takeover.045'), scores: {} },
        { id: 'd5a_mesi', text:t('test:diagnostic.takeover.046'), scores: { cute: 1 } },
        { id: 'd5a_anno', text:t('test:diagnostic.takeover.047'), scores: { cute: 2, rituale: 1 } },
        { id: 'd5a_sempre', text:t('test:diagnostic.takeover.048'), scores: { cute: 2, rituale: 1 } },
      ],
    },
    {
      id: 'd6a',
      label:t('test:diagnostic.takeover.049'),
      question:t('test:diagnostic.takeover.050'),
      selectionType: 'single',
      options: [
        { id: 'd6a_mai', text:t('test:diagnostic.takeover.051'), scores: {} },
        { id: 'd6a_prodotti', text:t('test:diagnostic.takeover.052'), scores: { cute: 1 } },
        { id: 'd6a_salone', text:t('test:diagnostic.takeover.053'), scores: { cute: 2 } },
        { id: 'd6a_dermatologo', text:t('test:diagnostic.takeover.054'), scores: { cute: 1 } },
      ],
    },
    {
      id: 'd7a',
      label:t('test:diagnostic.takeover.055'),
      question:t('test:diagnostic.takeover.056'),
      selectionType: 'single',
      options: [
        { id: 'd7a_no', text:t('test:diagnostic.takeover.057'), scores: {} },
        { id: 'd7a_lieve', text:t('test:diagnostic.takeover.058'), scores: { cute: 1 } },
        { id: 'd7a_evidente', text:t('test:diagnostic.takeover.059'), scores: { cute: 2, rituale: 1 } },
      ],
    },
  ],

  struttura: [
    {
      id: 'd4b',
      label:t('test:diagnostic.takeover.060'),
      question:t('test:diagnostic.takeover.061'),
      subtitle:t('test:diagnostic.takeover.062'),
      selectionType: 'multi',
      maxSelections: 3,
      options: [
        { id: 'd4b_colorazioni', text:t('test:diagnostic.takeover.063'), scores: { rinascita: 1 } },
        { id: 'd4b_decolorazioni', text:t('test:diagnostic.takeover.064'), scores: { rinascita: 1 } },
        { id: 'd4b_stiratura', text:t('test:diagnostic.takeover.065'), scores: { rinascita: 1 } },
        { id: 'd4b_calore', text:t('test:diagnostic.takeover.066'), scores: { rinascita: 1 } },
        { id: 'd4b_aggressivi', text:t('test:diagnostic.takeover.067'), scores: { rinascita: 1 } },
      ],
    },
    {
      id: 'd5b',
      label:t('test:diagnostic.takeover.068'),
      question:t('test:diagnostic.takeover.069'),
      selectionType: 'single',
      options: [
        { id: 'd5b_sane', text:t('test:diagnostic.takeover.070'), scores: {} },
        { id: 'd5b_aperte', text:t('test:diagnostic.takeover.071'), scores: { rinascita: 1 } },
        { id: 'd5b_spezzano', text:t('test:diagnostic.takeover.072'), scores: { rinascita: 2 } },
      ],
    },
    {
      id: 'd6b',
      label:t('test:diagnostic.takeover.073'),
      question:t('test:diagnostic.takeover.074'),
      selectionType: 'single',
      options: [
        { id: 'd6b_morbido', text:t('test:diagnostic.takeover.075'), scores: {} },
        { id: 'd6b_ruvido', text:t('test:diagnostic.takeover.076'), scores: { rinascita: 1 } },
        { id: 'd6b_secco', text:t('test:diagnostic.takeover.077'), scores: { rinascita: 2 } },
        { id: 'd6b_paglia', text:t('test:diagnostic.takeover.078'), scores: { rinascita: 3, rituale: 1 } },
      ],
    },
    {
      id: 'd7b',
      label:t('test:diagnostic.takeover.079'),
      question:t('test:diagnostic.takeover.080'),
      selectionType: 'single',
      options: [
        { id: 'd7b_morbidezza', text:t('test:diagnostic.takeover.081'), scores: { rinascita: 1 } },
        { id: 'd7b_rinforzare', text:t('test:diagnostic.takeover.082'), scores: { rinascita: 2 } },
        { id: 'd7b_ricominciare', text:t('test:diagnostic.takeover.083'), scores: { rinascita: 2, rituale: 2 } },
      ],
    },
  ],

  colore: [
    {
      id: 'd4c',
      label:t('test:diagnostic.takeover.084'),
      question:t('test:diagnostic.takeover.085'),
      selectionType: 'single',
      options: [
        { id: 'd4c_naturale', text:t('test:diagnostic.takeover.086'), scores: { colore: 1 } },
        { id: 'd4c_tinta', text:t('test:diagnostic.takeover.087'), scores: { colore: 2 } },
        { id: 'd4c_decolorazioni', text:t('test:diagnostic.takeover.088'), scores: { colore: 2, rinascita: 1 } },
        { id: 'd4c_grigi_coprire', text:t('test:diagnostic.takeover.089'), scores: { colore: 2 } },
        { id: 'd4c_grigi_valorizzare', text:t('test:diagnostic.takeover.090'), scores: { colore: 2, armonia: 1 } },
      ],
    },
    {
      id: 'd5c',
      label:t('test:diagnostic.takeover.091'),
      question:t('test:diagnostic.takeover.092'),
      subtitle:t('test:diagnostic.takeover.093'),
      selectionType: 'multi',
      maxSelections: 2,
      options: [
        { id: 'd5c_spegne', text:t('test:diagnostic.takeover.094'), scores: { colore: 1 } },
        { id: 'd5c_luminoso', text:t('test:diagnostic.takeover.095'), scores: { colore: 1 } },
        { id: 'd5c_uniforme', text:t('test:diagnostic.takeover.096'), scores: { colore: 1 } },
        { id: 'd5c_viso', text:t('test:diagnostic.takeover.097'), scores: { colore: 1, armonia: 1 } },
        { id: 'd5c_danneggia', text:t('test:diagnostic.takeover.098'), scores: { colore: 1, rinascita: 2 } },
      ],
    },
    {
      id: 'd6c',
      label:t('test:diagnostic.takeover.099'),
      question:t('test:diagnostic.takeover.100'),
      selectionType: 'single',
      options: [
        { id: 'd6c_frequente', text:t('test:diagnostic.takeover.101'), scores: { colore: 2, rinascita: 1 } },
        { id: 'd6c_normale', text:t('test:diagnostic.takeover.102'), scores: { colore: 1 } },
        { id: 'd6c_raro', text:t('test:diagnostic.takeover.103'), scores: {} },
        { id: 'd6c_mai', text:t('test:diagnostic.takeover.104'), scores: {} },
      ],
    },
    {
      id: 'd7c',
      label:t('test:diagnostic.takeover.105'),
      question:t('test:diagnostic.takeover.106'),
      selectionType: 'single',
      options: [
        { id: 'd7c_naturalezza', text:t('test:diagnostic.takeover.107'), scores: { colore: 1 } },
        { id: 'd7c_luminosita', text:t('test:diagnostic.takeover.108'), scores: { colore: 2 } },
        { id: 'd7c_copertura', text:t('test:diagnostic.takeover.109'), scores: { colore: 1 } },
        { id: 'd7c_cambiamento', text:t('test:diagnostic.takeover.110'), scores: { colore: 1, rituale: 1 } },
        { id: 'd7c_bianco', text:t('test:diagnostic.takeover.111'), scores: { colore: 2 } },
      ],
    },
  ],

  forma: [
    {
      id: 'd4d',
      label:t('test:diagnostic.takeover.112'),
      question:t('test:diagnostic.takeover.113'),
      selectionType: 'single',
      options: [
        { id: 'd4d_volume', text:t('test:diagnostic.takeover.114'), scores: { armonia: 2 } },
        { id: 'd4d_ricci', text:t('test:diagnostic.takeover.115'), scores: { armonia: 2 } },
        { id: 'd4d_piega', text:t('test:diagnostic.takeover.116'), scores: { armonia: 1 } },
        { id: 'd4d_taglio', text:t('test:diagnostic.takeover.117'), scores: { armonia: 1, rituale: 1 } },
      ],
    },
    {
      id: 'd5d',
      label:t('test:diagnostic.takeover.118'),
      question:t('test:diagnostic.takeover.119'),
      selectionType: 'single',
      options: [
        { id: 'd5d_poco', text:t('test:diagnostic.takeover.120'), scores: { armonia: 1 } },
        { id: 'd5d_medio', text:t('test:diagnostic.takeover.121'), scores: {} },
        { id: 'd5d_molto', text:t('test:diagnostic.takeover.122'), scores: { armonia: 1, rituale: 1 } },
        { id: 'd5d_troppo', text:t('test:diagnostic.takeover.123'), scores: { armonia: 1, rituale: 1 } },
      ],
    },
    {
      id: 'd6d',
      label:t('test:diagnostic.takeover.124'),
      question:t('test:diagnostic.takeover.125'),
      selectionType: 'single',
      options: [
        { id: 'd6d_mai', text:t('test:diagnostic.takeover.126'), scores: {} },
        { id: 'd6d_qualche', text:t('test:diagnostic.takeover.127'), scores: { rinascita: 1 } },
        { id: 'd6d_sempre', text:t('test:diagnostic.takeover.128'), scores: { rinascita: 2, armonia: 1 } },
      ],
    },
    {
      id: 'd7d',
      label:t('test:diagnostic.takeover.129'),
      question:t('test:diagnostic.takeover.130'),
      selectionType: 'single',
      options: [
        { id: 'd7d_liberi', text:t('test:diagnostic.takeover.131'), scores: { armonia: 2 } },
        { id: 'd7d_disciplinati', text:t('test:diagnostic.takeover.132'), scores: { armonia: 1 } },
        { id: 'd7d_voluminosi', text:t('test:diagnostic.takeover.133'), scores: { armonia: 1 } },
        { id: 'd7d_scoprire', text:t('test:diagnostic.takeover.134'), scores: { armonia: 1, rituale: 2 } },
      ],
    },
  ],

  completo: [
    {
      id: 'd4e',
      label:t('test:diagnostic.takeover.135'),
      question:t('test:diagnostic.takeover.136'),
      selectionType: 'single',
      options: [
        { id: 'd4e_cute', text:t('test:diagnostic.takeover.137'), scores: { rituale: 2, cute: 1 } },
        { id: 'd4e_capello', text:t('test:diagnostic.takeover.138'), scores: { rituale: 2, rinascita: 1 } },
        { id: 'd4e_colore', text:t('test:diagnostic.takeover.139'), scores: { rituale: 2, colore: 1 } },
        { id: 'd4e_forma', text:t('test:diagnostic.takeover.140'), scores: { rituale: 2, armonia: 1 } },
        { id: 'd4e_nonso', text:t('test:diagnostic.takeover.141'), scores: { rituale: 3 } },
      ],
    },
    {
      id: 'd5e',
      label:t('test:diagnostic.takeover.142'),
      question:t('test:diagnostic.takeover.143'),
      selectionType: 'single',
      options: [
        { id: 'd5e_cercando', text:t('test:diagnostic.takeover.144'), scores: { rituale: 1 } },
        { id: 'd5e_insoddisfatta', text:t('test:diagnostic.takeover.145'), scores: { rituale: 1 } },
        { id: 'd5e_prima', text:t('test:diagnostic.takeover.146'), scores: { rituale: 1 } },
      ],
    },
    {
      id: 'd6e',
      label:t('test:diagnostic.takeover.147'),
      question:t('test:diagnostic.takeover.148'),
      selectionType: 'single',
      options: [
        { id: 'd6e_risultati', text:t('test:diagnostic.takeover.149'), scores: { rituale: 1 } },
        { id: 'd6e_presa', text:t('test:diagnostic.takeover.150'), scores: { rituale: 2 } },
        { id: 'd6e_capire', text:t('test:diagnostic.takeover.151'), scores: { rituale: 1 } },
        { id: 'd6e_tutto', text:t('test:diagnostic.takeover.152'), scores: { rituale: 3 } },
      ],
    },
    {
      id: 'd7e',
      label:t('test:diagnostic.takeover.153'),
      question:t('test:diagnostic.takeover.154'),
      selectionType: 'single',
      options: [
        { id: 'd7e_se_funziona', text:t('test:diagnostic.takeover.155'), scores: { rituale: 1 } },
        { id: 'd7e_continuita', text:t('test:diagnostic.takeover.156'), scores: { rituale: 1 } },
        { id: 'd7e_valutare', text:t('test:diagnostic.takeover.157'), scores: { rituale: 1 } },
      ],
    },
  ],
  };
}

// -- FASE 3: STILE DI VITA --------------------------------------

function getQuestionPhase3(): QuestionDef[] {
  return [
  {
    id: 'd8',
    label:t('test:diagnostic.takeover.158'),
    question:t('test:diagnostic.takeover.159'),
    selectionType: 'single',
    options: [
      { id: 'd8_ogni_giorno', text:t('test:diagnostic.takeover.160'), scores: { cute: 1 } },
      { id: 'd8_2_3', text:t('test:diagnostic.takeover.161'), scores: {} },
      { id: 'd8_settimana', text:t('test:diagnostic.takeover.162'), scores: {} },
      { id: 'd8_meno', text:t('test:diagnostic.takeover.163'), scores: { cute: 1 } },
    ],
  },
  {
    id: 'd9',
    label:t('test:diagnostic.takeover.164'),
    question:t('test:diagnostic.takeover.165'),
    selectionType: 'single',
    options: [
      { id: 'd9_amo', text:t('test:diagnostic.takeover.166'), scores: { armonia: 1 } },
      { id: 'd9_non_piacciono', text:t('test:diagnostic.takeover.167'), scores: { rituale: 1 } },
      { id: 'd9_trascuro', text:t('test:diagnostic.takeover.168'), scores: { rituale: 1, cute: 1 } },
      { id: 'd9_ci_lavoro', text:t('test:diagnostic.takeover.169'), scores: { rituale: 1 } },
    ],
  },
  ];
}

// -- D10: SPAZIO LIBERO -----------------------------------------

function getQuestionD10(): QuestionDef {
  return {
    id: 'd10',
    label:t('test:diagnostic.takeover.170'),
    question:t('test:diagnostic.takeover.171'),
    subtitle:t('test:diagnostic.takeover.172'),
    selectionType: 'text',
    options: [],
  };
}

// -- HELPERS ----------------------------------------------------

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
  const questionPhase1 = getQuestionPhase1();
  if (!d3Answer) return questionPhase1;
  const questionBranches = getQuestionBranches();
  return [
    ...questionPhase1,
    ...questionBranches[getBranchKey(d3Answer)],
    ...getQuestionPhase3(),
    getQuestionD10(),
  ];
}

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

  // Bonus: D4a =2 risposte ? +1 cute
  const d4a = answers['d4a'];
  if (Array.isArray(d4a) && d4a.length >= 2) scores.cute += 1;

  // Bonus: D4b decolorazioni+stiratura ? +1 rinascita; =3 ? +1 rituale
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

// -- ESPERIENZE UFFICIALI (9) ------------------------------------

function getEsperienzaDefs(): Record<string, EsperienzaDef> {
  return {
    consulenzeSpecialistiche: { nome:t('test:diagnostic.takeover.173'), sottotitolo:t('test:diagnostic.takeover.174') },
    areaBenessere: { nome:t('test:diagnostic.takeover.175'), sottotitolo:t('test:diagnostic.takeover.176') },
    cheratinaNutrizionePro: { nome:t('test:diagnostic.takeover.177'), sottotitolo:t('test:diagnostic.takeover.178') },
    piegaLux: { nome:t('test:diagnostic.takeover.179'), sottotitolo:t('test:diagnostic.takeover.180') },
    taglioSignature: { nome:t('test:diagnostic.takeover.181'), sottotitolo:t('test:diagnostic.takeover.182') },
    nuances: { nome:t('test:diagnostic.takeover.183'), sottotitolo:t('test:diagnostic.takeover.184') },
    luceSignature: { nome:t('test:diagnostic.takeover.185'), sottotitolo:t('test:diagnostic.takeover.186') },
    ricciOsa: { nome:t('test:diagnostic.takeover.187'), sottotitolo:t('test:diagnostic.takeover.188') },
    ricciOso: { nome:t('test:diagnostic.takeover.189'), sottotitolo:t('test:diagnostic.takeover.190') },
  };
}

// -- MAPPING PUBBLICO --------------------------------------------

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

// -- LIVELLO DI ATTENZIONE ---------------------------------------

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

// -- CONDIZIONE DI PARTENZA --------------------------------------

function buildConditionSummary(answers: Answers, _primary: Percorso): string {
  const d1 = answers['d1'] as string | undefined;
  const d2 = answers['d2'];
  const d3 = answers['d3'] as string | undefined;
  const d8 = answers['d8'] as string | undefined;
  const d9 = answers['d9'] as string | undefined;

  const tipoMap: Record<string, string> = {
    d1_lisci: t('report:diagnostic.shortLabels.d1_lisci'), d1_mossi: t('report:diagnostic.shortLabels.d1_mossi'),
    d1_ricci: t('report:diagnostic.shortLabels.d1_ricci'), d1_molto_ricci:t('report:diagnostic.001'),
  };
  const tipo = d1 ? (tipoMap[d1] ?? t('report:diagnostic.shortLabels.naturalStructure')) :t('report:diagnostic.002');

  const statoLabels: Record<string, string> = {
    d2_fragili:t('report:diagnostic.003'),
    d2_crespi:t('report:diagnostic.004'),
    d2_sottili:t('report:diagnostic.005'),
    d2_grassi:t('report:diagnostic.006'),
    d2_secchi:t('report:diagnostic.007'),
    d2_sani:t('report:diagnostic.008'),
  };
  const d2arr = Array.isArray(d2) ? d2 : d2 ? [d2] : [];
  let statoDesc = d2arr.map(id => statoLabels[id] ?? '').filter(Boolean).join(t('report:diagnostic.shortLabels.joinAnd'));
  // Evita contraddizione: "in buona salute" + danno da colore rilevato in d5c
  const d5cForCond = answers['d5c'];
  const d5cArrForCond = Array.isArray(d5cForCond) ? (d5cForCond as string[]) : d5cForCond ? [d5cForCond as string] : [];
  if (d3 && getBranchKey(d3) === 'colore' && d5cArrForCond.includes('d5c_danneggia') && d2arr.includes('d2_sani')) {
    statoDesc = t('report:diagnostic.shortLabels.statoColoreBase');
  }

  const lavaggio: Record<string, string> = {
    d8_ogni_giorno:t('report:diagnostic.009'), d8_2_3:t('report:diagnostic.010'),
    d8_settimana:t('report:diagnostic.011'), d8_meno:t('report:diagnostic.012'),
  };
  const lavaggioDesc = d8 ? (lavaggio[d8] ?? '') : '';

  const branch = d3 ? getBranchKey(d3) : 'completo';
  let specificPart = '';

  if (branch === 'cute') {
    const d4a = answers['d4a'];
    const d4aArr = Array.isArray(d4a) ? d4a : d4a ? [d4a] : [];
    const sintoMap: Record<string, string> = {
      d4a_prurito: t('report:diagnostic.shortLabels.d4a_prurito'), d4a_desquamazione: t('report:diagnostic.shortLabels.d4a_desquamazione'),
      d4a_grassa:t('report:diagnostic.013'), d4a_rossori: t('report:diagnostic.shortLabels.d4a_rossori'), d4a_tira:t('report:diagnostic.014'),
    };
    const sintomi = d4aArr.map(id => sintoMap[id] ?? '').filter(Boolean).join(', ');
    const d5a = answers['d5a'] as string | undefined;
    const durataMap: Record<string, string> = {
      d5a_settimane:t('report:diagnostic.015'), d5a_mesi:t('report:diagnostic.016'),
      d5a_anno:t('report:diagnostic.017'), d5a_sempre:t('report:diagnostic.018'),
    };
    const durata = d5a ? (durataMap[d5a] ?? '') : '';
    specificPart = t('report:templates.cuteSpecific', {
      sintomiPart: sintomi ? t('report:templates.cuteSymptomsPart', { sintomi }) : '',
      durataPart: durata ? t('report:templates.cuteDurationPart', { durata }) : '',
    });
  } else if (branch === 'struttura') {
    const d4b = answers['d4b'];
    const d4bArr = Array.isArray(d4b) ? d4b : d4b ? [d4b] : [];
    const trattMap: Record<string, string> = {
      d4b_colorazioni: t('report:diagnostic.shortLabels.d4b_colorazioni'), d4b_decolorazioni: t('report:diagnostic.shortLabels.d4b_decolorazioni'),
      d4b_stiratura: t('report:diagnostic.shortLabels.d4b_stiratura'), d4b_calore:t('report:diagnostic.019'), d4b_aggressivi:t('report:diagnostic.020'),
    };
    const trattamenti = d4bArr.map(id => trattMap[id] ?? '').filter(Boolean).join(', ');
    const d5b = answers['d5b'] as string | undefined;
    const condMap: Record<string, string> = {
      d5b_sane:t('report:diagnostic.021'), d5b_aperte:t('report:diagnostic.022'),
      d5b_spezzano:t('report:diagnostic.023'),
    };
    const cond = d5b ? (condMap[d5b] ?? '') : '';
    specificPart = t('report:templates.structureSpecific', {
      trattamentoPart: trattamenti ? t('report:templates.structureTreatments', { trattamenti }) : t('report:diagnostic.024'),
      condPart: cond ? t('report:templates.structureCondition', { cond }) : '',
    }).trim();
  } else if (branch === 'colore') {
    const d4c = answers['d4c'] as string | undefined;
    const colorMap: Record<string, string> = {
      d4c_naturale:t('report:diagnostic.025'), d4c_tinta:t('report:diagnostic.026'),
      d4c_decolorazioni: t('report:diagnostic.shortLabels.d4c_decolorazioni'), d4c_grigi_coprire:t('report:diagnostic.027'),
      d4c_grigi_valorizzare:t('report:diagnostic.028'),
    };
    const colorDesc = d4c ? (colorMap[d4c] ?? t('report:diagnostic.shortLabels.colorFallback')) :t('report:diagnostic.029');
    const d5c = answers['d5c'];
    const d5cArr = Array.isArray(d5c) ? d5c : d5c ? [d5c] : [];
    const preoMap: Record<string, string> = {
      d5c_spegne:t('report:diagnostic.030'), d5c_luminoso:t('report:diagnostic.031'),
      d5c_uniforme:t('report:diagnostic.032'), d5c_viso:t('report:diagnostic.033'),
      d5c_danneggia:t('report:diagnostic.034'),
    };
    const preoc = d5cArr.map(id => preoMap[id] ?? '').filter(Boolean).join(' e ');
    specificPart = t('report:templates.colorSpecific', {
      colorDesc,
      preocPart: preoc ? t('report:templates.colorConcern', { preoc }) : '',
    });
  } else if (branch === 'forma') {
    const d4d = answers['d4d'];
    const d4dArr = Array.isArray(d4d) ? d4d : d4d ? [d4d] : [];
    const formaMap: Record<string, string> = {
      d4d_volume:t('report:diagnostic.035'), d4d_ricci:t('report:diagnostic.036'),
      d4d_piega:t('report:diagnostic.037'), d4d_taglio:t('report:diagnostic.038'),
    };
    const formaDesc = d4dArr.map(id => formaMap[id] ?? '').filter(Boolean).join(', ');
    const d5d = answers['d5d'] as string | undefined;
    const volumeMap: Record<string, string> = {
      d5d_poco:t('report:diagnostic.039'), d5d_medio:t('report:diagnostic.040'),
      d5d_molto:t('report:diagnostic.041'), d5d_troppo:t('report:diagnostic.042'),
    };
    const volumeDesc = d5d ? (volumeMap[d5d] ?? '') : '';
    specificPart = t('report:templates.formSpecific', {
      formaDesc: formaDesc || t('report:diagnostic.165'),
      volumePart: volumeDesc ? t('report:templates.formVolumePart', { volumeDesc }) : '',
    });
  } else {
    const d5e = answers['d5e'] as string | undefined;
    const d6e = answers['d6e'] as string | undefined;
    const satMap: Record<string, string> = {
      d5e_cercando:t('report:diagnostic.043'),
      d5e_insoddisfatta:t('report:diagnostic.044'),
      d5e_prima:t('report:diagnostic.045'),
    };
    const d6eMap: Record<string, string> = {
      d6e_risultati:t('report:diagnostic.046'),
      d6e_presa:t('report:diagnostic.047'),
      d6e_capire:t('report:diagnostic.048'),
      d6e_tutto:t('report:diagnostic.049'),
    };
    const satDesc = d5e ? (satMap[d5e] ?? '') : '';
    const aspDesc = d6e ? (d6eMap[d6e] ?? '') : '';
    specificPart = t('report:templates.completeSpecific', {
      satPart: satDesc ? t('report:templates.completeSatisfactionPart', { satDesc }) : '',
      aspPart: aspDesc ? t('report:templates.completeAspirationPart', { aspDesc }) : '',
    }).trim();
  }

  const d9Ctx: Record<string, string> = {
    d9_amo:t('report:diagnostic.050'),
    d9_non_piacciono:t('report:diagnostic.051'),
    d9_trascuro:t('report:diagnostic.052'),
    d9_ci_lavoro:t('report:diagnostic.053'),
  };
  const d9Phrase = d9 ? (d9Ctx[d9] ?? '') : '';

  const parts = [
    t('report:templates.hairSummary', {
      tipo,
      statoPart: statoDesc ? t('report:templates.hairStatePart', { statoDesc }) : '',
    }),
    specificPart,
    d9Phrase,
    lavaggioDesc ? t('report:templates.washFrequency', { lavaggioDesc }) : '',
  ].filter(Boolean);

  return parts.join(' ');
}

// -- SEGNALI PRINCIPALI ------------------------------------------

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
    if (d4aArr.includes('d4a_prurito')) signals.push(t('report:diagnostic.054'));
    if (d4aArr.includes('d4a_desquamazione')) signals.push(t('report:diagnostic.055'));
    if (d4aArr.includes('d4a_grassa')) signals.push(t('report:diagnostic.056'));
    if (d4aArr.includes('d4a_rossori')) signals.push(t('report:diagnostic.057'));
    if (d4aArr.includes('d4a_tira')) signals.push(t('report:diagnostic.058'));
    const d7a = answers['d7a'] as string | undefined;
    if (d7a === 'd7a_evidente') signals.push(t('report:diagnostic.059'));
    else if (d7a === 'd7a_lieve') signals.push(t('report:diagnostic.060'));
  } else if (branch === 'struttura') {
    const d5b = answers['d5b'] as string | undefined;
    if (d5b === 'd5b_spezzano') signals.push(t('report:diagnostic.061'));
    else if (d5b === 'd5b_aperte') signals.push(t('report:diagnostic.062'));
    const d6b = answers['d6b'] as string | undefined;
    if (d6b === 'd6b_paglia') signals.push(t('report:diagnostic.063'));
    else if (d6b === 'd6b_secco') signals.push(t('report:diagnostic.064'));
    else if (d6b === 'd6b_ruvido') signals.push(t('report:diagnostic.065'));
    const d7b = answers['d7b'] as string | undefined;
    if (d7b === 'd7b_ricominciare') signals.push(t('report:diagnostic.066'));
    const d4b = answers['d4b'];
    const d4bArr = Array.isArray(d4b) ? d4b : d4b ? [d4b] : [];
    if (d4bArr.includes('d4b_decolorazioni') && d4bArr.includes('d4b_stiratura')) {
      signals.push(t('report:diagnostic.067'));
    } else if (d4bArr.includes('d4b_decolorazioni')) {
      signals.push(t('report:diagnostic.068'));
    }
  } else if (branch === 'colore') {
    const d5c = answers['d5c'];
    const d5cArr = Array.isArray(d5c) ? d5c : d5c ? [d5c] : [];
    if (d5cArr.includes('d5c_spegne')) signals.push(t('report:diagnostic.069'));
    if (d5cArr.includes('d5c_luminoso')) signals.push(t('report:diagnostic.070'));
    if (d5cArr.includes('d5c_uniforme')) signals.push(t('report:diagnostic.071'));
    if (d5cArr.includes('d5c_danneggia')) signals.push(t('report:diagnostic.072'));
    const d6c = answers['d6c'] as string | undefined;
    if (d6c === 'd6c_frequente') signals.push(t('report:diagnostic.073'));
    const d7c = answers['d7c'] as string | undefined;
    if (d7c === 'd7c_luminosita') signals.push(t('report:diagnostic.074'));
    else if (d7c === 'd7c_naturalezza') signals.push(t('report:diagnostic.075'));
    else if (d7c === 'd7c_copertura') signals.push(t('report:diagnostic.076'));
    else if (d7c === 'd7c_cambiamento') signals.push(t('report:diagnostic.077'));
    else if (d7c === 'd7c_bianco') signals.push(t('report:diagnostic.078'));
  } else if (branch === 'forma') {
    const d1 = answers['d1'] as string | undefined;
    if (d1 === 'd1_ricci' || d1 === 'd1_molto_ricci') signals.push(t('report:diagnostic.079'));
    else if (d1 === 'd1_mossi') signals.push(t('report:diagnostic.080'));
    // Relational signal — alta priorità, prima dei segnali tecnici
    if (d9 === 'd9_non_piacciono') signals.push(t('report:diagnostic.081'));
    else if (d9 === 'd9_trascuro') signals.push(t('report:diagnostic.082'));
    // Condizione della fibra — segnali da d2, rilevanti anche in percorso forma
    if (d2arr.includes('d2_fragili')) signals.push(t('report:diagnostic.083'));
    if (d2arr.includes('d2_secchi')) signals.push(t('report:diagnostic.084'));
    if (d2arr.includes('d2_crespi')) signals.push(t('report:diagnostic.085'));
    if (d2arr.includes('d2_grassi')) signals.push(t('report:diagnostic.086'));
    const d4d = answers['d4d'];
    const d4dArr = Array.isArray(d4d) ? d4d : d4d ? [d4d] : [];
    if (d4dArr.includes('d4d_volume')) signals.push(t('report:diagnostic.087'));
    if (d4dArr.includes('d4d_ricci')) signals.push(t('report:diagnostic.088'));
    if (d4dArr.includes('d4d_piega')) signals.push(t('report:diagnostic.089'));
    if (d4dArr.includes('d4d_taglio')) signals.push(t('report:diagnostic.090'));
    const d7d = answers['d7d'] as string | undefined;
    if (d7d === 'd7d_liberi') signals.push(t('report:diagnostic.091'));
    else if (d7d === 'd7d_disciplinati') signals.push(t('report:diagnostic.092'));
  } else {
    signals.push(t('report:diagnostic.093'));
    const d4e = answers['d4e'] as string | undefined;
    if (d4e === 'd4e_cute') signals.push(t('report:diagnostic.094'));
    if (d4e === 'd4e_capello') signals.push(t('report:diagnostic.095'));
    if (d4e === 'd4e_colore') signals.push(t('report:diagnostic.096'));
    if (d4e === 'd4e_forma') signals.push(t('report:diagnostic.097'));
    const d7e = answers['d7e'] as string | undefined;
    if (d7e === 'd7e_continuita') signals.push(t('report:diagnostic.098'));
  }

  // Per forma branch i segnali d9 sono già stati inseriti con priorità alta sopra
  if (branch !== 'forma') {
    if (d9 === 'd9_non_piacciono') signals.push(t('report:diagnostic.099'));
    if (d9 === 'd9_trascuro') signals.push(t('report:diagnostic.100'));
  }

  return signals.slice(0, 5);
}

// -- CONDIZIONE DESIDERATA ---------------------------------------

function buildDesiredOutcome(pub: PublicPercorso, primary: Percorso, answers: Answers): string {
  if (pub === 'benessere' && primary === 'cute') {
    return t('report:diagnostic.101');
  }
  if (pub === 'benessere' && primary === 'rinascita') {
    return t('report:diagnostic.102');
  }
  if (pub === 'benessere' && primary === 'armonia') {
    const d9 = answers['d9'] as string | undefined;
    const d2 = answers['d2'];
    const d2arr = Array.isArray(d2) ? (d2 as string[]) : d2 ? [d2 as string] : [];
    const hasFibraFragile = d2arr.includes('d2_fragili') || d2arr.includes('d2_secchi');
    const hasRelational = d9 === 'd9_non_piacciono' || d9 === 'd9_trascuro';
    if (hasFibraFragile && hasRelational) {
      return t('report:diagnostic.103');
    }
    if (hasFibraFragile) {
      return t('report:diagnostic.104');
    }
    if (hasRelational) {
      return t('report:diagnostic.105');
    }
    return t('report:diagnostic.106');
  }
  if (pub === 'colorlux') {
    const d5c = answers['d5c'];
    const d5cArr = Array.isArray(d5c) ? (d5c as string[]) : d5c ? [d5c as string] : [];
    if (d5cArr.includes('d5c_danneggia')) {
      return t('report:diagnostic.107');
    }
    return t('report:diagnostic.108');
  }
  if (pub === 'rituale' && primary === 'armonia') {
    return t('report:diagnostic.109');
  }
  return t('report:diagnostic.110');
}

// -- RATIONALE DEL PERCORSO --------------------------------------

function buildPercorsoRationale(pub: PublicPercorso, primary: Percorso, answers: Answers, attention: AttentionLevel): string {
  if (pub === 'benessere' && primary === 'cute') {
    const d6a = answers['d6a'] as string | undefined;
    const mai = d6a === 'd6a_mai';
    return t('report:templates.benessereCuteRationale', {
      neverPart: mai ? t('report:diagnostic.111') : '',
    });
  }
  if (pub === 'benessere' && primary === 'rinascita') {
    return t('report:diagnostic.112');
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
      return t('report:diagnostic.113');
    }
    if (isComplexRat) {
      return t('report:diagnostic.114');
    }
    if (d4d === 'd4d_taglio') {
      return t('report:diagnostic.115');
    }
    return t('report:diagnostic.116');
  }
  if (pub === 'colorlux') {
    return t('report:diagnostic.117');
  }
  if (pub === 'rituale' && primary === 'armonia') {
    if (attention === 'prioritaria') {
      return t('report:diagnostic.118');
    }
    return t('report:diagnostic.119');
  }
  return t('report:diagnostic.120');
}

// -- ESPERIENZE SUGGERITE ----------------------------------------

function getNewEsperienze(pub: PublicPercorso, primary: Percorso, answers: Answers): { es: EsperienzaDef; perche: string }[] {
  const ES = getEsperienzaDefs();
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

  // -- Slot 1: sempre Consulenze Specialistiche ------------------
  result.push({
    es: ES.consulenzeSpecialistiche,
    perche:t('test:diagnostic.takeover.191'),
  });

  if (pub === 'benessere' && primary === 'cute') {
    // Slot 2: cura cute
    result.push({
      es: ES.areaBenessere,
      perche:t('test:diagnostic.takeover.192'),
    });
    // Slot 3: complement styling
    if (isRicci) {
      result.push({ es: ES.ricciOsa, perche:t('test:diagnostic.takeover.193') });
    } else {
      result.push({ es: ES.piegaLux, perche:t('test:diagnostic.takeover.194') });
    }

  } else if (pub === 'benessere' && primary === 'rinascita') {
    // Slot 2: fibra
    result.push({
      es: ES.cheratinaNutrizionePro,
      perche:t('test:diagnostic.takeover.195'),
    });
    // Slot 3
    if (d4barr.includes('d4b_decolorazioni')) {
      result.push({ es: ES.areaBenessere, perche:t('test:diagnostic.takeover.196') });
    } else if (isRicci) {
      result.push({ es: ES.ricciOsa, perche:t('test:diagnostic.takeover.197') });
    } else {
      result.push({ es: ES.piegaLux, perche:t('test:diagnostic.takeover.198') });
    }

  } else if (pub === 'benessere' && primary === 'armonia') {
    // Slot 2: servizio styling principale sulla morfologia
    if (isRicci) {
      if (needsTaglioForma) {
        result.push({ es: ES.ricciOso, perche:t('test:diagnostic.takeover.199') });
      } else {
        result.push({ es: ES.ricciOsa, perche:t('test:diagnostic.takeover.200') });
      }
    } else if (isMossi) {
      if (needsTaglioForma) {
        result.push({ es: ES.taglioSignature, perche:t('test:diagnostic.takeover.201') });
      } else {
        result.push({ es: ES.piegaLux, perche:t('test:diagnostic.takeover.202') });
      }
    } else {
      // lisci / senzaforma
      if (needsTaglioForma) {
        result.push({ es: ES.taglioSignature, perche:t('test:diagnostic.takeover.203') });
      } else {
        result.push({ es: ES.piegaLux, perche:t('test:diagnostic.takeover.204') });
      }
    }
    // Slot 3: complementare intelligente
    if (isRicci && needsTaglioForma) {
      // RicciOso in slot 2 ? RicciOsa o Cheratina come complemento
      if (hasFibraFragile || hasCrespo) {
        result.push({ es: ES.cheratinaNutrizionePro, perche:t('test:diagnostic.takeover.205') });
      } else {
        result.push({ es: ES.ricciOsa, perche:t('test:diagnostic.takeover.206') });
      }
    } else if (hasFibraFragile) {
      result.push({ es: ES.cheratinaNutrizionePro, perche:t('test:diagnostic.takeover.207') });
    } else if (hasCrespo && !isRicci) {
      result.push({ es: ES.cheratinaNutrizionePro, perche:t('test:diagnostic.takeover.208') });
    } else if (hasRadiceGrassa) {
      result.push({ es: ES.areaBenessere, perche:t('test:diagnostic.takeover.209') });
    }
    // else: 2 esperienze — Consulenza + styling (nel range "2-3")

  } else if (pub === 'colorlux') {
    // Slot 2: servizio colore
    if (d7c === 'd7c_bianco') {
      // d7c_bianco override: sempre Luce Signature con copy specifico, mai Nuances
      result.push({ es: ES.luceSignature, perche:t('test:diagnostic.takeover.210') });
    } else if (d4c === 'd4c_decolorazioni' || d4c === 'd4c_grigi_coprire') {
      const lucePerche = d4c === 'd4c_grigi_coprire'
        ?t('report:diagnostic.121')
        :t('report:diagnostic.122');
      result.push({ es: ES.luceSignature, perche: lucePerche });
    } else if (d4c === 'd4c_naturale' || d4c === 'd4c_grigi_valorizzare') {
      result.push({ es: ES.nuances, perche:t('test:diagnostic.takeover.211') });
    } else if (d4c === 'd4c_tinta') {
      if (d7c === 'd7c_cambiamento' || d7c === 'd7c_luminosita') {
        result.push({ es: ES.luceSignature, perche: d7c === 'd7c_cambiamento' ?t('report:diagnostic.123') :t('report:diagnostic.124') });
      } else {
        result.push({ es: ES.nuances, perche:t('test:diagnostic.takeover.212') });
      }
    } else {
      result.push({ es: ES.nuances, perche:t('test:diagnostic.takeover.213') });
    }
    // Slot 3
    if (d5carr.includes('d5c_danneggia')) {
      result.push({ es: ES.cheratinaNutrizionePro, perche:t('test:diagnostic.takeover.214') });
    } else if (isRicci) {
      result.push({ es: ES.ricciOsa, perche:t('test:diagnostic.takeover.215') });
    } else {
      result.push({ es: ES.piegaLux, perche:t('test:diagnostic.takeover.216') });
    }

  } else {
    // pub === 'rituale' (primary rituale o armonia escalata a complessità multi-area)
    // Slot 2: styling principale per morfologia
    if (isRicci) {
      if (d4e === 'd4e_forma' || needsTaglioForma) {
        result.push({ es: ES.ricciOso, perche:t('test:diagnostic.takeover.217') });
      } else {
        result.push({ es: ES.ricciOsa, perche:t('test:diagnostic.takeover.218') });
      }
    } else {
      // mossi o lisci ? Taglio Signature (mai RicciOso)
      result.push({ es: ES.taglioSignature, perche:t('test:diagnostic.takeover.219') });
    }
    // Slot 3: concern primario del percorso completo
    if (d4e === 'd4e_cute') {
      result.push({ es: ES.areaBenessere, perche:t('test:diagnostic.takeover.220') });
    } else if (d4e === 'd4e_capello') {
      result.push({ es: ES.cheratinaNutrizionePro, perche:t('test:diagnostic.takeover.221') });
    } else if (d4e === 'd4e_colore') {
      result.push({ es: ES.nuances, perche:t('test:diagnostic.takeover.222') });
    } else if (d4e === 'd4e_forma') {
      // forma già in slot 2; se ricci con RicciOso, RicciOsa come complemento
      if (isRicci && result.some(r => r.es.nome === ES.ricciOso.nome)) {
        result.push({ es: ES.ricciOsa, perche:t('test:diagnostic.takeover.223') });
      } else if (hasFibraFragile) {
        result.push({ es: ES.cheratinaNutrizionePro, perche:t('test:diagnostic.takeover.224') });
      } else {
        result.push({ es: ES.piegaLux, perche:t('test:diagnostic.takeover.225') });
      }
    } else {
      // d4e_nonso o non definito
      if (hasFibraFragile) {
        result.push({ es: ES.cheratinaNutrizionePro, perche:t('test:diagnostic.takeover.226') });
      } else {
        result.push({ es: ES.areaBenessere, perche:t('test:diagnostic.takeover.227') });
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

// -- COSA APPROFONDIRE IN CONSULENZA ----------------------------

function buildConsultationFocus(primary: Percorso, answers: Answers, esperienzaNames: Set<string>): string[] {
  const d9 = answers['d9'] as string | undefined;
  const d6a = answers['d6a'] as string | undefined;
  const d4b = answers['d4b'];

  if (primary === 'cute') {
    const points = [t('test:diagnostic.takeover.228'),t('test:diagnostic.takeover.229'),
    ];
    points.push(d6a === 'd6a_mai'
      ?t('report:diagnostic.125')
      :t('report:diagnostic.126'));
    return points;
  }

  if (primary === 'rinascita') {
    const d4bArr = Array.isArray(d4b) ? d4b : d4b ? [d4b] : [];
    return [t('report:diagnostic.127'),t('report:diagnostic.128'),
      d4bArr.includes('d4b_decolorazioni')
        ?t('report:diagnostic.129')
        :t('report:diagnostic.130'),
    ];
  }

  if (primary === 'colore') {
    const d7cFocus = answers['d7c'] as string | undefined;
    const points = [
      t('report:diagnostic.166'),
      t('report:diagnostic.167'),
      d7cFocus === 'd7c_bianco'
        ?t('report:diagnostic.131')
        :t('report:diagnostic.132'),
    ];
    const d5cFocus = answers['d5c'];
    const d5cFocusArr = Array.isArray(d5cFocus) ? (d5cFocus as string[]) : d5cFocus ? [d5cFocus as string] : [];
    if (d5cFocusArr.includes('d5c_danneggia') && !esperienzaNames.has('Cheratina Nutrizione Pro')) {
      points.push(t('report:diagnostic.133'));
    }
    return points;
  }

  if (primary === 'armonia') {
    const points = [t('test:diagnostic.takeover.230'),t('test:diagnostic.takeover.231'),t('test:diagnostic.takeover.232'),
    ];
    const d2arm = answers['d2'];
    const d2armArr = Array.isArray(d2arm) ? (d2arm as string[]) : d2arm ? [d2arm as string] : [];
    if (d2armArr.includes('d2_grassi') && !esperienzaNames.has('Area Benessere')) {
      points.push(t('report:diagnostic.134'));
    }
    if ((d2armArr.includes('d2_fragili') || d2armArr.includes('d2_secchi')) && !esperienzaNames.has('Cheratina Nutrizione Pro')) {
      points.push(t('report:diagnostic.135'));
    }
    return points;
  }

  const d7e = answers['d7e'] as string | undefined;
  return [t('report:diagnostic.136'),t('report:diagnostic.137'),
    d7e === 'd7e_continuita' || d9 === 'd9_non_piacciono'
      ?t('report:diagnostic.138')
      :t('report:diagnostic.139'),
  ];
}

// -- CHIUSURA ----------------------------------------------------

function buildClosing(pub: PublicPercorso, attention: AttentionLevel, primary: Percorso, answers: Answers): string {
  if (pub === 'benessere' && primary === 'cute') {
    if (attention === 'prioritaria') {
      return t('report:diagnostic.140');
    }
    return t('report:diagnostic.141');
  }
  if (pub === 'benessere' && primary === 'rinascita') {
    if (attention === 'prioritaria') {
      return t('report:diagnostic.142');
    }
    return t('report:diagnostic.143');
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
      return t('report:diagnostic.144');
    }
    if (hasFibraFragileCl) {
      return t('report:diagnostic.145');
    }
    if (hasRelationalCl) {
      return t('report:diagnostic.146');
    }
    if (isRicciCl) {
      return t('report:diagnostic.147');
    }
    return t('report:diagnostic.148');
  }
  if (pub === 'colorlux') {
    const d5ccl = answers['d5c'];
    const d5cclArr = Array.isArray(d5ccl) ? (d5ccl as string[]) : d5ccl ? [d5ccl as string] : [];
    if (d5cclArr.includes('d5c_danneggia')) {
      return t('report:diagnostic.149');
    }
    if (attention === 'prioritaria') {
      return t('report:diagnostic.150');
    }
    return t('report:diagnostic.151');
  }
  if (pub === 'rituale' && primary === 'armonia') {
    return t('report:diagnostic.152');
  }
  if (attention === 'prioritaria') {
    return t('report:diagnostic.153');
  }
  return t('report:diagnostic.154');
}

// -- NOTA D10 ----------------------------------------------------

function buildD10Note(d10: string | undefined): string | null {
  if (!d10 || d10.trim().length <= 10) return null;
  return d10.trim();
}


// -- SEDI ----------------------------------------------------------

const LUXOSA_LOCATIONS = [
  {
    id: 'messina-cavour',
    label:t('test:diagnostic.takeover.233'),
    whatsapp: '390902403220',
  },
] as const;

// -- WHATSAPP MESSAGE BUILDER -------------------------------------

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
    ordinaria: t('report:diagnostic.168'),
    mirata: t('report:diagnostic.151'),
    prioritaria: t('report:diagnostic.152'),
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
  const [accepted, setAccepted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="w-full max-w-[720px] mx-auto px-6 md:px-10 py-10 md:py-14"
    >
      <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">{t('test:diagnostic.takeover.234')}</span>
      <h2 className="font-serif text-[26px] md:text-[34px] font-light leading-[1.15] text-charcoal mb-2">{t('test:diagnostic.takeover.235')}</h2>
      <p className="text-[17px] leading-[1.8] text-anthracite/70 font-light mb-8">{t('test:diagnostic.takeover.236')}</p>

      <div className="border border-sand/50 p-6 md:p-8 bg-ecru/20 mb-8 space-y-4 text-[16px] leading-[1.85] text-anthracite/80 font-light">
        <p>
          <strong className="text-charcoal/80 font-normal">{t('test:diagnostic.takeover.237')}</strong>{t('test:diagnostic.takeover.238')}</p>
        <p>
          <strong className="text-charcoal/80 font-normal">{t('test:diagnostic.takeover.239')}</strong>{t('test:diagnostic.takeover.240')}{' '}
          <a href="mailto:privacy@luxosa.it" className="text-brass hover:underline underline-offset-2">{t('test:diagnostic.takeover.241')}</a>{t('test:diagnostic.takeover.242')}<span className="text-brass">{t('test:diagnostic.takeover.243')}</span>
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
        <span className="text-[16px] leading-[1.7] text-anthracite/80 font-light">{t('test:diagnostic.takeover.246')}</span>
      </button>

      <button
        onClick={accepted ? onAccept : undefined}
        disabled={!accepted}
        className={`inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase font-light px-10 py-4 transition-all duration-500 ${
          accepted
            ? 'relative overflow-hidden group bg-charcoal text-ivory cursor-pointer'
            : 'bg-anthracite/10 text-anthracite/40 cursor-not-allowed'
        }`}
      >
        {accepted && (
          <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
        )}
        <span className={`flex items-center gap-3 ${accepted ? 'relative z-10' : ''}`}>{t('test:diagnostic.takeover.250')}<ArrowRight size={14} strokeWidth={1.5} />
        </span>
      </button>
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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<PhoneValue | undefined>(undefined);
  const [error, setError] = useState('');

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  const handleSubmit = () => {
    if (!nome.trim()) {
      setError(t('test:diagnostic.takeover.306'));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t('test:diagnostic.takeover.307'));
      return;
    }
    if (!phone || !isPossiblePhoneNumber(phone)) {
      setError(t('test:diagnostic.takeover.308'));
      return;
    }
    onSubmit({ nome: nome.trim(), email: email.trim(), whatsapp: phone });
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
        <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">{t('test:diagnostic.takeover.266')}</span>
        <h2 className="font-serif text-[26px] md:text-[34px] font-light leading-[1.15] text-charcoal mb-4">{t('test:diagnostic.takeover.267')}</h2>
        <p className="text-[17px] leading-[1.8] text-anthracite/70 font-light mb-10">{t('test:diagnostic.takeover.268')}</p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder={t('test:diagnostic.takeover.269')}
            value={nome}
            onChange={e => { setNome(e.target.value); setError(''); }}
            className={inputClass}
          />
          <input
            type="email"
            placeholder={t('test:diagnostic.takeover.270')}
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
              placeholder={t('test:diagnostic.takeover.271')}
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
              <span className="relative z-10 flex items-center gap-3">{t('test:diagnostic.takeover.272')}<ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
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
  const resultViewedTrackedRef = useRef(false);
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
    ordinaria: t('report:diagnostic.168'),
    mirata: t('report:diagnostic.151'),
    prioritaria: t('report:diagnostic.152'),
  };

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
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">{t('test:diagnostic.takeover.277')}</span>
          <span className={`inline-flex items-center px-4 py-2 text-[11px] tracking-[0.18em] uppercase font-light ${
            attention === 'prioritaria'
              ? 'bg-brass/10 text-brass-muted border border-brass/30'
              : attention === 'mirata'
              ? 'bg-ecru text-anthracite/70 border border-sand/50'
              : 'bg-ecru/40 text-anthracite/55 border border-sand/30'
          }`}>
            {attentionLabels[attention]}
          </span>
        </div>

        {/* 5 — La direzione */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">{t('test:diagnostic.takeover.281')}</span>
          <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/80 font-light">{desiredOutcome}</p>
        </div>

        {/* 6 — Perché questo percorso */}
        <div className="mb-10 -mx-6 md:-mx-10 px-6 md:px-10 py-8 md:py-10 bg-ecru/25 border-t border-b border-sand/30">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">{t('test:diagnostic.takeover.282')}</span>
          <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/85 font-light">{percorsoRationale}</p>
        </div>

        {/* 7 — Esperienze suggerite */}
        <div className="mb-10 pt-4">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-6">{t('test:diagnostic.takeover.283')}</span>
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
                    <p className="text-[12px] leading-[1.6] text-anthracite/55 font-light mb-3">{item.es.sottotitolo}</p>
                    <p className="text-[15px] md:text-[16px] leading-[1.75] text-anthracite/75 font-light italic">{item.perche}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 8 — Cosa approfondire in consulenza */}
        <div className="mb-10 border-t border-sand/35 pt-8">
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-5">{t('test:diagnostic.takeover.284')}</span>
          <ul className="space-y-3">
            {consultationFocus.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sand mt-[9px] flex-shrink-0" />
                <p className="text-[15px] md:text-[16px] leading-[1.75] text-anthracite/75 font-light">{point}</p>
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
            <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-4">{t('test:diagnostic.takeover.285')}</span>
            <blockquote className="border-l-[2px] border-brass/30 pl-5">
              <p className="text-[16px] md:text-[17px] leading-[1.85] text-anthracite/70 font-light italic">«{d10Note}»</p>
            </blockquote>
          </motion.div>
        )}

        {/* 10 — Chiusura */}
        <div className="mb-12 border-t border-sand/35 pt-8">
          <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/85 font-light">{closing}</p>
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
  const [contactData, setContactData] = useState<ContactFormData>({ nome: '', email: '', whatsapp: '' });
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
    setScreen('result');
  }, []);

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
                {screen === 'result' ?t('test:diagnostic.takeover.302') : screen === 'form' ?t('test:diagnostic.takeover.303') : ''}
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
