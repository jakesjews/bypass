// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import type { Coding, Encounter, Patient, Practitioner, QuestionnaireResponse, Reference } from '@medplum/fhirtypes';

export const PIPELINE_PATIENT_IDENTIFIER_SYSTEM = 'https://bypass.dev/pipeline-patient';
export const PIPELINE_PATIENT_IDENTIFIER_VALUE = 'doctor-note-intake';

export const PIPELINE_REASON_FOR_VISIT: Coding = {
  system: 'http://hl7.org/fhir/sid/icd-10',
  code: 'Z00.00',
  display: 'Encounter for general adult medical examination without abnormal findings',
};

interface BuildPipelineQuestionnaireResponseOptions {
  noteText: string;
  encounter: Reference<Encounter>;
  patient: Reference<Patient>;
  questionnaireReference: string;
  authored: string;
}

export function buildPipelineEncounter(
  patient: Reference<Patient>,
  startDateTime: string,
  practitioner?: Reference<Practitioner>,
): Encounter {
  return {
    resourceType: 'Encounter',
    status: 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory',
    },
    subject: patient,
    period: {
      start: startDateTime,
    },
    participant: practitioner
      ? [
          {
            individual: practitioner,
          },
        ]
      : undefined,
  };
}

export function buildPipelineQuestionnaireResponse(
  options: BuildPipelineQuestionnaireResponseOptions,
): QuestionnaireResponse {
  const noteText = options.noteText.trim();
  if (!noteText) {
    throw new Error('Note text is required');
  }

  return {
    resourceType: 'QuestionnaireResponse',
    status: 'completed',
    questionnaire: options.questionnaireReference,
    encounter: options.encounter,
    subject: options.patient,
    authored: options.authored,
    item: [
      {
        linkId: 'date',
        answer: [{ valueDateTime: options.authored }],
      },
      {
        linkId: 'reason-for-visit',
        answer: [{ valueCoding: PIPELINE_REASON_FOR_VISIT }],
      },
      {
        linkId: 'problem-list',
        answer: [{ valueBoolean: false }],
      },
      {
        linkId: 'assessment',
        answer: [{ valueString: noteText }],
      },
    ],
  };
}
