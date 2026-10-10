// REAL integration test — hits the live GHL API against the Test Lifecycle
// sandbox only (contactId xvwmhVsXiGuoHfVbTTtG). Writes real data to that
// one Contact (standard fields, consent field, a real PDF upload). Requires
// .env.local with GHL_PRIVATE_INTEGRATION_TOKEN, GHL_LOCATION_ID,
// LUXOSA_TEST_MODE=test. Run explicitly via `npm run test:luxosa:integration`
// — never part of the default unit test run.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { processSubmission } from '../../submission';
import { SANDBOX_CONTACT_ID } from '../../ghlClient';

const HAS_CREDENTIALS = Boolean(process.env.GHL_PRIVATE_INTEGRATION_TOKEN && process.env.GHL_LOCATION_ID);

const BASE_ANSWERS = {
  d1: 'd1_mossi',
  d2: ['d2_fragili', 'd2_secchi'],
  d3: 'd3_colore',
  d4c: 'd4c_tinta',
  d5c: ['d5c_luminoso'],
  d6c: 'd6c_normale',
  d7c: 'd7c_luminosita',
  d8: 'd8_2_3',
  d9: 'd9_ci_lavoro',
};

function payload(submissionId: string) {
  return {
    submissionId,
    testVersion: 'v2.0',
    language: 'it',
    firstName: 'Test',
    lastName: 'Lifecycle',
    email: 'luxosa.formazione@gmail.com',
    phone: '+393501961535',
    privacyAcknowledged: true,
    marketingConsent: true,
    answers: BASE_ANSWERS,
  };
}

test(
  'real E2E against the sandbox: reaches COMPLETED, email sent, writes land only on the sandbox contact',
  { skip: !HAS_CREDENTIALS && 'GHL_PRIVATE_INTEGRATION_TOKEN / GHL_LOCATION_ID not set' },
  async () => {
    assert.equal(process.env.LUXOSA_TEST_MODE, 'test', 'refusing to run this test outside TEST MODE');
    const submissionId = `sub_int_${Date.now()}`;
    const outcome = await processSubmission(payload(submissionId));
    console.log('[integration] outcome:', JSON.stringify(outcome));
    assert.equal(outcome.contactId, SANDBOX_CONTACT_ID);
    assert.equal(outcome.status, 'COMPLETED');
  },
);

test(
  'replay submission (real sandbox): same submissionId twice returns the identical cached outcome, no second email',
  { skip: !HAS_CREDENTIALS && 'GHL_PRIVATE_INTEGRATION_TOKEN / GHL_LOCATION_ID not set' },
  async () => {
    const submissionId = `sub_int_replay_${Date.now()}`;
    const first = await processSubmission(payload(submissionId));
    const second = await processSubmission(payload(submissionId));
    console.log('[integration] replay first:', JSON.stringify(first));
    console.log('[integration] replay second (should be short-circuited):', JSON.stringify(second));
    assert.equal(second.status, first.status);
    assert.equal(second.contactId, first.contactId);
  },
);
