// ═══════════════════════════════════════════════════════════════
// LUXOSA — LA TUA SOLUZIONE v1.0
// Quiz orientativo fullscreen — 10-12 domande con ramificazione
// ═══════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X, Check } from 'lucide-react';

// ── TYPES ──────────────────────────────────────────────────────

type Percorso = 'cute' | 'rinascita' | 'colore' | 'armonia' | 'rituale';
type Scores = Record<Percorso, number>;
type Screen = 'disclaimer' | 'quiz' | 'form' | 'result';
type BranchKey = 'cute' | 'struttura' | 'colore' | 'forma' | 'completo';
type Answers = Record<string, string | string[]>;

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
  d1_lisci: '/images/quiz/options/d1_lisci.png',
  d1_mossi: '/images/quiz/options/d1_mossi.png',
  d1_ricci: '/images/quiz/options/d1_ricci.png',
  d1_molto_ricci: '/images/quiz/options/d1_molto_ricci.png',
  // D2 — Stato attuale
  d2_fragili: '/images/quiz/options/d2_fragili.png',
  d2_crespi: '/images/quiz/options/d2_crespi.png',
  d2_sottili: '/images/quiz/options/d2_sottili.png',
  d2_grassi: '/images/quiz/options/d2_grassi.png',
  d2_secchi: '/images/quiz/options/d2_secchi.png',
  d2_sani: '/images/quiz/options/d2_senzacarattere.png',
  // D3 — Priorità
  d3_cute: '/images/quiz/options/d3_cute.jpg',
  d3_rovinato: '/images/quiz/options/d3_rovinato.jpg',
  d3_colore: '/images/quiz/options/d3_colore.jpg',
  d3_forma: '/images/quiz/options/d3_forma.jpg',
  d3_tutto: '/images/quiz/options/d3_tutto.jpg',
  // D4a–D7a — Cute
  d4a_prurito: '/images/quiz/options/prurito.png',
  d4a_desquamazione: '/images/quiz/options/desquamazione-forfora.png',
  d4a_grassa: '/images/quiz/options/cute grassa.png',
  d4a_rossori: '/images/quiz/options/irritazioni.png',
  d4a_tira: '/images/quiz/options/cute che tira.png',
  d5a_settimane: '/images/quiz/options/d5a_settimane.jpg',
  d5a_mesi: '/images/quiz/options/d5a_mesi.jpg',
  d5a_anno: '/images/quiz/options/d5a_anno.jpg',
  d5a_sempre: '/images/quiz/options/d5a_sempre.jpg',
  d6a_mai: '/images/quiz/options/d6a_mai.jpg',
  d6a_prodotti: '/images/quiz/options/d6a_prodotti.jpg',
  d6a_salone: '/images/quiz/options/d6a_salone.jpg',
  d6a_dermatologo: '/images/quiz/options/d6a_dermatologo.jpg',
  d7a_no: '/images/quiz/options/diradamento no.png',
  d7a_lieve: '/images/quiz/options/diradamento poco.png',
  d7a_evidente: '/images/quiz/options/diradamento alto.png',
  // D4b–D7b — Struttura
  d4b_colorazioni: '/images/quiz/options/d4b_colorazioni.jpg',
  d4b_decolorazioni: '/images/quiz/options/d4b_decolorazioni.jpg',
  d4b_stiratura: '/images/quiz/options/d4b_stiratura.jpg',
  d4b_calore: '/images/quiz/options/d4b_calore.jpg',
  d4b_aggressivi: '/images/quiz/options/d4b_aggressivi.jpg',
  d5b_sane: '/images/quiz/options/d5b_sane.jpg',
  d5b_aperte: '/images/quiz/options/d5b_aperte.jpg',
  d5b_spezzano: '/images/quiz/options/d5b_spezzano.jpg',
  d6b_morbido: '/images/quiz/options/d6b_morbido.jpg',
  d6b_ruvido: '/images/quiz/options/d6b_ruvido.jpg',
  d6b_secco: '/images/quiz/options/d6b_secco.jpg',
  d6b_paglia: '/images/quiz/options/d6b_paglia.jpg',
  d7b_morbidezza: '/images/quiz/options/d7b_morbidezza.jpg',
  d7b_rinforzare: '/images/quiz/options/d7b_rinforzare.jpg',
  d7b_ricominciare: '/images/quiz/options/d7b_ricominciare.jpg',
  // D4c–D7c — Colore
  d4c_naturale: '/images/quiz/options/d4c_naturale.jpg',
  d4c_tinta: '/images/quiz/options/d4c_tinta.jpg',
  d4c_decolorazioni: '/images/quiz/options/d4c_decolorazioni.jpg',
  d4c_grigi_coprire: '/images/quiz/options/d4c_grigi_coprire.jpg',
  d4c_grigi_valorizzare: '/images/quiz/options/d4c_grigi_valorizzare.jpg',
  d5c_spegne: '/images/quiz/options/d5c_spegne.jpg',
  d5c_luminoso: '/images/quiz/options/d5c_luminoso.jpg',
  d5c_uniforme: '/images/quiz/options/d5c_uniforme.jpg',
  d5c_viso: '/images/quiz/options/d5c_viso.jpg',
  d5c_danneggia: '/images/quiz/options/d5c_danneggia.jpg',
  d6c_frequente: '/images/quiz/options/d6c_frequente.jpg',
  d6c_normale: '/images/quiz/options/d6c_normale.jpg',
  d6c_raro: '/images/quiz/options/d6c_raro.jpg',
  d6c_mai: '/images/quiz/options/d6c_mai.jpg',
  d7c_naturalezza: '/images/quiz/options/d7c_naturalezza.jpg',
  d7c_luminosita: '/images/quiz/options/d7c_luminosita.jpg',
  d7c_copertura: '/images/quiz/options/d7c_copertura.jpg',
  d7c_cambiamento: '/images/quiz/options/d7c_cambiamento.jpg',
  // D4d–D7d — Forma
  d4d_volume: '/images/quiz/options/d4d_volume.jpg',
  d4d_ricci: '/images/quiz/options/d4d_ricci.jpg',
  d4d_piega: '/images/quiz/options/d4d_piega.jpg',
  d4d_taglio: '/images/quiz/options/d4d_taglio.jpg',
  d5d_poco: '/images/quiz/options/d5d_poco.jpg',
  d5d_medio: '/images/quiz/options/d5d_medio.jpg',
  d5d_molto: '/images/quiz/options/d5d_molto.jpg',
  d5d_troppo: '/images/quiz/options/d5d_troppo.jpg',
  d6d_mai: '/images/quiz/options/d6d_mai.jpg',
  d6d_qualche: '/images/quiz/options/d6d_qualche.jpg',
  d6d_sempre: '/images/quiz/options/d6d_sempre.jpg',
  d7d_liberi: '/images/quiz/options/d7d_liberi.jpg',
  d7d_disciplinati: '/images/quiz/options/d7d_disciplinati.jpg',
  d7d_voluminosi: '/images/quiz/options/d7d_voluminosi.jpg',
  d7d_scoprire: '/images/quiz/options/d7d_scoprire.jpg',
  // D4e–D7e — Completo
  d4e_cute: '/images/quiz/options/d4e_cute.jpg',
  d4e_capello: '/images/quiz/options/d4e_capello.jpg',
  d4e_colore: '/images/quiz/options/d4e_colore.jpg',
  d4e_forma: '/images/quiz/options/d4e_forma.jpg',
  d4e_nonso: '/images/quiz/options/d4e_nonso.jpg',
  d5e_cercando: '/images/quiz/options/d5e_cercando.jpg',
  d5e_insoddisfatta: '/images/quiz/options/d5e_insoddisfatta.jpg',
  d5e_prima: '/images/quiz/options/d5e_prima.jpg',
  d6e_risultati: '/images/quiz/options/d6e_risultati.jpg',
  d6e_presa: '/images/quiz/options/d6e_presa.jpg',
  d6e_capire: '/images/quiz/options/d6e_capire.jpg',
  d6e_tutto: '/images/quiz/options/d6e_tutto.jpg',
  d7e_se_funziona: '/images/quiz/options/d7e_se_funziona.jpg',
  d7e_continuita: '/images/quiz/options/d7e_continuita.jpg',
  d7e_valutare: '/images/quiz/options/d7e_valutare.jpg',
  // D8–D9 — Stile di vita
  d8_ogni_giorno: '/images/quiz/options/d8_ogni_giorno.jpg',
  d8_2_3: '/images/quiz/options/d8_2_3.jpg',
  d8_settimana: '/images/quiz/options/d8_settimana.jpg',
  d8_meno: '/images/quiz/options/d8_meno.jpg',
  d9_amo: '/images/quiz/options/d9_amo.jpg',
  d9_non_piacciono: '/images/quiz/options/d9_non_piacciono.jpg',
  d9_trascuro: '/images/quiz/options/d9_trascuro.jpg',
  d9_ci_lavoro: '/images/quiz/options/d9_ci_lavoro.jpg',
};

