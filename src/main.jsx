/**
 * Copyright (c) 2024-present mrofisr
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { InvitationProvider } from './context/InvitationContext'
import {
  LoginPage,
  DashboardPage,
  InvitationsPage,
  InvitationForm
} from './pages/admin'

function InvitationApp() {
  return (
    <InvitationProvider>
      <App />
    </InvitationProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/invitations" element={<InvitationsPage />} />
        <Route path="/admin/invitations/new" element={<InvitationForm />} />
        <Route path="/admin/invitations/:uid" element={<InvitationForm />} />

        {/* Invitation Routes */}
        <Route path="/*" element={<InvitationApp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
