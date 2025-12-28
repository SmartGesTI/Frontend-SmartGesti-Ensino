import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SelectSchool from './pages/SelectSchool'
import Loading from './components/Loading'
import { SchoolProvider } from './contexts/SchoolContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  const { isLoading } = useAuth0()

  if (isLoading) {
    return <Loading />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/selecionar-escola"
        element={
          <ProtectedRoute>
            <SelectSchool />
          </ProtectedRoute>
        }
      />
      <Route
        path="/select-school"
        element={<Navigate to="/selecionar-escola" replace />}
      />
      <Route
        path="/escola/:slug/painel"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Dashboard />
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={<Navigate to="/select-school" replace />}
      />
      <Route path="/" element={<Navigate to="/selecionar-escola" replace />} />
    </Routes>
  )
}

export default App
