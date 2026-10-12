// Thin GHL REST client for the Luxosa Test E2E flow. Every WRITE method
// enforces the TEST MODE sandbox guard itself (never trusts callers), per
// the "server-side, never trust the browser Contact ID" requirement — a bug
// in the orchestrator cannot escalate into a write outside the sandbox.
//
// Scopes empirically confirmed against the Test Lifecycle sandbox
// (read-only GET/no-op probes, 2026-10-10): contacts.readonly, contacts
// search/query, contacts.write, contacts/notes.readonly all return 200.
// locations.readonly and locations/customFields.readonly return 401 ("not
// authorized for this scope"); conversations/search (a read endpoint) also
// returns 401, but that scope is unrelated to sending. conversations/
// message.write was added separately, and real email sending is verified
// working end to end (see sendDossierEmail).

const BASE_URL = 'https://services.leadconnectorhq.com';
const CONTACTS_API_VERSION = '2021-07-28';
// Verified separately in an earlier phase for the Documenti upload endpoint.
const UPLOAD_API_VERSION = 'v3';

export const SANDBOX_CONTACT_ID = 'xvwmhVsXiGuoHfVbTTtG';
export const SANDBOX_LOCATION_ID = 'BLblyxBc2SQtAviSppr5';

// Custom Field IDs — given by the brief, never re-derived or assumed
// elsewhere in this codebase.
export const FIELD_ULTIMA_DATA = 'baDYUcYkGZ2UUVgD9FRD';
export const FIELD_DOCUMENTI = 'tzRkZVDj1SoYHUlkO5AF';
// Confirmed: "Privacy | Consenso marketing" (key
// contact.privacy__consenso_marketing), CHECKBOX type, API value format
// ["Consenso prestato"]. Write/read verified empirically on the sandbox
// contact.
export const FIELD_CONSENSO_MARKETING = 'vRIoj7Qom8xNRclYt5ub';
export const CONSENSO_MARKETING_OPTION = 'Consenso prestato';

export function isTestMode(): boolean {
  return process.env.LUXOSA_TEST_MODE === 'test';
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// The ONLY email TEST MODE is authorized to target — never hardcoded, read
// from the environment each time so Preview/local can set it independently
// of production. Returns null if unset so callers can fail closed rather
// than silently proceeding without this guarantee.
export function getTestSandboxEmail(): string | null {
  const raw = process.env.LUXOSA_TEST_SANDBOX_EMAIL;
  return raw ? normalizeEmail(raw) : null;
}

function getToken(): string {
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  if (!token) throw new Error('GHL_PRIVATE_INTEGRATION_TOKEN is not set');
  return token;
}

function getLocationId(): string {
  const locationId = process.env.GHL_LOCATION_ID;
  if (!locationId) throw new Error('GHL_LOCATION_ID is not set');
  return locationId;
}

// Hard safety gate — the single choke point every write method calls
// through. Never bypassable by a value coming from the browser.
function assertSandboxWriteAllowed(contactId: string) {
  if (isTestMode() && contactId !== SANDBOX_CONTACT_ID) {
    throw new Error(
      `TEST MODE refuses write to contact "${contactId}" — only ${SANDBOX_CONTACT_ID} is authorized.`,
    );
  }
}

async function ghlFetch(
  path: string,
  init: { method?: string; version?: string; body?: unknown; headers?: Record<string, string> } = {},
): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Version: init.version ?? CONTACTS_API_VERSION,
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // leave as raw text — caller decides what to do with a non-JSON body
  }
  return { status: res.status, body };
}

export interface GhlContact {
  id: string;
  locationId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  customFields?: { id: string; value: unknown }[];
}

export async function getContact(contactId: string): Promise<GhlContact | null> {
  const { status, body } = await ghlFetch(`/contacts/${contactId}`);
  if (status === 404) return null;
  if (status !== 200) {
    throw new Error(`GHL getContact failed: ${status}`);
  }
  return (body as { contact: GhlContact }).contact;
}

export async function searchContactsByQuery(query: string): Promise<GhlContact[]> {
  const locationId = getLocationId();
  const { status, body } = await ghlFetch(
    `/contacts/?locationId=${encodeURIComponent(locationId)}&query=${encodeURIComponent(query)}`,
  );
  if (status !== 200) {
    throw new Error(`GHL searchContactsByQuery failed: ${status}`);
  }
  return (body as { contacts: GhlContact[] }).contacts ?? [];
}

export interface ContactUpdatePatch {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  customFields?: { id: string; value: unknown }[];
}

export async function updateContact(contactId: string, patch: ContactUpdatePatch): Promise<GhlContact> {
  assertSandboxWriteAllowed(contactId);
  const { status, body } = await ghlFetch(`/contacts/${contactId}`, { method: 'PUT', body: patch });
  if (status !== 200) {
    throw new Error(`GHL updateContact failed: ${status} ${JSON.stringify(body).slice(0, 300)}`);
  }
  return (body as { contact: GhlContact }).contact;
}

