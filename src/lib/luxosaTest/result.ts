// ---------------------------------------------------------------
// LUXOSA TEST — CANONICAL RESULT MODEL
// Moved verbatim from DiagnosticTakeover.tsx (no logic changes).
// Single source of truth for question bank, scoring and report text.
// Consumed by: DiagnosticTakeover.tsx (ResultScreen, WhatsApp message),
// DiagnosticTakeoverTest.tsx, and (later) the PDF/email builders.
// ---------------------------------------------------------------

import { t } from '../../i18n/t';

// -- TYPES --------------------------------------------------------

export type Percorso = 'cute' | 'rinascita' | 'colore' | 'armonia' | 'rituale';
export type Scores = Record<Percorso, number>;
export type BranchKey = 'cute' | 'struttura' | 'colore' | 'forma' | 'completo';
export type Answers = Record<string, string | string[]>;
export type PublicPercorso = 'benessere' | 'colorlux' | 'rituale';
export type AttentionLevel = 'ordinaria' | 'mirata' | 'prioritaria';

export interface OptionDef {
  id: string;
  text: string;
  subtext?: string;
  scores: Partial<Scores>;
  image?: string;
}
export interface QuestionDef {
  id: string;
  label: string;
  question: string;
  subtitle?: string;
  selectionType: 'single' | 'multi' | 'text';
  maxSelections?: number;
  options: OptionDef[];
}

export interface EsperienzaDef {
  nome: string;
  sottotitolo: string;
}

