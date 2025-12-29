import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import { DashboardVisaoGeral, DashboardFinanceiro, DashboardAcademico } from './pages/dashboards'
import SelectSchool from './pages/SelectSchool'
import PendingApproval from './pages/PendingApproval'
import EmailVerification from './pages/EmailVerification'
import OtpVerification from './pages/OtpVerification'
import CompleteProfile from './pages/CompleteProfile'
import SchoolDetails from './pages/SchoolDetails'
import CreateSchool from './pages/CreateSchool'
import OwnerSettings from './pages/OwnerSettings'
import AuthCallback from './pages/AuthCallback'
import Documentos from './pages/Documentos'
// IA
import AssistenteIA from './pages/ia/AssistenteIA'
import RelatorioInteligente from './pages/ia/RelatorioInteligente'
import CriarAgenteIA from './pages/ia/CriarAgenteIA'
import VerAgentes from './pages/ia/VerAgentes'
import MeusAgentes from './pages/ia/MeusAgentes'
// Administração
import Matricula from './pages/administracao/Matricula'
import Rematricula from './pages/administracao/Rematricula'
import Equipe from './pages/administracao/Equipe'
import Permissoes from './pages/administracao/Permissoes'
// Acadêmico
import Turmas from './pages/academico/Turmas'
import Alunos from './pages/academico/Alunos'
import Matriculas from './pages/academico/Matriculas'
// Calendário
import Calendario from './pages/calendario/Calendario'
import NovoEvento from './pages/calendario/NovoEvento'
// Sites
import MeusSites from './pages/sites/MeusSites'
import CriarSite from './pages/sites/CriarSite'
import Loading from './components/Loading'
import { SchoolProvider } from './contexts/SchoolContext'
import { PermissionsProvider } from './contexts/PermissionsContext'
import { Layout } from './components/Layout'
import { setupAxiosInterceptors } from './lib/axiosInterceptor'
import { getTenantFromSubdomain } from './lib/tenant'
import { routes } from './lib/routes'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to={routes.login()} replace />
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
      <Route path="/register" element={<Navigate to={routes.login()} replace />} />
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
        element={<Navigate to={routes.selectSchool()} replace />}
      />
      <Route
        path="/escola/:slug/painel"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <DashboardVisaoGeral />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/painel/financeiro"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <DashboardFinanceiro />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/painel/academico"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <DashboardAcademico />
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
        path="/escola/:slug/configuracoes"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <OwnerSettings />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      {/* Rotas EducaIA */}
      <Route
        path="/escola/:slug/ia/assistente"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <AssistenteIA />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/ia/relatorio"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <RelatorioInteligente />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/ia/criar"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <CriarAgenteIA />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/ia/agentes"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <VerAgentes />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/ia/meus-agentes"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <MeusAgentes />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      {/* Rotas Administração */}
      <Route
        path="/escola/:slug/matricula"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <Matricula />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/rematricula"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <Rematricula />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/usuarios"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <Equipe />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/permissoes"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <Permissoes />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      {/* Rotas Acadêmico */}
      <Route
        path="/escola/:slug/turmas"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <Turmas />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/alunos"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <Alunos />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/matriculas"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <Matriculas />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      {/* Rotas Calendário */}
      <Route
        path="/escola/:slug/calendario"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <Calendario />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/calendario/novo"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <NovoEvento />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      {/* Rotas Criador de Sites */}
      <Route
        path="/escola/:slug/sites"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <MeusSites />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escola/:slug/sites/novo"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <CriarSite />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      {/* Rota Documentos */}
      <Route
        path="/escola/:slug/documentos"
        element={
          <ProtectedRoute>
            <SchoolProvider>
              <Layout>
                <Documentos />
              </Layout>
            </SchoolProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={<Navigate to={routes.selectSchool()} replace />}
      />
      <Route path="/" element={<Navigate to={routes.selectSchool()} replace />} />
    </Routes>
    </PermissionsProvider>
  )
}

export default App
