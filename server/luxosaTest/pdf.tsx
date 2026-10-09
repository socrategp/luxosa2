// ---------------------------------------------------------------
// LUXOSA TEST — PDF DOSSIER (server-side only, not part of the Vite app bundle)
// Renders the same canonical LuxosaTestResult (see src/lib/luxosaTest/result.ts)
// used by the on-site summary and the WhatsApp message — no separate content
// logic lives here, only layout/typography for the printable dossier.
//
// Pagination is fully dynamic: everything lives inside ONE <Page wrap>,
// and @react-pdf/renderer flows it across as many physical pages as the
// content actually needs. Do not split this into multiple <Page> blocks —
// that was the bug that produced a fixed, mostly-empty page 2 before.
//
// Media is entirely optional and resolved elsewhere (see
// src/lib/luxosaTest/media.ts) — this file only knows how to lay a
// ResolvedLuxosaTestMedia out if one is passed in. No media -> no gaps,
// the dossier stays exactly as elegant as the text-only version.
// ---------------------------------------------------------------

import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { t } from '../../src/i18n/t';
import type { LuxosaTestResult, AttentionLevel } from '../../src/lib/luxosaTest/result';
import type { ResolvedLuxosaTestMedia, LuxosaTestMediaAsset, LuxosaTestMediaAspect } from '../../src/lib/luxosaTest/media';
import { resolvePdfImageSrc } from './pdfAssets';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

Font.register({
  family: 'Cormorant Garamond',
  fonts: [
    { src: require.resolve('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff') },
    { src: require.resolve('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff'), fontWeight: 500 },
    { src: require.resolve('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff'), fontWeight: 600 },
    { src: require.resolve('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff'), fontStyle: 'italic' },
  ],
});

Font.register({
  family: 'Jost',
  fonts: [
    { src: require.resolve('@fontsource/jost/files/jost-latin-300-normal.woff'), fontWeight: 300 },
    { src: require.resolve('@fontsource/jost/files/jost-latin-400-normal.woff'), fontWeight: 400 },
    { src: require.resolve('@fontsource/jost/files/jost-latin-500-normal.woff'), fontWeight: 500 },
    { src: require.resolve('@fontsource/jost/files/jost-latin-400-italic.woff'), fontStyle: 'italic' },
  ],
});

// Luxosa design-system palette (src/index.css @theme) — print values.
const COLORS = {
  ivory: '#F9F6F1',
  ecru: '#F1EEE5',
  sand: '#DED7CB',
  anthracite: '#38342F',
  charcoal: '#282520',
  brass: '#B09872',
  brassMuted: '#9E8868',
};

const ATTENTION_LABELS: Record<AttentionLevel, string> = {
  ordinaria: 'Attenzione ordinaria',
  mirata: 'Attenzione mirata',
  prioritaria: 'Attenzione prioritaria',
};

// Per-aspect box heights for media slots — a pragmatic fixed value per
// named aspect rather than computing from the source image's real
// ratio (object-fit: cover crops to fill regardless).
const ASPECT_HEIGHT: Record<LuxosaTestMediaAspect, number> = {
  'landscape-16-9': 170,
  'landscape-3-2': 190,
  'portrait-4-5': 220,
  'portrait-3-4': 200,
  square: 180,
};

