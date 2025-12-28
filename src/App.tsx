import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SelectSchool from './pages/SelectSchool'
import PendingApproval from './pages/PendingApproval'
import EmailVerification from './pages/EmailVerification'
import OtpVerification from './pages/OtpVerification'
import CompleteProfile from './pages/CompleteProfile'
import SchoolDetails from './pages/SchoolDetails'
import CreateSchool from './pages/CreateSchool'
import AuthCallback from './pages/AuthCallback'
import Loading from './components/Loading'
import { SchoolProvider } from './contexts/SchoolContext'
import { PermissionsProvider } from './contexts/PermissionsContext'
import { Layout } from './components/Layout'
import { setupAxiosInterceptors } from './lib/axiosInterceptor'
import { getTenantFromSubdomain } from './lib/tenant'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  const { loading } = useAuth()

  // Configurar interceptors do axios uma vez
  useEffect(() => {
    setupAxiosInterceptors()
  }, [])

  if (loading) {
    return <Loading />
  }

  // Obter tenant atual
  const tenantId = getTenantFromSubdomain()

  return (
    <PermissionsProvider tenantId={tenantId || undefined}>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/verificar-otp" element={<OtpVerification />} />
      <Route
        path="/verificar-email"
        element={
          <ProtectedRoute>
            <EmailVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/completar-cadastro"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/selecionar-escola"
        element={
          <ProtectedRoute>
            <SelectSchool />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aguardando-aprovacao"
        element={
          <ProtectedRoute>
            <PendingApproval />
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
              <Layout>
                <Dashboard />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/escola-atual"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <SchoolDetails />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/nova-escola"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <CreateSchool />
              </Layout>
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
    </PermissionsProvider>
  )
}

export default App
