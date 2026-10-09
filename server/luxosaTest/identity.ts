// Identity reconciliation — read-only resolution of which GHL Contact a
// submission belongs to, before any write happens. No automatic merge: a
// genuine conflict (email and phone resolve to two different Contacts)
// stops the pipeline and is surfaced to the caller, never guessed at.
//
// GHL's GET /contacts/ does NOT accept dedicated email=/phone= params
// (confirmed empirically: 422 "property email should not exist") — the
// only working lookup is the generic query= full-text param, confirmed to
// return an empty array (no false positives) for a non-existent email or
// phone. Two separate calls (one per identifier) still satisfy "cerca
// separatamente" even though they share the same underlying query param.

import { searchContactsByQuery, type GhlContact } from './ghlClient';
import { normalizePhoneToE164 } from './phone';

export type IdentityResolution =
  | { kind: 'no_match' }
  | { kind: 'single_match'; contactId: string; matchedBy: ('email' | 'phone')[] }
  | { kind: 'conflict'; emailContactId: string; phoneContactId: string }
  | { kind: 'ambiguous'; reason: string };

function contactEmailMatches(contact: GhlContact, email: string): boolean {
  return (contact.email ?? '').trim().toLowerCase() === email;
}

function contactPhoneMatches(contact: GhlContact, phoneE164: string): boolean {
  if (!contact.phone) return false;
  const normalized = normalizePhoneToE164(contact.phone);
  return normalized?.e164 === phoneE164;
}

// Pure decision function — no I/O, fully unit-testable without mocking the
// network layer. reconcileIdentity() below is the thin async wrapper that
// fetches from GHL and delegates the actual decision here.
export function decideIdentity(
  byEmailRaw: GhlContact[],
  byPhoneRaw: GhlContact[],
  email: string,
  phoneE164: string,
): IdentityResolution {
  const byEmail = byEmailRaw.filter(c => contactEmailMatches(c, email));
  const byPhone = byPhoneRaw.filter(c => contactPhoneMatches(c, phoneE164));

  if (byEmail.length > 1 || byPhone.length > 1) {
    return {
      kind: 'ambiguous',
      reason: `GHL returned multiple exact matches (email: ${byEmail.length}, phone: ${byPhone.length})`,
    };
  }

  const emailContact = byEmail[0];
  const phoneContact = byPhone[0];

  if (!emailContact && !phoneContact) {
    return { kind: 'no_match' };
  }

  if (emailContact && phoneContact && emailContact.id !== phoneContact.id) {
    return { kind: 'conflict', emailContactId: emailContact.id, phoneContactId: phoneContact.id };
  }

  const matchedBy: ('email' | 'phone')[] = [];
  if (emailContact) matchedBy.push('email');
  if (phoneContact) matchedBy.push('phone');
  const contactId = (emailContact ?? phoneContact)!.id;

  return { kind: 'single_match', contactId, matchedBy };
}

export async function reconcileIdentity(email: string, phoneE164: string): Promise<IdentityResolution> {
  const [byEmailRaw, byPhoneRaw] = await Promise.all([
    searchContactsByQuery(email),
    searchContactsByQuery(phoneE164),
  ]);
  return decideIdentity(byEmailRaw, byPhoneRaw, email, phoneE164);
}
