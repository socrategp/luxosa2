// WhatsApp message the client sends to the Maison from the result screen.
// Built from the same canonical result as the on-site summary and the PDF.

import { t, inLanguage, currentLanguage } from '../../i18n/t.js';
import { MAISON_COPY_BANNER } from './maisonCopy.js';
import { buildLuxosaTestResult, PUBLIC_PERCORSO_NAMES, type Answers, type AttentionLevel } from './result.js';

// Mirrors the PDF dossier: the client's language first and, when that is not
// Italian, the full Italian copy the Maison reads underneath.
export function buildWhatsAppMessage(
  nome: string,
  email: string,
  whatsapp: string,
  fascia: string,
  sede: string,
  answers: Answers
): string {
  const language = currentLanguage();
  const isAnySlot = fascia === t('test:ui.result.slotAny');
  const block = () => buildWhatsAppReport(
    nome, email, whatsapp, isAnySlot ? t('test:ui.result.slotAny') : fascia, sede, answers,
  );
  if (language === 'it') return block();
  return [
    inLanguage(language, block),
    '',
    `——— ${MAISON_COPY_BANNER.toUpperCase()} ———`,
    '',
    inLanguage('it', block),
  ].join('\n');
}

function buildWhatsAppReport(
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
