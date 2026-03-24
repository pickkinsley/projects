import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import AthletesPage from '@/pages/AthletesPage'
import SchedulePage from '@/pages/SchedulePage'
import ResultsPage from '@/pages/ResultsPage'
import LoginPage from '@/pages/LoginPage'
import AdminPage from '@/pages/AdminPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="athletes" element={<AthletesPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
