import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createContact } from '../ghlClient.js';

test('createContact always sends the locationId from GHL_LOCATION_ID, never a hardcoded one', async () => {
  const saved = {
    mode: process.env.LUXOSA_TEST_MODE,
    loc: process.env.GHL_LOCATION_ID,
    token: process.env.GHL_PRIVATE_INTEGRATION_TOKEN,
    fetch: globalThis.fetch,
  };
  process.env.LUXOSA_TEST_MODE = 'production';
  process.env.GHL_LOCATION_ID = 'loc_from_config_123';
  process.env.GHL_PRIVATE_INTEGRATION_TOKEN = 'token_not_real';

  let sentBody: Record<string, unknown> | null = null;
  globalThis.fetch = (async (_url: unknown, init?: { body?: string }) => {
    sentBody = JSON.parse(init?.body ?? '{}');
    return new Response(JSON.stringify({ contact: { id: 'c1', locationId: 'loc_from_config_123' } }), { status: 201 });
  }) as typeof fetch;

  try {
    await createContact({ firstName: 'Maria', lastName: 'Rossi', email: 'maria@example.com', phone: '+393501234567' });
    assert.equal(sentBody!.locationId, 'loc_from_config_123');
  } finally {
    globalThis.fetch = saved.fetch;
    for (const [key, value] of [['LUXOSA_TEST_MODE', saved.mode], ['GHL_LOCATION_ID', saved.loc], ['GHL_PRIVATE_INTEGRATION_TOKEN', saved.token]] as const) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