const OPTION_IMAGE_STYLE: Record<string, { aspect: string; position: string }> = {
  d1_lisci:       { aspect: 'aspect-square', position: 'object-center' },
  d1_mossi:       { aspect: 'aspect-square', position: 'object-center' },
  d1_ricci:       { aspect: 'aspect-square', position: 'object-center' },
  d1_molto_ricci: { aspect: 'aspect-square', position: 'object-center' },
  d2_fragili:       { aspect: 'aspect-square', position: 'object-center' },
  d2_crespi:        { aspect: 'aspect-square', position: 'object-center' },
  d2_sottili:       { aspect: 'aspect-square', position: 'object-center' },
  d2_grassi:        { aspect: 'aspect-square', position: 'object-center' },
  d2_secchi:        { aspect: 'aspect-square', position: 'object-center' },
  d2_sani:          { aspect: 'aspect-square', position: 'object-center' },
  d4a_prurito:      { aspect: 'aspect-square', position: 'object-center' },
  d4a_desquamazione:{ aspect: 'aspect-square', position: 'object-center' },
  d4a_grassa:       { aspect: 'aspect-square', position: 'object-center' },
  d4a_rossori:      { aspect: 'aspect-square', position: 'object-center' },
  d4a_tira:         { aspect: 'aspect-square', position: 'object-center' },
  d7a_no:           { aspect: 'aspect-square', position: 'object-center' },
  d7a_lieve:        { aspect: 'aspect-square', position: 'object-center' },
  d7a_evidente:     { aspect: 'aspect-square', position: 'object-center' },
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

  let secondary: Percorso | null = null;
  let secondaryPct = 0;
  if (second && first[1] > 0 && second[0] !== primary) {
    const raw = Math.min(Math.round((second[1] / MAX_SCORES[second[0]]) * 100), 99);
    if (raw >= primaryPct * 0.6) {
      secondary = second[0];
      secondaryPct = raw;
    }
  }
  return { primary, secondary, primaryPct, secondaryPct };
}

