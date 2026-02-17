// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0
import { AppShell, ErrorBoundary, Loading, Logo, useMedplum, useMedplumProfile } from '@medplum/react';
import { IconNotes } from '@tabler/icons-react';
import { Suspense } from 'react';
import type { JSX } from 'react';
import { Route, Routes } from 'react-router';
import { EncounterPage } from './pages/EncounterPage';
import { NoteIntakePage } from './pages/NoteIntakePage';
import { SearchPage } from './pages/SearchPage';
import { SignInPage } from './pages/SignInPage';

export function App(): JSX.Element | null {
  const medplum = useMedplum();
  const profile = useMedplumProfile();

  if (medplum.isLoading()) {
    return null;
  }

  return (
    <AppShell
      logo={<Logo size={24} />}
      menus={[
        {
          title: 'Pipeline',
          links: [{ icon: <IconNotes />, label: 'Doctor Note Intake', href: '/' }],
        },
      ]}
    >
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={profile ? <NoteIntakePage /> : <SignInPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/Encounter/:id">
              <Route index element={<EncounterPage />} />
              <Route path="*" element={<EncounterPage />} />
            </Route>
            <Route path="/Encounter" element={<SearchPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
