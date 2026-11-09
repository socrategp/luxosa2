// ---------------------------------------------------------------
// LUXOSA TEST — PDF DOSSIER (server-side only, not part of the Vite app bundle)
// Renders the same canonical LuxosaTestResult (see src/lib/luxosaTest/result.ts)
// used by the on-site summary and the WhatsApp message — no separate content
// logic lives here, only layout/typography for the printable dossier.
//
// The dossier is made of one or two language sections: the client's chosen
// language first, then the Italian copy the Maison reads. Each section is ONE
// <Page wrap> that @react-pdf/renderer flows across as many physical pages as
// the content needs — do not split a section into several <Page> blocks (that
// produced a fixed, mostly-empty page 2 before).
//
// All fixed text comes from pdfLabels.ts (already resolved in the section's
// language); this file only knows layout, typography and fonts.
//
// Media is entirely optional and resolved elsewhere (see
// src/lib/luxosaTest/media.ts) — this file only knows how to lay a
// ResolvedLuxosaTestMedia out if one is passed in. No media -> no gaps,
// the dossier stays exactly as elegant as the text-only version.
// ---------------------------------------------------------------

import { Document, Page, View, Text as BaseText, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { Children, createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import type { LuxosaTestResult } from '../../src/lib/luxosaTest/result.js';
import type { ResolvedLuxosaTestMedia, LuxosaTestMediaAsset, LuxosaTestMediaAspect } from '../../src/lib/luxosaTest/media.js';
import { resolvePdfImageSrc } from './pdfAssets.js';
import { withLanguage } from './language.js';
import { buildDossierLabels, type DossierLabels } from './pdfLabels.js';
import { createRequire } from 'node:module';
import path from 'node:path';

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

// Russian: the same two families with Latin AND Cyrillic glyphs in one file
// (Fontsource's two subsets merged, under their own PostScript name — see
// assets/fonts/README.md). Separate subset files share one PostScript name, and
// the PDF writer re-embedded a new copy at every switch between alphabets.
const ASSET_FONTS = path.join(process.cwd(), 'server/luxosaTest/assets/fonts');
const assetFont = (file: string) => path.join(ASSET_FONTS, file);

Font.register({
  family: 'Cormorant Garamond LatCyr',
  fonts: [
    { src: assetFont('cormorant-garamond-latcyr-400-normal.ttf') },
    { src: assetFont('cormorant-garamond-latcyr-500-normal.ttf'), fontWeight: 500 },
    { src: assetFont('cormorant-garamond-latcyr-600-normal.ttf'), fontWeight: 600 },
    { src: assetFont('cormorant-garamond-latcyr-400-italic.ttf'), fontStyle: 'italic' },
  ],
});

Font.register({
  family: 'Jost LatCyr',
  fonts: [
    { src: assetFont('jost-latcyr-300-normal.ttf'), fontWeight: 300 },
    { src: assetFont('jost-latcyr-400-normal.ttf'), fontWeight: 400 },
    { src: assetFont('jost-latcyr-500-normal.ttf'), fontWeight: 500 },
    { src: assetFont('jost-latcyr-400-italic.ttf'), fontStyle: 'italic' },
  ],
});

// Japanese: Noto Sans JP (SIL OFL, see assets/fonts). One file, loaded only
// when a Japanese section is rendered; the renderer embeds just the glyphs
// actually used, so the PDF stays small.
// CJK has no true italics: the italic slot reuses the upright file so a
// section that mixes Latin italics with a Japanese name never fails to resolve.
const NOTO_SANS_JP = assetFont('NotoSansJP-Regular.otf');
Font.register({
  family: 'Noto Sans JP',
  fonts: [{ src: NOTO_SANS_JP }, { src: NOTO_SANS_JP, fontStyle: 'italic' }],
});

interface DossierFonts {
  sans: string | string[];
  serif: string | string[];
}

const CYRILLIC = /[\u0400-\u04FF]/;
const CJK = /[\u3000-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uFF00-\uFFEF]/;

// No automatic hyphenation: the renderer only ships English patterns, which
// split Italian, French, German or Spanish words in the wrong places. The text
// is ragged-right, so whole words simply move to the next line; an explicit
// soft hyphen is still honoured.
const SOFT_HYPHEN = '\u00AD';
Font.registerHyphenationCallback((word: string) =>
  word.includes(SOFT_HYPHEN) ? word.split(SOFT_HYPHEN) : [word],
);

// Invisible line-break opportunity inside Japanese text (see pdfGeneration.tsx).
// The renderer only wraps at spaces, so each marker is printed as a space at a
// size too small to see: the line can wrap there, nothing visible is added.
export const LINE_BREAK_OPPORTUNITY = '​';
const INVISIBLE_SPACE_SIZE = 0.1;

// The font chain follows the characters actually printed in the section — not
// only its language — because a client's name or free-text story can use any
// script (a Japanese name inside the Italian copy for the Maison, for
// instance). Fallback fonts are loaded only when such characters are present.
function fontsFor(sample: string): DossierFonts {
  const hasCyrillic = CYRILLIC.test(sample);
  const sans = [hasCyrillic ? 'Jost LatCyr' : 'Jost'];
  const serif = [hasCyrillic ? 'Cormorant Garamond LatCyr' : 'Cormorant Garamond'];
  if (CJK.test(sample)) { sans.push('Noto Sans JP'); serif.push('Noto Sans JP'); }
  return { sans: sans.length === 1 ? sans[0] : sans, serif: serif.length === 1 ? serif[0] : serif };
}

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

function createStyles(fonts: DossierFonts) {
  return StyleSheet.create({
    page: {
      backgroundColor: COLORS.ivory,
      paddingTop: 54,
      paddingBottom: 60,
      paddingHorizontal: 52,
      fontFamily: fonts.sans,
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
    copyBanner: {
      fontSize: 8,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: COLORS.brassMuted,
      marginBottom: 16,
    },
    heroName: {
      fontFamily: fonts.serif,
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
      fontFamily: fonts.serif,
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
    bodyItalic: {
      fontSize: 10.5,
      lineHeight: 1.6,
      color: COLORS.anthracite,
      fontStyle: 'italic',
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
      fontFamily: fonts.serif,
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
      fontFamily: fonts.serif,
      fontSize: 20,
      color: COLORS.brass,
      width: 36,
    },
    esperienzaContent: {
      flex: 1,
    },
    esperienzaNome: {
      fontFamily: fonts.serif,
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
      fontFamily: fonts.serif,
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
}

type DossierStyles = ReturnType<typeof createStyles>;

// True inside a section that prints Japanese. The renderer segments Japanese into
// tiny words and every boundary would be a hyphenation point: those breaks are
// forbidden (10000 is the line-breaker's "infinity") and the invisible break
// opportunities are used instead.
const JapaneseLayout = createContext(false);

function Text({ children, ...props }: ComponentProps<typeof BaseText> & { children?: ReactNode }) {
  const isJapanese = useContext(JapaneseLayout);
  return (
    <BaseText {...props} hyphenationPenalty={isJapanese ? 10000 : undefined}>
      {isJapanese ? withInvisibleBreaks(children) : children}
    </BaseText>
  );
}

function withInvisibleBreaks(children: ReactNode): ReactNode {
  return Children.map(children, child => {
    if (typeof child !== 'string' || !child.includes(LINE_BREAK_OPPORTUNITY)) return child;
    return child.split(LINE_BREAK_OPPORTUNITY).flatMap((part, i) =>
      i === 0 ? [part] : [<BaseText key={i} style={{ fontSize: INVISIBLE_SPACE_SIZE, letterSpacing: 0 }}> </BaseText>, part],
    );
  });
}

function isDevPlaceholder(asset: LuxosaTestMediaAsset | undefined | null): boolean {
  return !!asset?.id.startsWith('dev-placeholder');
}

function MediaSlot({ asset, aspect, styles }: { asset: LuxosaTestMediaAsset | null | undefined; aspect: LuxosaTestMediaAspect; styles: DossierStyles }) {
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

export interface DossierSection {
  language: string;
  result: LuxosaTestResult;
  labels: DossierLabels;
  // Small line above the content, e.g. marking the Italian copy kept for the Maison.
  banner?: string;
}

export interface LuxosaTestDossierProps {
  // Either pass `sections` (one per language) or, for the Italian-only dossier, just `result`.
  result?: LuxosaTestResult;
  sections?: DossierSection[];
  contact: { nome: string; cognome: string; email: string; whatsapp: string };
  submittedAt: Date;
  media?: ResolvedLuxosaTestMedia;
}

function DossierPage({ section, media }: { section: DossierSection; media?: ResolvedLuxosaTestMedia }) {
  const { result, labels } = section;
  const fonts = fontsFor(JSON.stringify([section.labels, section.result]));
  const styles = createStyles(fonts);
  const isJapanese = CJK.test(JSON.stringify([section.labels, section.result]));
  const secondaryBeforeAfter = media?.beforeAfter ?? [];

  return (
    <JapaneseLayout.Provider value={isJapanese}>
    <Page size="A4" style={styles.page} wrap>
      {section.banner && <Text style={styles.copyBanner}>{section.banner}</Text>}
      <Text style={styles.kicker}>Luxosa Test</Text>
      <Text style={styles.kickerSub}>{labels.kickerSub}</Text>

      <Text style={styles.heroName}>{labels.heroName}</Text>
      <Text style={styles.heroDate}>{labels.dateLabel}</Text>

      <MediaSlot asset={media?.hero} aspect="landscape-3-2" styles={styles} />

      <View style={styles.divider} />

      <Text style={styles.orientamentoLabel}>{labels.orientation}</Text>
      <Text style={styles.percorsoName}>{result.percorsoName}</Text>
      <Text style={styles.percorsoTagline}>{result.percorsoTagline}</Text>

      <Text style={styles.sectionLabel} minPresenceAhead={50}>{labels.condition}</Text>
      <Text style={styles.body}>{result.conditionSummary}</Text>

      <Text style={styles.sectionLabel} minPresenceAhead={70}>{labels.signals}</Text>
      {result.mainSignals.map((signal, i) => (
        <View style={styles.signalRow} key={i}>
          <View style={styles.dot} />
          <Text style={styles.body}>{signal}</Text>
        </View>
      ))}

      <View style={styles.attentionBox} wrap={false} minPresenceAhead={70}>
        <Text style={[styles.sectionLabel, { marginTop: 0 }]}>{labels.attentionTitle}</Text>
        <Text style={styles.attentionValue}>{labels.attention[result.attentionLevel]}</Text>
        <Text style={styles.attentionNote}>{result.attentionNote}</Text>
      </View>

      <Text style={styles.sectionLabel} minPresenceAhead={50}>{labels.direction}</Text>
      <Text style={styles.body}>{result.desiredOutcome}</Text>

      <View wrap={false} style={styles.rationaleBox} minPresenceAhead={90}>
        <Text style={[styles.sectionLabel, { marginTop: 0 }]}>{labels.why}</Text>
        <Text style={styles.body}>{result.percorsoRationale}</Text>
      </View>

      <Text style={styles.sectionLabel} minPresenceAhead={90}>{labels.experiences}</Text>
      {result.esperienze.map((item, i) => (
        <View key={item.es.nome} wrap={false} style={styles.esperienzaRow}>
          <Text style={styles.esperienzaIndex}>{String(i + 1).padStart(2, '0')}</Text>
          <View style={styles.esperienzaContent}>
            <MediaSlot asset={media?.experienceMedia[item.es.nome]?.[0]} aspect="portrait-4-5" styles={styles} />
            <Text style={styles.esperienzaNome}>{item.es.nome}</Text>
            <Text style={styles.esperienzaSottotitolo}>{item.es.sottotitolo}</Text>
            <Text style={styles.bodyItalic}>{item.perche}</Text>
          </View>
        </View>
      ))}

      {secondaryBeforeAfter.map(ba => (
        <View key={ba.id} wrap={false} style={{ marginTop: 16 }}>
          <Text style={styles.sectionLabel}>{labels.beforeAfter}</Text>
          <View style={styles.beforeAfterRow}>
            <View style={styles.beforeAfterCell}>
              <MediaSlot
                asset={{ id: ba.id, type: 'experience', imageSrc: ba.beforeImage, aspect: 'portrait-4-5', alt: 'prima', channels: ['pdf'], approved: true }}
                aspect="portrait-4-5"
                styles={styles}
              />
              <Text style={styles.beforeAfterCaption}>{labels.before}</Text>
            </View>
            <View style={styles.beforeAfterCell}>
              <MediaSlot
                asset={{ id: ba.id, type: 'experience', imageSrc: ba.afterImage, aspect: 'portrait-4-5', alt: 'dopo', channels: ['pdf'], approved: true }}
                aspect="portrait-4-5"
                styles={styles}
              />
              <Text style={styles.beforeAfterCaption}>{labels.after}</Text>
            </View>
          </View>
          {ba.caption && <Text style={[styles.body, { fontSize: 9, opacity: 0.7 }]}>{ba.caption}</Text>}
          {ba.disclaimer && <Text style={[styles.body, { fontSize: 8, opacity: 0.5, fontStyle: 'italic' }]}>{ba.disclaimer}</Text>}
        </View>
      ))}

      {result.secondaryName && (
        <Text style={[styles.body, { marginTop: 16, marginBottom: 4 }]}>
          {labels.secondaryLead}
          <Text style={{ fontWeight: 600 }}>{result.secondaryName}</Text>
          {labels.secondaryTail}
        </Text>
      )}

      <Text style={styles.sectionLabel} minPresenceAhead={70}>{labels.focus}</Text>
      {result.consultationFocus.map((point, i) => (
        <View style={styles.signalRow} key={i}>
          <View style={styles.dotMuted} />
          <Text style={styles.body}>{point}</Text>
        </View>
      ))}

      {result.d10Note && (
        <>
          <Text style={styles.sectionLabel} minPresenceAhead={50}>{labels.story}</Text>
          <Text style={styles.bodyItalic}>{labels.quoteOpen}{result.d10Note}{labels.quoteClose}</Text>
        </>
      )}

      <Text style={[styles.body, { marginTop: 20 }]}>{result.closing}</Text>

      <Text style={styles.sectionLabel} minPresenceAhead={140}>{labels.nextStepTitle}</Text>
      <Text style={styles.body}>{labels.nextStepText}</Text>
      <Text style={styles.brandSignoff}>{labels.signoff}</Text>

      <View style={styles.finalDisclaimerBlock} wrap={false}>
        <Text style={styles.finalDisclaimerText}>{labels.disclaimer}</Text>
      </View>

      <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) =>
        totalPages > 1 ? `${labels.footerLabel} · ${pageNumber}/${totalPages}` : labels.footerLabel
      } />
    </Page>
    </JapaneseLayout.Provider>
  );
}

export function LuxosaTestDossier({ result, sections, contact, submittedAt, media }: LuxosaTestDossierProps) {
  const fullName = `${contact.nome} ${contact.cognome}`.trim();
  const resolved: DossierSection[] = sections ?? [{
    language: 'it',
    result: result as LuxosaTestResult,
    labels: withLanguage('it', () => buildDossierLabels('it', fullName, submittedAt)),
  }];

  return (
    <Document title={resolved[0].labels.docTitle} author="Luxosa">
      {resolved.map((section, i) => (
        <DossierPage key={`${section.language}-${i}`} section={section} media={media} />
      ))}
    </Document>
  );
}