export interface CreateContactInput {
  locationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export async function createContact(input: CreateContactInput): Promise<GhlContact> {
  // Candidate-create is a write too — same sandbox guard applies. In
  // practice this path is only reachable when identity reconciliation finds
  // no existing contact, which in TEST MODE should not happen against the
  // seeded sandbox contact, but the guard stays unconditional regardless.
  if (isTestMode()) {
    throw new Error('TEST MODE refuses contact creation — identity reconciliation must resolve to the sandbox contact.');
  }
  const { status, body } = await ghlFetch('/contacts/', { method: 'POST', body: input });
  if (status !== 200 && status !== 201) {
    throw new Error(`GHL createContact failed: ${status} ${JSON.stringify(body).slice(0, 300)}`);
  }
  return (body as { contact: GhlContact }).contact;
}

export async function uploadDocument(
  contactId: string,
  fileName: string,
  fileBuffer: Buffer,
  mimeType: string,
): Promise<{ status: number; body: unknown }> {
  assertSandboxWriteAllowed(contactId);
  const locationId = getLocationId();
  const form = new FormData();
  form.append(FIELD_DOCUMENTI, new Blob([new Uint8Array(fileBuffer)], { type: mimeType }), fileName);

  const url = `${BASE_URL}/forms/upload-custom-files?contactId=${encodeURIComponent(contactId)}&locationId=${encodeURIComponent(locationId)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Version: UPLOAD_API_VERSION,
      Accept: 'application/json',
    },
    body: form,
  });
  const text = await res.text();
  let body: unknown = text;
  try { body = text ? JSON.parse(text) : null; } catch { /* keep raw text */ }
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`GHL uploadDocument failed: ${res.status} ${JSON.stringify(body).slice(0, 300)}`);
  }
  return { status: res.status, body };
}

export async function getContactNotes(contactId: string): Promise<unknown[]> {
  const { status, body } = await ghlFetch(`/contacts/${contactId}/notes`);
  if (status !== 200) {
    throw new Error(`GHL getContactNotes failed: ${status}`);
  }
  return (body as { notes: unknown[] }).notes ?? [];
}

export async function createContactNote(contactId: string, body: string): Promise<{ status: number; body: unknown }> {
  assertSandboxWriteAllowed(contactId);
  const result = await ghlFetch(`/contacts/${contactId}/notes`, { method: 'POST', body: { body } });
  if (result.status !== 200 && result.status !== 201) {
    throw new Error(`GHL createContactNote failed: ${result.status} ${JSON.stringify(result.body).slice(0, 300)}`);
  }
  return result;
}

export class GhlScopeBlockedError extends Error {
  missingScope: string;
  endpoint: string;

  constructor(missingScope: string, endpoint: string) {
    super(`GHL scope missing: "${missingScope}" is required to call ${endpoint}`);
    this.name = 'GhlScopeBlockedError';
    this.missingScope = missingScope;
    this.endpoint = endpoint;
  }
}

// Thrown when the send request itself times out / the connection is
// aborted — GHL may or may not have already processed it. Never retried
// automatically by the caller (see submission.ts: EMAIL_UNKNOWN).
export class EmailSendTimeoutError extends Error {
  constructor() {
    super('GHL message send timed out — delivery status unknown, no automatic resend');
    this.name = 'EmailSendTimeoutError';
  }
}

const SEND_EMAIL_TIMEOUT_MS = 15_000;
// Shape confirmed empirically against the real endpoint (2026-10-10):
// POST /conversations/messages, Version 2021-04-15. Validation progression
// observed: missing contactId -> 404 CONVERSATIONS_MSG_CONTACT_ID_NOT_PROVIDED;
// contactId + type only -> 422 CONVERSATIONS_MSG_NO_CONTENT ("no message or
// attachments"); invalid type -> 422 "type must be a valid enum value"
// (confirming "Email" itself is accepted). conversations/search (a read
// endpoint) still returns 401 after the scope change — that scope is
// unrelated to sending and was never requested; the write path above is
// the one that matters here and is now authorized.
export interface SendEmailInput {
  contactId: string;
  subject: string;
  html: string;
  attachmentUrls?: string[];
}

export interface SendEmailResult {
  status: number;
  body: unknown;
  messageId: string | null;
}

function extractMessageId(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const maybe = body as Record<string, unknown>;
  const direct = maybe.messageId ?? maybe.id;
  if (typeof direct === 'string') return direct;
  const nested = (maybe.message as Record<string, unknown> | undefined)?.id;
  return typeof nested === 'string' ? nested : null;
}

export async function sendDossierEmail(input: SendEmailInput): Promise<SendEmailResult> {
  assertSandboxWriteAllowed(input.contactId);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SEND_EMAIL_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/conversations/messages`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Version: '2021-04-15',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'Email',
        contactId: input.contactId,
        subject: input.subject,
        html: input.html,
        ...(input.attachmentUrls?.length ? { attachments: input.attachmentUrls } : {}),
      }),
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new EmailSendTimeoutError();
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  const text = await res.text();
  let body: unknown = text;
  try { body = text ? JSON.parse(text) : null; } catch { /* keep raw text */ }

  if (res.status === 401) {
    throw new GhlScopeBlockedError('conversations/message.write (or equivalent)', 'POST /conversations/messages');
  }
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`GHL sendDossierEmail failed: ${res.status} ${JSON.stringify(body).slice(0, 300)}`);
  }

  return { status: res.status, body, messageId: extractMessageId(body) };
}
