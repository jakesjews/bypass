// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { Alert, Anchor, Button, Code, Paper, Stack, Text, Textarea, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import type { MedplumClient } from '@medplum/core';
import { normalizeErrorString } from '@medplum/core';
import type { Encounter, Patient, Questionnaire, Reference } from '@medplum/fhirtypes';
import { useMedplum } from '@medplum/react';
import { IconCircleCheck, IconCircleOff, IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import type { JSX } from 'react';
import {
  buildPipelineEncounter,
  buildPipelineQuestionnaireResponse,
  PIPELINE_PATIENT_IDENTIFIER_SYSTEM,
  PIPELINE_PATIENT_IDENTIFIER_VALUE,
} from './note-pipeline-utils';

interface SubmissionResult {
  encounterId: string;
  questionnaireResponseId: string;
}

export function NoteIntakePage(): JSX.Element {
  const medplum = useMedplum();
  const [noteText, setNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionResult | undefined>();

  async function handleSubmit(): Promise<void> {
    const trimmedNoteText = noteText.trim();
    if (!trimmedNoteText || submitting) {
      return;
    }

    setSubmitting(true);
    try {
      const authored = new Date().toISOString();
      const patient = await ensurePipelinePatient(medplum);
      if (!patient.id) {
        throw new Error('Unable to resolve pipeline patient ID');
      }

      const encounter = await medplum.createResource(
        buildPipelineEncounter({ reference: `Patient/${patient.id}` }, authored),
      );
      if (!encounter.id) {
        throw new Error('Unable to create encounter');
      }

      const questionnaire = await requireEncounterNoteQuestionnaire(medplum);
      const questionnaireReference = questionnaire.url ?? `Questionnaire/${questionnaire.id}`;
      const encounterReference: Reference<Encounter> = { reference: `Encounter/${encounter.id}` };
      const patientReference: Reference<Patient> = { reference: `Patient/${patient.id}` };

      const questionnaireResponse = buildPipelineQuestionnaireResponse({
        noteText: trimmedNoteText,
        authored,
        encounter: encounterReference,
        patient: patientReference,
        questionnaireReference,
      });

      const createdResponse = await medplum.createResource(questionnaireResponse);
      if (!createdResponse.id) {
        throw new Error('Unable to create questionnaire response');
      }

      setSubmission({
        encounterId: encounter.id,
        questionnaireResponseId: createdResponse.id,
      });
      setNoteText('');
      showNotification({
        icon: <IconCircleCheck />,
        title: 'Submitted',
        message: 'Doctor note submitted to the pipeline.',
      });
    } catch (err) {
      showNotification({
        color: 'red',
        icon: <IconCircleOff />,
        title: 'Submission failed',
        message: normalizeErrorString(err),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Paper shadow="xs" m="md" p="lg">
      <Stack>
        <Title order={2}>Doctor Note Intake</Title>
        <Text size="sm">
          Paste raw transcript text or typed doctor notes, then submit. The app creates encounter context automatically
          and sends the note into the Medplum pipeline.
        </Text>
        <Textarea
          label="Doctor note"
          placeholder="Example: 56-year-old female with worsening hot flashes and sleep disruption..."
          minRows={12}
          autosize={true}
          value={noteText}
          onChange={(event) => setNoteText(event.currentTarget.value)}
        />
        <Button onClick={() => handleSubmit().catch(console.error)} loading={submitting} disabled={!noteText.trim()}>
          Submit for pipeline processing
        </Button>
        <Alert icon={<IconInfoCircle size={16} />} color="blue">
          Uses synthetic demo patient context in local/test only:
          <br />
          <Code>{PIPELINE_PATIENT_IDENTIFIER_SYSTEM}</Code>
          <br />
          <Code>{PIPELINE_PATIENT_IDENTIFIER_VALUE}</Code>
        </Alert>
        {submission && (
          <Alert icon={<IconCircleCheck size={16} />} color="green">
            <Text size="sm">
              Created <Code>QuestionnaireResponse/{submission.questionnaireResponseId}</Code> and queued processing for{' '}
              <Code>Encounter/{submission.encounterId}</Code>.
            </Text>
            <Anchor href={`/Encounter/${submission.encounterId}`} target="_blank" rel="noreferrer">
              Open encounter details
            </Anchor>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}

async function ensurePipelinePatient(medplum: MedplumClient): Promise<Patient> {
  const existingPatient = await medplum.searchOne('Patient', {
    identifier: `${PIPELINE_PATIENT_IDENTIFIER_SYSTEM}|${PIPELINE_PATIENT_IDENTIFIER_VALUE}`,
  });
  if (existingPatient) {
    return existingPatient;
  }

  return medplum.createResource<Patient>({
    resourceType: 'Patient',
    identifier: [
      {
        system: PIPELINE_PATIENT_IDENTIFIER_SYSTEM,
        value: PIPELINE_PATIENT_IDENTIFIER_VALUE,
      },
    ],
    name: [
      {
        family: 'Pipeline',
        given: ['Demo', 'Patient'],
      },
    ],
    gender: 'unknown',
  });
}

async function requireEncounterNoteQuestionnaire(medplum: MedplumClient): Promise<Questionnaire> {
  const questionnaire = await medplum.searchOne('Questionnaire', { name: 'encounter-note' });
  if (!questionnaire?.id) {
    throw new Error('Encounter note questionnaire was not found. Load core data and bots first.');
  }

  return questionnaire;
}