// ── ESPERIENZE ─────────────────────────────────────────────────

const ES: Record<string, EsperienzaDef> = {
  piegaLux: { nome: 'Piega Lux', sottotitolo: 'Il gesto che conclude ogni percorso.' },
  taglioSignature: { nome: 'Taglio Signature', sottotitolo: 'Un taglio costruito sulla tua morfologia.' },
  nuances: { nome: 'Nuances', sottotitolo: 'Il colore nella sua espressione più raffinata.' },
  luceSignature: { nome: 'Luce Signature', sottotitolo: 'Schiariture costruite con precisione e cura della fibra.' },
  ricciOsa: { nome: 'RicciOsa', sottotitolo: 'Il gesto dedicato al capello riccio autentico.' },
  ricciOso: { nome: 'RicciOso', sottotitolo: 'Per mossi e wavy che cercano equilibrio e definizione.' },
  cheratinaPro: { nome: 'Cheratina Pro', sottotitolo: 'Ordine, morbidezza e controllo duraturo.' },
  areaCura: { nome: 'Area Cura', sottotitolo: 'Quando la salute del capello torna ad essere il primo obiettivo.' },
  consulenzaColorLux: { nome: 'Consulenza ColorLux', sottotitolo: 'Un momento esclusivamente dedicato al tuo colore.' },
  protezioneLibra: { nome: 'Protezione Fibra', sottotitolo: 'Scudo attivo per la fibra capillare trattata.' },
  tonalizzante: { nome: 'Tonalizzante', sottotitolo: 'Luminosità e tonalità su misura.' },
  softRefining: { nome: 'Soft Refining', sottotitolo: 'Definizione morbida per mossi e onde naturali.' },
};

