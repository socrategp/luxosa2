// Every piece of fixed text in the dossier, resolved up front in ONE language.
// Must be called inside withLanguage(language, ...) (see language.ts): the PDF
// renderer then only handles plain strings and never needs the language again.

import { t } from '../../src/i18n/t.js';
import type { AttentionLevel } from '../../src/lib/luxosaTest/result.js';

export const DATE_LOCALES: Record<string, string> = {
  it: 'it-IT', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', ru: 'ru-RU', ja: 'ja-JP',
};

export interface DossierLabels {
  language: string;
  dateLabel: string;
  docTitle: string;
  footerLabel: string;
  kickerSub: string;
  heroName: string;
  orientation: string;
  condition: string;
  signals: string;
  attentionTitle: string;
  attention: Record<AttentionLevel, string>;
  direction: string;
  why: string;
  experiences: string;
  beforeAfter: string;
  before: string;
  after: string;
  secondaryLead: string;
  secondaryTail: string;
  focus: string;
  story: string;
  quoteOpen: string;
  quoteClose: string;
  nextStepTitle: string;
  nextStepText: string;
  signoff: string;
  disclaimer: string;
}

export function buildDossierLabels(language: string, fullName: string, submittedAt: Date): DossierLabels {
  const dateLabel = submittedAt.toLocaleDateString(DATE_LOCALES[language] ?? 'it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const footerName = fullName || t('report:pdf.fallbackFooterName');
  return {
    language,
    dateLabel,
    docTitle: t('report:pdf.docTitle', { name: fullName || t('report:pdf.fallbackFooterName') }),
    footerLabel: t('report:pdf.footer', { name: footerName, date: dateLabel }),
    kickerSub: t('report:pdf.kickerSub'),
    heroName: fullName || t('report:pdf.fallbackName'),
    orientation: t('report:pdf.yourOrientation'),
    condition: t('test:diagnostic.takeover.275'),
    signals: t('test:diagnostic.takeover.276'),
    attentionTitle: t('test:diagnostic.takeover.277'),
    attention: {
      ordinaria: t('test:ui.result.attention.ordinaria.title'),
      mirata: t('test:ui.result.attention.mirata.title'),
      prioritaria: t('test:ui.result.attention.prioritaria.title'),
    },
    direction: t('test:diagnostic.takeover.281'),
    why: t('test:diagnostic.takeover.282'),
    experiences: t('report:pdf.experiences'),
    beforeAfter: t('report:pdf.beforeAfter'),
    before: t('report:pdf.before'),
    after: t('report:pdf.after'),
    secondaryLead: t('report:pdf.secondaryLead'),
    secondaryTail: t('report:pdf.secondaryTail'),
    focus: t('test:diagnostic.takeover.284'),
    story: t('test:diagnostic.takeover.285'),
    quoteOpen: t('report:pdf.quoteOpen'),
    quoteClose: t('report:pdf.quoteClose'),
    nextStepTitle: t('report:pdf.nextStepTitle'),
    nextStepText: t('report:pdf.nextStepText'),
    signoff: t('report:pdf.signoff'),
    disclaimer: t('report:disclaimer'),
  };
}