function heightForAsset(asset: LuxosaTestMediaAsset | null | undefined, fallback: LuxosaTestMediaAspect): number {
  return ASPECT_HEIGHT[asset?.aspect ?? fallback];
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.ivory,
    paddingTop: 54,
    paddingBottom: 60,
    paddingHorizontal: 52,
    fontFamily: 'Jost',
    fontSize: 10.5,
    color: COLORS.anthracite,
  },
  kicker: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: COLORS.brassMuted,
  },
  kickerSub: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: COLORS.anthracite,
    opacity: 0.7,
    marginBottom: 20,
  },
  heroName: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 26,
    fontWeight: 500,
    color: COLORS.charcoal,
  },
  heroDate: {
    fontSize: 9,
    color: COLORS.anthracite,
    opacity: 0.55,
    marginTop: 3,
    marginBottom: 20,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.sand,
    marginBottom: 20,
  },
  orientamentoLabel: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: COLORS.brassMuted,
    marginBottom: 6,
  },
  percorsoName: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 36,
    fontWeight: 400,
    color: COLORS.charcoal,
  },
  percorsoTagline: {
    fontSize: 10.5,
    fontStyle: 'italic',
    color: COLORS.anthracite,
    opacity: 0.65,
    marginTop: 4,
  },
  heroImage: {
    width: '100%',
    objectFit: 'cover',
    marginTop: 18,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: COLORS.brassMuted,
    marginTop: 24,
    marginBottom: 8,
  },
  body: {
    fontSize: 10.5,
    lineHeight: 1.6,
    color: COLORS.anthracite,
  },
  signalRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.brass,
    marginTop: 4,
    marginRight: 8,
  },
  dotMuted: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.sand,
    marginTop: 4,
    marginRight: 8,
  },
  // Attention: one neutral treatment for all three levels on purpose —
  // never color-coded by severity (no medical scale, no traffic light).
  attentionBox: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.brass,
    paddingLeft: 12,
    paddingVertical: 2,
  },
  attentionValue: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 15,
    color: COLORS.charcoal,
  },
  attentionNote: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: COLORS.anthracite,
    opacity: 0.65,
    marginTop: 4,
  },
  rationaleBox: {
    marginTop: 4,
    padding: 16,
    backgroundColor: COLORS.ecru,
  },
  esperienzaRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sand,
    paddingVertical: 14,
  },
  esperienzaIndex: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 20,
    color: COLORS.brass,
    width: 36,
  },
  esperienzaContent: {
    flex: 1,
  },
  esperienzaNome: {
    fontFamily: 'Cormorant Garamond',
    fontSize: 17,
    fontWeight: 400,
    color: COLORS.charcoal,
  },
  esperienzaSottotitolo: {
    fontSize: 8.5,
    color: COLORS.anthracite,
    opacity: 0.6,
    marginTop: 2,
    marginBottom: 6,
  },
  mediaImage: {
    width: '100%',
    objectFit: 'cover',
    marginBottom: 8,
  },
  devPlaceholderBox: {
    width: '100%',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.brassMuted,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.ecru,
  },
  devPlaceholderLabel: {
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLORS.brassMuted,
  },
  devPlaceholderCaption: {
    fontSize: 7.5,
    color: COLORS.anthracite,
    opacity: 0.6,
    marginTop: 2,
  },
  beforeAfterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 6,
  },
  beforeAfterCell: {
    flex: 1,
  },
  beforeAfterCaption: {
    fontSize: 7.5,
    color: COLORS.anthracite,
    opacity: 0.55,
    textAlign: 'center',
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  brandSignoff: {
    fontFamily: 'Cormorant Garamond',
    fontStyle: 'italic',
    fontSize: 14,
    color: COLORS.brassMuted,
    marginTop: 14,
  },
  finalDisclaimerBlock: {
    borderTopWidth: 1,
    borderTopColor: COLORS.sand,
    marginTop: 26,
    paddingTop: 14,
  },
  finalDisclaimerText: {
    fontSize: 8,
    lineHeight: 1.6,
    color: COLORS.anthracite,
    opacity: 0.55,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 52,
    right: 52,
    fontSize: 7.5,
    letterSpacing: 0.5,
    color: COLORS.anthracite,
    opacity: 0.45,
    textAlign: 'center',
  },
});

function isDevPlaceholder(asset: LuxosaTestMediaAsset | undefined | null): boolean {
  return !!asset?.id.startsWith('dev-placeholder');
}

function MediaSlot({ asset, aspect }: { asset: LuxosaTestMediaAsset | null | undefined; aspect: LuxosaTestMediaAspect }) {
  if (!asset?.imageSrc) return null;
  const height = heightForAsset(asset, aspect);
  if (isDevPlaceholder(asset)) {
    return (
      <View style={[styles.devPlaceholderBox, { height }]}>
        <Text style={styles.devPlaceholderLabel}>Dev placeholder</Text>
        {asset.title && <Text style={styles.devPlaceholderCaption}>{asset.title}</Text>}
      </View>
    );
  }
  return <Image src={resolvePdfImageSrc(asset.imageSrc)} style={[styles.mediaImage, { height }]} />;
}

export interface LuxosaTestDossierProps {
  result: LuxosaTestResult;
  contact: { nome: string; cognome: string; email: string; whatsapp: string };
  submittedAt: Date;
  media?: ResolvedLuxosaTestMedia;
}