function getEsperienze(percorso: Percorso, answers: Answers): EsperienzaDef[] {
  const d1 = answers['d1'] as string | undefined;
  const d4b = answers['d4b'];
  const d4c = answers['d4c'] as string | undefined;
  const d4e = answers['d4e'] as string | undefined;
  const d5c = answers['d5c'];

  switch (percorso) {
    case 'cute':
      return [ES.areaCura, ES.protezioneLibra, ES.piegaLux];

    case 'rinascita': {
      const list: EsperienzaDef[] = [ES.areaCura, ES.cheratinaPro, ES.protezioneLibra];
      if (Array.isArray(d4b) && d4b.includes('d4b_decolorazioni')) list[2] = ES.consulenzaColorLux;
      return list;
    }

    case 'colore': {
      const list: EsperienzaDef[] = [ES.consulenzaColorLux];
      list.push(d4c === 'd4c_decolorazioni' || d4c === 'd4c_tinta' ? ES.luceSignature : ES.nuances);
      list.push(Array.isArray(d5c) && d5c.includes('d5c_danneggia') ? ES.protezioneLibra : ES.tonalizzante);
      return list;
    }

    case 'armonia': {
      if (d1 === 'd1_ricci' || d1 === 'd1_molto_ricci') return [ES.ricciOsa, ES.taglioSignature, ES.piegaLux];
      if (d1 === 'd1_mossi') return [ES.ricciOso, ES.softRefining, ES.piegaLux];
      return [ES.taglioSignature, ES.softRefining, ES.piegaLux];
    }

    case 'rituale': {
      const list: EsperienzaDef[] = [ES.taglioSignature, ES.piegaLux];
      if (d4e === 'd4e_cute') list.push(ES.areaCura);
      else if (d4e === 'd4e_capello') list.push(ES.cheratinaPro);
      else if (d4e === 'd4e_colore') list.push(ES.consulenzaColorLux);
      else if (d4e === 'd4e_forma') list.push(ES.ricciOsa);
      else list.push(ES.areaCura);
      return list;
    }
  }
}

// ── COPY RISULTATO ─────────────────────────────────────────────

