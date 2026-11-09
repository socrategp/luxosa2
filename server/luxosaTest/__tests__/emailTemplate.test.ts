import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderDossierTemplate, TEMPLATE_MARKER } from '../emailTemplate.js';
import { buildDossierEmailContent, usesDossierTemplate } from '../submission.js';

const TEMPLATE = `<html><body><div><p>Intestazione</p></div>
<div><p style="text-align: left;"><span style="color: rgb(208, 208, 208); font-size: 11px">${TEMPLATE_MARKER}     </span></p></div>
<div><p>Per qualunque domanda, ci scriva o ci telefoni: siamo&nbsp;qui.</p></div></body></html>`;

test('replaces the whole placeholder paragraph and keeps the rest of the template', () => {
  const html = renderDossierTemplate(TEMPLATE, ['Gentile Giulia,', 'Testo $& con simboli']);
  assert.ok(html);
  assert.ok(!html.includes(TEMPLATE_MARKER));
  assert.ok(!html.includes('rgb(208, 208, 208)'), 'placeholder styling must not reach the client');
  assert.ok(html.includes('<p>Intestazione</p>'));
  assert.ok(html.includes('siamo&nbsp;qui.'));
  assert.ok(html.includes('Gentile Giulia,'));
  assert.ok(html.includes('Testo $& con simboli'), 'replacement text is inserted literally');
});

test('returns null when the template has no placeholder', () => {
  assert.equal(renderDossierTemplate('<p>niente</p>', ['x']), null);
});

test('Italian email uses the template: text and closing from the server, signature from the template', () => {
  const { subject, html } = buildDossierEmailContent('Giulia', 'ColorLux', 'it', TEMPLATE);
  assert.equal(subject, 'Il Suo Luxosa Test è pronto');
  assert.ok(html.includes('Intestazione'));
  assert.ok(html.includes('Gentile Giulia,'));
  assert.ok(html.includes('<strong>ColorLux</strong>'));
  assert.ok(html.includes('Un cordiale saluto,'));
  assert.ok(html.includes('WhatsApp'));
  assert.ok(!html.includes('Luxosa Messina Cavour'), 'signature comes from the template only');
});

test('falls back to the built-in email when the template is missing or broken', () => {
  for (const tpl of [null, '<p>senza segnaposto</p>']) {
    const { html } = buildDossierEmailContent('Giulia', 'ColorLux', 'it', tpl);
    assert.ok(html.includes('Un cordiale saluto,'));
    assert.ok(html.includes('Luxosa Messina Cavour'));
  }
});

test('non-Italian emails keep the built-in email in the client language', () => {
  assert.equal(usesDossierTemplate('en'), false);
  assert.equal(usesDossierTemplate('it'), true);
  const { html } = buildDossierEmailContent('Anna', 'ColorLux', 'en', TEMPLATE);
  assert.ok(!html.includes('Intestazione'));
  assert.ok(html.includes('Dear Anna,'));
});

test('first name is escaped inside the template', () => {
  const { html } = buildDossierEmailContent('<b>x</b>', 'ColorLux', 'it', TEMPLATE);
  assert.ok(html.includes('&lt;b&gt;x&lt;/b&gt;'));
});
