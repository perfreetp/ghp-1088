import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Application from '@/pages/Application'
import Verification from '@/pages/Verification'
import Scoring from '@/pages/Scoring'
import Review from '@/pages/Review'
import PostLoan from '@/pages/PostLoan'
import Reports from '@/pages/Reports'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/application" element={<Application />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/scoring" element={<Scoring />} />
          <Route path="/review" element={<Review />} />
          <Route path="/post-loan" element={<PostLoan />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
