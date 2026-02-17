// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { getQuestionnaireAnswers } from '@medplum/core';
import type { Patient, Practitioner, Reference } from '@medplum/fhirtypes';
import { describe, expect, test } from 'vitest';
import {
  buildPipelineEncounter,
  buildPipelineQuestionnaireResponse,
  PIPELINE_REASON_FOR_VISIT,
} from './note-pipeline-utils';

describe('note-pipeline-utils', () => {
  test('buildPipelineEncounter creates an ambulatory in-progress encounter', () => {
    const patient: Reference<Patient> = { reference: 'Patient/p-1' };
    const practitioner: Reference<Practitioner> = { reference: 'Practitioner/pr-1' };
    const authored = '2026-02-17T18:00:00.000Z';

    const encounter = buildPipelineEncounter(patient, authored, practitioner);

    expect(encounter.resourceType).toBe('Encounter');
    expect(encounter.status).toBe('in-progress');
    expect(encounter.class?.code).toBe('AMB');
    expect(encounter.subject).toEqual(patient);
    expect(encounter.period?.start).toBe(authored);
    expect(encounter.participant).toEqual([{ individual: practitioner }]);
  });

  test('buildPipelineQuestionnaireResponse creates required bot answers', () => {
    const authored = '2026-02-17T18:05:00.000Z';
    const response = buildPipelineQuestionnaireResponse({
      noteText: 'Patient reports hot flashes and poor sleep.',
      authored,
      encounter: { reference: 'Encounter/e-1' },
      patient: { reference: 'Patient/p-1' },
      questionnaireReference: 'Questionnaire/encounter-note-id',
    });

    expect(response.resourceType).toBe('QuestionnaireResponse');
    expect(response.status).toBe('completed');
    expect(response.questionnaire).toBe('Questionnaire/encounter-note-id');
    expect(response.encounter?.reference).toBe('Encounter/e-1');
    expect(response.subject?.reference).toBe('Patient/p-1');
    expect(response.authored).toBe(authored);

    const answers = getQuestionnaireAnswers(response);
    expect(answers['reason-for-visit'].valueCoding).toEqual(PIPELINE_REASON_FOR_VISIT);
    expect(answers['problem-list'].valueBoolean).toBe(false);
    expect(answers['assessment'].valueString).toBe('Patient reports hot flashes and poor sleep.');
  });

  test('buildPipelineQuestionnaireResponse rejects empty notes', () => {
    expect(() =>
      buildPipelineQuestionnaireResponse({
        noteText: '   ',
        authored: '2026-02-17T18:05:00.000Z',
        encounter: { reference: 'Encounter/e-1' },
        patient: { reference: 'Patient/p-1' },
        questionnaireReference: 'Questionnaire/encounter-note-id',
      }),
    ).toThrow('Note text is required');
  });
});
