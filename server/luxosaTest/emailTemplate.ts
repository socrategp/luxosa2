// The dossier email is laid out by a GHL email-builder template the Maison
// edits itself; the server only writes the personalised text into the block
// that holds TEMPLATE_MARKER.

export const DOSSIER_EMAIL_TEMPLATE_ID = '6af240c9cbb68d20216c4878'; // "LUXOSA | MASTER | SERVICE | v1.2 | DD (luxosa.it)"
export const TEMPLATE_MARKER = '[[TESTO_LUXOSA]]';

// Same paragraph style the template uses for its own body text.
const PARAGRAPH_STYLE = 'margin:0 0 24px;font-family:Jost, arial, helvetica, sans-serif;font-size:16px;color:#38342F;line-height:26px;';

// The paragraph that carries the marker is replaced whole, so the marker's
// own placeholder styling (small grey text) never reaches the client.
const MARKER_PARAGRAPH = /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?\[\[TESTO_LUXOSA\]\](?:(?!<\/p>)[\s\S])*?<\/p>/;

export function renderDossierTemplate(templateHtml: string, paragraphs: string[]): string | null {
  if (!templateHtml.includes(TEMPLATE_MARKER)) return null;
  const body = paragraphs.map((p) => `<p style="${PARAGRAPH_STYLE}">${p}</p>`).join('');
  return MARKER_PARAGRAPH.test(templateHtml)
    ? templateHtml.replace(MARKER_PARAGRAPH, () => body)
    : templateHtml.replace(TEMPLATE_MARKER, () => body);
}