const RESULT_CONTENT: Record<Percorso, { nome: string; sottotitolo: string; cosaRisolve: string; percheTe: string }> = {
  cute: {
    nome: 'Equilibrio della Cute',
    sottotitolo: 'La bellezza parte da qui.',
    cosaRisolve: 'Il percorso Equilibrio della Cute lavora là dove tutto inizia: il cuoio capelluto. Affronta fastidi come prurito, desquamazione, eccesso di sebo e sensibilità, riportando la cute a una condizione di equilibrio reale e duraturo.',
    percheTe: 'Dalle tue risposte emerge che la tua cute ha bisogno di attenzione. Non è un problema da nascondere: è il punto da cui partire per avere capelli sani e belli. In Luxosa partiamo proprio da qui.',
  },
  rinascita: {
    nome: 'Rinascita del Capello',
    sottotitolo: 'Restituire ciò che il tempo ha tolto.',
    cosaRisolve: 'Il percorso Rinascita del Capello è pensato per restituire al capello ciò che trattamenti, calore e tempo gli hanno tolto. Lavora sulla struttura interna della fibra: idratazione profonda, ricostruzione, elasticità e lucentezza.',
    percheTe: 'Il tuo capello ha attraversato molto. Le tue risposte ci dicono che ha bisogno di essere ricostruito con cura, non con una soluzione rapida. Rinascita è il percorso che ti ridà una base solida su cui costruire tutto il resto.',
  },
  colore: {
    nome: 'Armonia del Colore',
    sottotitolo: 'Il colore giusto non si sceglie. Si comprende.',
    cosaRisolve: 'Il percorso Armonia del Colore è dedicato a chi cerca un colore che non sia solo bello il primo giorno, ma che duri, evolva e valorizzi. Sfumature, profondità, luminosità — con la protezione della fibra al centro di ogni scelta.',
    percheTe: "Il colore è una delle cose che senti di più, e dalle tue risposte emerge che non hai ancora trovato l'armonia giusta. In Luxosa il colore non si applica: si progetta. E si progetta su di te.",
  },
  armonia: {
    nome: 'Armonia',
    sottotitolo: 'La forma che ti appartiene.',
    cosaRisolve: 'Il percorso Armonia lavora sulla forma naturale del tuo capello: volume, definizione, movimento. Non cerca di domare il capello, ma di lasciarlo esprimere al meglio — con il taglio giusto, il trattamento giusto e la gestione quotidiana giusta.',
    percheTe: 'Le tue risposte ci dicono che la forma del tuo capello è al centro delle tue esigenze. Che tu lo voglia più libero, più definito o più voluminoso, il percorso Armonia è pensato per trovare insieme la forma che ti rappresenta.',
  },
  rituale: {
    nome: 'Rituale Luxosa',
    sottotitolo: 'La cura più completa.',
    cosaRisolve: "Il Rituale Luxosa è il percorso più completo: abbraccia cute, struttura, colore e forma in un unico progetto di cura integrato. Non è la somma di più servizi: è un percorso progettato dall'inizio per prendersi cura di ogni aspetto del tuo capello.",
    percheTe: "Dalle tue risposte emerge che il tuo desiderio non riguarda un singolo aspetto, ma una trasformazione complessiva. Vuoi essere presa in carico davvero, dall'inizio alla fine. Il Rituale Luxosa è esattamente questo.",
  },
};

const PERCORSO_LABELS: Record<Percorso, string> = {
  cute: 'Equilibrio della Cute',
  rinascita: 'Rinascita del Capello',
  colore: 'Armonia del Colore',
  armonia: 'Armonia',
  rituale: 'Rituale Luxosa',
};

// ═══════════════════════════════════════════════════════════════
// QUIZ IMAGES — Unsplash (royalty-free, no attribution required)
// ═══════════════════════════════════════════════════════════════

const QUIZ_IMAGES: Record<string, string> = {
  d1: '/images/quiz/quiz-hair-type.jpg',
  d2: '/images/quiz/quiz-hair-care.jpg',
  d3: '/images/quiz/quiz-consultation.jpg',
  d4a: '/images/quiz/quiz-scalp.jpg',
  d5a: '/images/quiz/quiz-scalp.jpg',
  d6a: '/images/quiz/quiz-scalp.jpg',
  d7a: '/images/quiz/quiz-scalp.jpg',
  d4b: '/images/quiz/quiz-structure.jpg',
  d5b: '/images/quiz/quiz-structure.jpg',
  d6b: '/images/quiz/quiz-structure.jpg',
  d7b: '/images/quiz/quiz-structure.jpg',
  d4c: '/images/quiz/quiz-color.jpg',
  d5c: '/images/quiz/quiz-color.jpg',
  d6c: '/images/quiz/quiz-color.jpg',
  d7c: '/images/quiz/quiz-color.jpg',
  d4d: '/images/quiz/quiz-form.jpg',
  d5d: '/images/quiz/quiz-form.jpg',
  d6d: '/images/quiz/quiz-form.jpg',
  d7d: '/images/quiz/quiz-form.jpg',
  d4e: '/images/quiz/quiz-complete.jpg',
  d5e: '/images/quiz/quiz-complete.jpg',
  d6e: '/images/quiz/quiz-complete.jpg',
  d7e: '/images/quiz/quiz-complete.jpg',
  d8: '/images/quiz/quiz-lifestyle.jpg',
  d9: '/images/quiz/quiz-lifestyle.jpg',
  d10: '/images/quiz/quiz-freetext.jpg',
};