const MAX_SCORES: Scores = {
  cute: 19,
  rinascita: 17,
  colore: 15,
  armonia: 15,
  rituale: 20,
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

export function getBranchKey(d3: string): BranchKey {
  const map: Record<string, BranchKey> = {
    d3_cute: 'cute',
    d3_rovinato: 'struttura',
    d3_colore: 'colore',
    d3_forma: 'forma',
    d3_tutto: 'completo',
  };
  return map[d3] ?? 'completo';
}

export function buildQuestionSequence(d3Answer: string | undefined): QuestionDef[] {
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

export function computeScores(answers: Answers, sequence: QuestionDef[]): Scores {
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

export function getPercorsoResult(scores: Scores): {
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

export const PUBLIC_PERCORSO_NAMES: Record<PublicPercorso, string> = {
  benessere: 'BenEssere',
  colorlux: 'ColorLux',
  rituale: 'Rituale Luxosa',
};

export function getPublicPercorso(primary: Percorso, scores: Scores): PublicPercorso {
  if (primary === 'cute' || primary === 'rinascita') return 'benessere';
  if (primary === 'colore') return 'colorlux';
  if (primary === 'rituale') return 'rituale';
  // primary === 'armonia': default BenEssere; Rituale solo se segnali di complessità multi-area forti
  if (scores.rituale >= 4) return 'rituale';
  return 'benessere';
}

export function getSecondaryPublic(primary: Percorso, secondary: Percorso | null, scores: Scores): PublicPercorso | null {
  if (!secondary) return null;
  const primaryPub = getPublicPercorso(primary, scores);
  const secondPub = getPublicPercorso(secondary, scores);
  if (secondPub === primaryPub) return null;
  return secondPub;
}

// -- LIVELLO DI ATTENZIONE ---------------------------------------

export function getAttentionLevel(answers: Answers, primary: Percorso): AttentionLevel {
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

// -- HELPERS DI TESTO ---------------------------------------------

// Natural Italian serial list: "a", "a e b", "a, b e c" — never chains
// multiple "e" when joining already-selected descriptors.
function joinItalianList(items: string[]): string {
  const clean = items.map(s => s.trim()).filter(Boolean);
  if (clean.length === 0) return '';
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(', ')} e ${clean[clean.length - 1]}`;
}

// Splits a label on commas that separate true list fragments (e.g. "fragili,
// poco resistenti" -> 2 items), but NOT on a comma immediately followed by a
// coordinating conjunction (ma/e/o/però) — that comma belongs to a single
// clause (e.g. "in buona salute, ma con margine di miglioramento" must stay
// whole, or joining it with another item produces "... e ma ...").
const ENUMERATION_COMMA = /,(?!\s*(?:ma|e|o|però)\s)/i;
function splitEnumerableFragments(label: string): string[] {
  return label.split(ENUMERATION_COMMA).map(s => s.trim()).filter(Boolean);
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
  // Compound labels (e.g. "fragili, poco resistenti") have their enumerable
  // fragments split into separate list items, then the whole thing (tipo +
  // every selected descriptor) is joined with a single natural Italian
  // serial "e" at the end, never one "e" per compound label. Labels whose
  // comma belongs to a single clause (e.g. "in buona salute, ma con margine
  // di miglioramento") are kept intact by splitEnumerableFragments.
  const statoItems = d2arr.flatMap(id => splitEnumerableFragments(statoLabels[id] ?? ''));
  // Evita contraddizione: "in buona salute" + danno da colore rilevato in d5c
  const d5cForCond = answers['d5c'];
  const d5cArrForCond = Array.isArray(d5cForCond) ? (d5cForCond as string[]) : d5cForCond ? [d5cForCond as string] : [];
  const hasColorContradiction = !!(d3 && getBranchKey(d3) === 'colore' && d5cArrForCond.includes('d5c_danneggia') && d2arr.includes('d2_sani'));

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

  const openingSentence = hasColorContradiction
    ? t('report:templates.hairSummaryOverride', { tipo, overrideClause: t('report:diagnostic.shortLabels.statoColoreBase') })
    : t('report:templates.hairSummary', { list: joinItalianList([tipo, ...statoItems]) });

  const parts = [
    openingSentence,
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

export const LUXOSA_LOCATIONS = [
  {
    id: 'messina-cavour',
    label:t('test:diagnostic.takeover.233'),
    whatsapp: '390902403220',
  },
] as const;

// -- CANONICAL RESULT BUILDER -------------------------------------
// Single entry point: every consumer (ResultScreen, WhatsApp message,
// PDF, email, staff note) must derive from this, never recompute.

export interface LuxosaTestResult {
  scores: Scores;
  primary: Percorso;
  secondary: Percorso | null;
  primaryPct: number;
  secondaryPct: number;
  percorsoPublic: PublicPercorso;
  secondaryPublic: PublicPercorso | null;
  percorsoName: string;
  percorsoTagline: string;
  secondaryName: string | null;
  attentionLevel: AttentionLevel;
  attentionNote: string;
  conditionSummary: string;
  mainSignals: string[];
  desiredOutcome: string;
  percorsoRationale: string;
  esperienze: { es: EsperienzaDef; perche: string }[];
  consultationFocus: string[];
  d10Note: string | null;
  closing: string;
}

// -- TAGLINE PERCORSO (hero, breve, derivata dal risultato) -------

function buildPercorsoTagline(pub: PublicPercorso): string {
  if (pub === 'benessere') return 'Equilibrio tra cute e capello, costruito con metodo.';
  if (pub === 'colorlux') return 'Colore e luce, pensati per durare nel tempo.';
  return 'Cura, forma e colore in un’unica regia.';
}

// -- NOTA LIVELLO DI ATTENZIONE (orientativa, mai medica) ---------

function buildAttentionNote(level: AttentionLevel): string {
  if (level === 'prioritaria') {
    return 'Alcuni segnali emersi meritano un approfondimento particolare durante la lettura professionale in Maison.';
  }
  if (level === 'mirata') {
    return 'Alcuni segnali meritano attenzione nella lettura professionale in Maison.';
  }
  return 'Il quadro appare equilibrato: la lettura in Maison confermerà la direzione più adatta.';
}

export function buildLuxosaTestResult(answers: Answers): LuxosaTestResult {
  const d3 = answers['d3'] as string | undefined;
  const sequence = buildQuestionSequence(d3);
  const scores = computeScores(answers, sequence);
  const { primary, secondary, primaryPct, secondaryPct } = getPercorsoResult(scores);

  const percorsoPublic = getPublicPercorso(primary, scores);
  const secondaryPublic = getSecondaryPublic(primary, secondary, scores);
  const attentionLevel = getAttentionLevel(answers, primary);
  const percorsoName = PUBLIC_PERCORSO_NAMES[percorsoPublic];
  const percorsoTagline = buildPercorsoTagline(percorsoPublic);
  const attentionNote = buildAttentionNote(attentionLevel);
  const secondaryName = secondaryPublic ? PUBLIC_PERCORSO_NAMES[secondaryPublic] : null;

  const conditionSummary = buildConditionSummary(answers, primary);
  const mainSignals = buildMainSignals(answers, primary);
  const desiredOutcome = buildDesiredOutcome(percorsoPublic, primary, answers);
  const percorsoRationale = buildPercorsoRationale(percorsoPublic, primary, answers, attentionLevel);
  const esperienze = getNewEsperienze(percorsoPublic, primary, answers);
  const esperienzaNames = new Set(esperienze.map(e => e.es.nome));
  const consultationFocus = buildConsultationFocus(primary, answers, esperienzaNames);
  const d10Note = buildD10Note(answers['d10'] as string | undefined);
  const closing = buildClosing(percorsoPublic, attentionLevel, primary, answers);

  return {
    scores,
    primary,
    secondary,
    primaryPct,
    secondaryPct,
    percorsoPublic,
    secondaryPublic,
    percorsoName,
    percorsoTagline,
    secondaryName,
    attentionLevel,
    attentionNote,
    conditionSummary,
    mainSignals,
    desiredOutcome,
    percorsoRationale,
    esperienze,
    consultationFocus,
    d10Note,
    closing,
  };
}