export function LuxosaTestDossier({ result, contact, submittedAt, media }: LuxosaTestDossierProps) {
  const fullName = `${contact.nome} ${contact.cognome}`.trim();
  const dateLabel = submittedAt.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const footerLabel = `Luxosa Test · Orientamento preliminare · ${fullName || 'Report personalizzato'} · ${dateLabel}`;
  const secondaryBeforeAfter = media?.beforeAfter ?? [];

  return (
    <Document title={`Luxosa Test — ${fullName || 'Report personalizzato'}`} author="Luxosa">
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.kicker}>Luxosa Test</Text>
        <Text style={styles.kickerSub}>Dossier personalizzato</Text>

        <Text style={styles.heroName}>{fullName || 'Il tuo Luxosa Test'}</Text>
        <Text style={styles.heroDate}>{dateLabel}</Text>

        <MediaSlot asset={media?.hero} aspect="landscape-3-2" />

        <View style={styles.divider} />

        <Text style={styles.orientamentoLabel}>Il tuo orientamento</Text>
        <Text style={styles.percorsoName}>{result.percorsoName}</Text>
        <Text style={styles.percorsoTagline}>{result.percorsoTagline}</Text>

        <Text style={styles.sectionLabel} minPresenceAhead={50}>Condizione di partenza</Text>
        <Text style={styles.body}>{result.conditionSummary}</Text>

        <Text style={styles.sectionLabel} minPresenceAhead={70}>Segnali principali</Text>
        {result.mainSignals.map((signal, i) => (
          <View style={styles.signalRow} key={i}>
            <View style={styles.dot} />
            <Text style={styles.body}>{signal}</Text>
          </View>
        ))}

        <View style={styles.attentionBox} wrap={false} minPresenceAhead={70}>
          <Text style={[styles.sectionLabel, { marginTop: 0 }]}>Livello di attenzione</Text>
          <Text style={styles.attentionValue}>{ATTENTION_LABELS[result.attentionLevel]}</Text>
          <Text style={styles.attentionNote}>{result.attentionNote}</Text>
        </View>

        <Text style={styles.sectionLabel} minPresenceAhead={50}>La direzione</Text>
        <Text style={styles.body}>{result.desiredOutcome}</Text>

        <View wrap={false} style={styles.rationaleBox} minPresenceAhead={90}>
          <Text style={[styles.sectionLabel, { marginTop: 0 }]}>Perché questo percorso</Text>
          <Text style={styles.body}>{result.percorsoRationale}</Text>
        </View>

        <Text style={styles.sectionLabel} minPresenceAhead={90}>Esperienze Signature consigliate</Text>
        {result.esperienze.map((item, i) => (
          <View key={item.es.nome} wrap={false} style={styles.esperienzaRow}>
            <Text style={styles.esperienzaIndex}>{String(i + 1).padStart(2, '0')}</Text>
            <View style={styles.esperienzaContent}>
              <MediaSlot asset={media?.experienceMedia[item.es.nome]?.[0]} aspect="portrait-4-5" />
              <Text style={styles.esperienzaNome}>{item.es.nome}</Text>
              <Text style={styles.esperienzaSottotitolo}>{item.es.sottotitolo}</Text>
              <Text style={[styles.body, { fontStyle: 'italic' }]}>{item.perche}</Text>
            </View>
          </View>
        ))}

        {secondaryBeforeAfter.map(ba => (
          <View key={ba.id} wrap={false} style={{ marginTop: 16 }}>
            <Text style={styles.sectionLabel}>Prima / dopo</Text>
            <View style={styles.beforeAfterRow}>
              <View style={styles.beforeAfterCell}>
                <MediaSlot
                  asset={{ id: ba.id, type: 'experience', imageSrc: ba.beforeImage, aspect: 'portrait-4-5', alt: 'prima', channels: ['pdf'], approved: true }}
                  aspect="portrait-4-5"
                />
                <Text style={styles.beforeAfterCaption}>Prima</Text>
              </View>
              <View style={styles.beforeAfterCell}>
                <MediaSlot
                  asset={{ id: ba.id, type: 'experience', imageSrc: ba.afterImage, aspect: 'portrait-4-5', alt: 'dopo', channels: ['pdf'], approved: true }}
                  aspect="portrait-4-5"
                />
                <Text style={styles.beforeAfterCaption}>Dopo</Text>
              </View>
            </View>
            {ba.caption && <Text style={[styles.body, { fontSize: 9, opacity: 0.7 }]}>{ba.caption}</Text>}
            {ba.disclaimer && <Text style={[styles.body, { fontSize: 8, opacity: 0.5, fontStyle: 'italic' }]}>{ba.disclaimer}</Text>}
          </View>
        ))}

        {result.secondaryName && (
          <Text style={[styles.body, { marginTop: 16, marginBottom: 4 }]}>
            La consulenza potrebbe rivelare un'affinità anche con{' '}
            <Text style={{ fontWeight: 600 }}>{result.secondaryName}</Text>
            . La lettura in presenza definirà la direzione più coerente.
          </Text>
        )}

        <Text style={styles.sectionLabel} minPresenceAhead={70}>Cosa approfondire in consulenza</Text>
        {result.consultationFocus.map((point, i) => (
          <View style={styles.signalRow} key={i}>
            <View style={styles.dotMuted} />
            <Text style={styles.body}>{point}</Text>
          </View>
        ))}

        {result.d10Note && (
          <>
            <Text style={styles.sectionLabel} minPresenceAhead={50}>Dal tuo racconto</Text>
            <Text style={[styles.body, { fontStyle: 'italic' }]}>«{result.d10Note}»</Text>
          </>
        )}

        <Text style={[styles.body, { marginTop: 20 }]}>{result.closing}</Text>

        <Text style={styles.sectionLabel} minPresenceAhead={140}>Il prossimo passo</Text>
        <Text style={styles.body}>
          Il Luxosa Test è un primo orientamento. La lettura professionale in Maison permetterà di osservare
          direttamente cute, fibra, forma, storia e obiettivi dei tuoi capelli e definire la direzione più adatta a te.
        </Text>
        <Text style={styles.brandSignoff}>Ama, splendi, osa.</Text>

        <View style={styles.finalDisclaimerBlock} wrap={false}>
          <Text style={styles.finalDisclaimerText}>{t('report:disclaimer')}</Text>
        </View>

        <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) =>
          totalPages > 1 ? `${footerLabel} · ${pageNumber}/${totalPages}` : footerLabel
        } />
      </Page>
    </Document>
  );
}
