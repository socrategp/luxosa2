// E.164 phone normalization — server-side authority for identity
// reconciliation and GHL writes. Reuses libphonenumber-js, already a
// transitive dependency of react-phone-number-input (promoted to a direct
// dependency in package.json rather than duplicating phone-parsing logic).
//
// Default country IT: a bare national number like "350 196 1535" (no +39,
// as users on the Italian gate commonly type) is assumed Italian, matching
// the gate's PhoneInput defaultCountry="IT".

import { parsePhoneNumberFromString } from 'libphonenumber-js';

export interface NormalizedPhone {
  e164: string;
  country: string | undefined;
}

export function normalizePhoneToE164(raw: string): NormalizedPhone | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parsed = parsePhoneNumberFromString(trimmed, 'IT');
  if (!parsed || !parsed.isValid()) return null;

  return { e164: parsed.number, country: parsed.country };
}
