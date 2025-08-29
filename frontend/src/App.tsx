import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import { HomeView } from './features/pages/Home.view'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomeProvider } from './features/Home.context'
import { OnboardingView } from './features/pages/Onboarding.view'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HomeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/onboarding" element={<OnboardingView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </HomeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
