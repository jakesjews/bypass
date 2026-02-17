// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { ContentType } from '@medplum/core';
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const bots = [
  {
    src: 'src/bots/core/general-encounter-note.ts',
    dist: 'dist/bots/core/general-encounter-note.js',
    criteria: 'QuestionnaireResponse?questionnaire=$encounter-note',
  },
];

async function main() {
  const bundle = {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: bots.flatMap((botDescription) => {
      const botName = path.parse(botDescription.src).name;
      const botUrlPlaceholder = `$bot-${botName}-reference`;
      const botIdPlaceholder = `$bot-${botName}-id`;
      const results = [];
      const { srcEntry, distEntry } = readBotFiles(botDescription);
      results.push(srcEntry, distEntry);

      results.push({
        request: { method: 'PUT', url: botUrlPlaceholder },
        resource: {
          resourceType: 'Bot',
          id: botIdPlaceholder,
          name: botName,
          runtimeVersion: 'awslambda',
          sourceCode: {
            contentType: ContentType.TYPESCRIPT,
            url: srcEntry.fullUrl,
          },
          executableCode: {
            contentType: ContentType.JAVASCRIPT,
            url: distEntry.fullUrl,
          },
        },
      });

      if (botDescription.criteria) {
        results.push({
          request: {
            url: 'Subscription',
            method: 'POST',
            ifNoneExist: `url=${botUrlPlaceholder}`,
          },
          resource: {
            resourceType: 'Subscription',
            status: 'active',
            reason: botName,
            channel: { endpoint: botUrlPlaceholder, type: 'rest-hook' },
            criteria: botDescription.criteria,
          },
        });
      }

      return results;
    }),
  };

  writeFileSync('data/core/example-bots.json', JSON.stringify(bundle, null, 2));
}

function readBotFiles(description) {
  const sourceFile = readFileSync(description.src);
  const distFile = readFileSync(description.dist);

  const srcEntry = {
    fullUrl: 'urn:uuid:' + randomUUID(),
    request: { method: 'POST', url: 'Binary' },
    resource: {
      resourceType: 'Binary',
      contentType: ContentType.TYPESCRIPT,
      data: sourceFile.toString('base64'),
    },
  };
  const distEntry = {
    fullUrl: 'urn:uuid:' + randomUUID(),
    request: { method: 'POST', url: 'Binary' },
    resource: {
      resourceType: 'Binary',
      contentType: ContentType.JAVASCRIPT,
      data: distFile.toString('base64'),
    },
  };

  return { srcEntry, distEntry };
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