function getQuizImage(questionId: string): string {
  return QUIZ_IMAGES[questionId] ?? '/images/quiz/quiz-consultation.jpg';
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
          Inizia il quiz
          <ArrowRight size={14} strokeWidth={1.5} />
        </span>
      </button>
    </motion.div>
  );
}

// ── QUIZ CONTENT ───────────────────────────────────────────────

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

  const quizImage = getQuizImage(q.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: premiumEase }}
      className="relative w-full"
    >
      {/* Atmospheric background image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src={quizImage} alt="" className="w-full h-full object-cover opacity-[0.05] lg:opacity-[0.08]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/60 via-ivory/85 to-ivory" />
      </div>

      <div className="relative z-10 max-w-[960px] mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 lg:py-14">
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
            className="w-full h-36 md:h-44 bg-white/60 border border-sand/50 px-5 py-4 text-[17px] text-anthracite/80 font-light leading-[1.8] resize-none outline-none focus:border-brass/50 transition-colors duration-300 placeholder:text-anthracite/25"
          />
          <div className="text-right mt-1.5">
            <span className="text-[11px] text-anthracite/25 font-light">{textValue.length}/500</span>
          </div>
          <div className="mt-8 text-center">
            <ContinuaButton onClick={onContinue} enabled />
          </div>
        </div>
      )}

      {/* D3 / D5a — text-only cards */}
      {!isText && (q.id === 'd3' || q.id === 'd5a' || q.id === 'd6a' || q.id === 'd8' || q.id === 'd9') && (
        <div className={`grid gap-3 md:gap-4 ${q.id === 'd3' ? 'grid-cols-6' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {q.options.map((opt, i) => {
            const isSelected = selectedIds.includes(opt.id);
            const colClass = q.id === 'd3'
              ? (i === 3 ? 'col-span-2 col-start-2' : i === 4 ? 'col-span-2 col-start-4' : 'col-span-2')
              : '';
            return (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: premiumEase }}
                onClick={() => onSingleSelect(q.id, opt.id)}
                className={`${colClass} group relative text-left overflow-hidden border transition-all duration-500 ${
                  isSelected
                    ? 'border-brass shadow-md ring-1 ring-brass/20'
                    : 'border-sand/40 bg-white/60 hover:border-brass/35 hover:shadow-md'
                }`}
              >
                <div className="aspect-square flex flex-col items-center justify-center px-4 text-center">
                  <p className={`font-serif text-[17px] md:text-[20px] font-light leading-snug transition-colors duration-300 ${
                    isSelected ? 'text-brass-muted' : 'text-charcoal group-hover:text-brass-muted'
                  }`}>
                    {opt.text}
                  </p>
                  {opt.subtext && (
                    <p className="mt-2 text-[10px] md:text-[12px] leading-[1.5] text-anthracite/40 font-light">{opt.subtext}</p>
                  )}
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500 ${
                  isSelected ? 'bg-brass' : 'bg-transparent group-hover:bg-brass/20'
                }`} />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2.5 right-2.5 w-6 h-6 bg-brass flex items-center justify-center"
                  >
                    <Check size={12} strokeWidth={2.5} className="text-ivory" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Option cards with images */}
      {!isText && q.id !== 'd3' && q.id !== 'd5a' && q.id !== 'd6a' && q.id !== 'd8' && q.id !== 'd9' && (
        <>
          <div className={`grid gap-3 md:gap-4 ${
            q.id === 'd1' ? 'grid-cols-2 sm:grid-cols-4' :
            q.id === 'd2' ? 'grid-cols-2 sm:grid-cols-3' :
            q.id === 'd4a' ? 'grid-cols-2 sm:grid-cols-3' :
            q.id === 'd7a' ? 'grid-cols-2 sm:grid-cols-3' :
            q.options.length === 3 ? 'grid-cols-2 sm:grid-cols-3' :
            q.options.length >= 5 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2'
          }`}>
            {q.options.map((opt, i) => {
              const isSelected = selectedIds.includes(opt.id);
              const imgSrc = OPTION_IMAGES[opt.id];
              return (
                <motion.button
                  key={opt.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: premiumEase }}
                  onClick={() =>
                    isMulti
                      ? onMultiToggle(q.id, opt.id, maxSel)
                      : onSingleSelect(q.id, opt.id)
                  }
                  className={`group relative text-left overflow-hidden border transition-all duration-500 ${
                    isSelected
                      ? 'border-brass shadow-md ring-1 ring-brass/20'
                      : 'border-sand/40 bg-white/60 hover:border-brass/35 hover:shadow-md'
                  }`}
                >
                  {/* Image area */}
                  <div className={`relative overflow-hidden bg-gradient-to-br from-ecru via-sand/30 to-tortora/20 ${OPTION_IMAGE_STYLE[opt.id]?.aspect ?? 'aspect-[4/3]'}`}>
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={opt.text}
                        className={`w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] ${OPTION_IMAGE_STYLE[opt.id]?.position ?? 'object-center'}`}
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    {/* Gradient overlay for readability */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${
                      isSelected
                        ? 'bg-gradient-to-t from-brass/20 via-transparent to-brass/5'
                        : 'bg-gradient-to-t from-deep/10 via-transparent to-transparent'
                    }`} />
                    {/* Selected check badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2.5 right-2.5 w-6 h-6 bg-brass flex items-center justify-center"
                      >
                        <Check size={12} strokeWidth={2.5} className="text-ivory" />
                      </motion.div>
                    )}
                    {/* Multi-select checkbox */}
                    {isMulti && !isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 border border-ivory/60 bg-deep/20 backdrop-blur-sm" />
                    )}
                  </div>

                  {/* Text area */}
                  <div className="px-3 py-3 md:px-4 md:py-3.5">
                    <p className={`text-[12px] md:text-[16px] font-light leading-[1.4] transition-colors duration-300 ${
                      isSelected ? 'text-brass-muted' : 'text-charcoal group-hover:text-brass-muted'
                    }`}>
                      {opt.text}
                    </p>
                    {opt.subtext && (
                      <p className="mt-1 text-[10px] md:text-[11px] leading-[1.5] text-anthracite/35 font-light line-clamp-2">{opt.subtext}</p>
                    )}
                  </div>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500 ${
                    isSelected ? 'bg-brass' : 'bg-transparent group-hover:bg-brass/20'
                  }`} />
                </motion.button>
              );
            })}
          </div>

          {isMulti && (
            <div className="mt-8 text-center">
              <ContinuaButton onClick={onContinue} enabled />
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
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!nome.trim() || !email.trim() || !whatsapp.trim()) {
      setError('Completa tutti i campi per scoprire la tua soluzione.');
      return;
    }
    onSubmit({ nome: nome.trim(), email: email.trim(), whatsapp: whatsapp.trim() });
  };

  const inputClass = 'w-full bg-white/60 border border-sand/50 px-5 py-4 text-[17px] text-anthracite/80 font-light outline-none focus:border-brass/50 transition-colors duration-300 placeholder:text-anthracite/28';

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
        <img src="/images/quiz/quiz-form.jpg" alt="" className="w-full h-full object-cover opacity-[0.04] lg:opacity-[0.06]" loading="lazy" />
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
        <input
          type="tel"
          placeholder="Il tuo numero WhatsApp *"
          value={whatsapp}
          onChange={e => { setWhatsapp(e.target.value); setError(''); }}
          className={inputClass}
        />

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
              Scopri la tua soluzione
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
  answers,
  onReset,
}: {
  nome: string;
  answers: Answers;
  onReset: () => void;
}) {
  const d3 = answers['d3'] as string | undefined;
  const sequence = buildQuestionSequence(d3);
  const scores = computeScores(answers, sequence);
  const { primary, secondary, primaryPct: _primaryPct, secondaryPct } = getPercorsoResult(scores);
  const content = RESULT_CONTENT[primary];
  const esperienze = getEsperienze(primary, answers);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: premiumEase }}
      className="relative w-full"
    >
      {/* Atmospheric background image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src="/images/quiz/quiz-result.jpg" alt="" className="w-full h-full object-cover opacity-[0.04] lg:opacity-[0.07]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/50 via-ivory/85 to-ivory" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 lg:px-12 py-10 md:py-14">
      {/* Titolo personalizzato */}
      <div className="mb-10 md:mb-14">
        <span className="text-[11px] tracking-[0.4em] uppercase text-brass-muted font-light block mb-4">La tua analisi</span>
        <h2 className="font-serif text-[24px] md:text-[34px] font-light leading-[1.15] text-charcoal">
          {nome ? `${nome}, il percorso che fa per te è…` : 'Il percorso che fa per te è…'}
        </h2>
      </div>

      {/* Grid principale */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-14">

        {/* Colonna sinistra: percorso */}
        <div>
          <div className="border-l-[3px] border-brass pl-6 mb-8">
            <h3 className="font-serif text-[32px] md:text-[42px] font-light leading-[1.1] text-charcoal mb-2">
              {content.nome}
            </h3>
            <p className="font-serif text-[19px] md:text-[18px] italic text-anthracite/40 font-light">
              {content.sottotitolo}
            </p>
          </div>

          {/* Copy */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-2">Cosa risolve</span>
              <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/65 font-light">{content.cosaRisolve}</p>
            </div>
            <div className="border-t border-sand/35 pt-5">
              <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-2">Perché è giusto per te</span>
              <p className="text-[17px] md:text-[18px] leading-[1.85] text-anthracite/65 font-light italic">{content.percheTe}</p>
            </div>
          </div>
        </div>

        {/* Colonna destra: esperienze */}
        <div>
          <span className="text-[10px] tracking-[0.35em] uppercase text-brass-muted font-light block mb-6">Esperienze consigliate</span>
          <div className="space-y-3">
            {esperienze.map((es, i) => (
              <motion.div
                key={es.nome}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.15, duration: 0.55, ease: premiumEase }}
                className="border border-sand/40 p-5 bg-ecru/15"
              >
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brass/60 mt-[6px] flex-shrink-0" />
                  <div>
                    <h4 className="font-serif text-[20px] font-light text-charcoal mb-1">{es.nome}</h4>
                    <p className="text-[12px] leading-[1.7] text-anthracite/45 font-light">{es.sottotitolo}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Percorso secondario */}
          {secondary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-5 p-4 border border-brass/20 bg-brass/5"
            >
              <p className="text-[12px] leading-[1.75] text-anthracite/55 font-light">
                Potresti anche valutare:{' '}
                <strong className="text-charcoal/80 font-normal">{PERCORSO_LABELS[secondary]}</strong>{' '}
                ({secondaryPct}% compatibile). La consulenza in sede ti aiuterà a scegliere il percorso più adatto.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* CTA + Ricomincia */}
      <div className="border-t border-sand/35 pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/contatti"
          onClick={() => window.scrollTo(0, 0)}
          className="relative overflow-hidden group inline-flex items-center gap-4 bg-charcoal text-ivory text-[12px] tracking-[0.2em] uppercase font-light px-10 py-5"
        >
          <span className="absolute inset-0 bg-deep translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0,1)]" />
          <span className="relative z-10 flex items-center gap-4">
            Prenota la tua consulenza gratuita
            <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </Link>
        <button
          onClick={onReset}
          className="text-[11px] tracking-[0.2em] uppercase font-light text-anthracite/35 border border-anthracite/15 px-8 py-5 hover:text-anthracite/70 hover:border-anthracite/25 transition-all duration-300"
        >
          Ricomincia
        </button>
      </div>

      {/* Disclaimer */}
      <p className="mt-10 text-[11px] leading-[1.7] text-anthracite/28 font-light italic text-center max-w-xl mx-auto">
        Questo risultato ha valore esclusivamente orientativo. La valutazione definitiva del tuo capello e della tua cute avviene in sede, durante la consulenza professionale con la tua professionista Luxosa.
      </p>
      </div>
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
                {screen === 'result' ? 'Luxosa Test — Risultato' : screen === 'form' ? 'Ultimo passo' : ''}
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
              answers={answers}
              onReset={onReset}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
