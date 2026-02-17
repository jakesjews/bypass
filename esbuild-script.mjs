// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import esbuild from 'esbuild';
import { globSync } from 'node:fs';

// Build bot handlers only; app sources are bundled by Vite.
const entryPoints = globSync('src/bots/**/*.ts', { exclude: ['**/*.test.ts'] }).sort();

// Define the esbuild options
const esbuildOptions = {
  entryPoints: entryPoints,
  bundle: true,
  outdir: './dist',
  outbase: 'src',
  platform: 'node',
  loader: {
    '.ts': 'ts',
  },
  resolveExtensions: ['.ts'],
  external: ['@medplum/core', '@medplum/fhirtypes'],
  format: 'cjs',
  target: 'node25',
  tsconfig: 'tsconfig-bots.json',
  footer: { js: 'Object.assign(exports, module.exports);' }, // Required for VM Context Bots.
};

// Build using esbuild
esbuild
  .build(esbuildOptions)
  .then(() => {
    console.log('Build completed successfully!');
  })
  .catch((error) => {
    console.error('Build failed:', JSON.stringify(error, null, 2));
    process.exit(1);
  });
