import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Loading from './components/Loading'
import { SchoolProvider } from './contexts/SchoolContext'
import { PermissionsProvider } from './contexts/PermissionsContext'
import { Layout } from './components/Layout'
import { setupAxiosInterceptors } from './lib/axiosInterceptor'
import { getTenantFromSubdomain } from './lib/tenant'
import { routes } from './lib/routes'

// Componentes críticos - carregar imediatamente (autenticação)
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'

// Lazy loading - componentes carregados sob demanda
// Autenticação e cadastro
const OtpVerification = lazy(() => import('./pages/OtpVerification'))
const EmailVerification = lazy(() => import('./pages/EmailVerification'))
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'))
const SelectSchool = lazy(() => import('./pages/SelectSchool'))
const PendingApproval = lazy(() => import('./pages/PendingApproval'))

// Dashboards
const DashboardVisaoGeral = lazy(() => import('./pages/dashboards').then(m => ({ default: m.DashboardVisaoGeral })))
const DashboardFinanceiro = lazy(() => import('./pages/dashboards').then(m => ({ default: m.DashboardFinanceiro })))
const DashboardAcademico = lazy(() => import('./pages/dashboards').then(m => ({ default: m.DashboardAcademico })))

// Escola
const SchoolDetails = lazy(() => import('./pages/SchoolDetails'))
const CreateSchool = lazy(() => import('./pages/CreateSchool'))
const OwnerSettings = lazy(() => import('./pages/OwnerSettings'))
const Documentos = lazy(() => import('./pages/Documentos'))

// IA
const AssistenteIA = lazy(() => import('./pages/ia/AssistenteIA'))
const RelatorioInteligente = lazy(() => import('./pages/ia/RelatorioInteligente'))
const CriarAgenteIA = lazy(() => import('./pages/ia/CriarAgenteIA'))
const VerAgentes = lazy(() => import('./pages/ia/VerAgentes'))
const MeusAgentes = lazy(() => import('./pages/ia/MeusAgentes'))

// Administração
const Matricula = lazy(() => import('./pages/administracao/Matricula'))
const Rematricula = lazy(() => import('./pages/administracao/Rematricula'))
const Equipe = lazy(() => import('./pages/administracao/Equipe'))
const Permissoes = lazy(() => import('./pages/administracao/Permissoes'))

// Acadêmico
const Turmas = lazy(() => import('./pages/academico/Turmas'))
const Alunos = lazy(() => import('./pages/academico/Alunos'))
const Matriculas = lazy(() => import('./pages/academico/Matriculas'))

// Calendário
const Calendario = lazy(() => import('./pages/calendario/Calendario'))
const NovoEvento = lazy(() => import('./pages/calendario/NovoEvento'))

// Sites
const MeusSites = lazy(() => import('./pages/sites/MeusSites'))
const CriarSite = lazy(() => import('./pages/sites/CriarSite'))

// Componente wrapper para Suspense
function LazyRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

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
      <Route path="/verificar-otp" element={<LazyRoute><OtpVerification /></LazyRoute>} />
      <Route
        path="/verificar-email"
        element={
          <ProtectedRoute>
            <LazyRoute><EmailVerification /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/completar-cadastro"
        element={
          <ProtectedRoute>
            <LazyRoute><CompleteProfile /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/selecionar-escola"
        element={
          <ProtectedRoute>
            <LazyRoute><SelectSchool /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/aguardando-aprovacao"
        element={
          <ProtectedRoute>
            <LazyRoute><PendingApproval /></LazyRoute>
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
                <LazyRoute><DashboardVisaoGeral /></LazyRoute>
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
                <LazyRoute><DashboardFinanceiro /></LazyRoute>
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
                <LazyRoute><DashboardAcademico /></LazyRoute>
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
                <LazyRoute><SchoolDetails /></LazyRoute>
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
                <LazyRoute><CreateSchool /></LazyRoute>
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
                <LazyRoute><OwnerSettings /></LazyRoute>
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
                <LazyRoute><AssistenteIA /></LazyRoute>
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
                <LazyRoute><RelatorioInteligente /></LazyRoute>
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
                <LazyRoute><CriarAgenteIA /></LazyRoute>
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
                <LazyRoute><VerAgentes /></LazyRoute>
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
                <LazyRoute><MeusAgentes /></LazyRoute>
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
                <LazyRoute><Matricula /></LazyRoute>
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
                <LazyRoute><Rematricula /></LazyRoute>
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
                <LazyRoute><Equipe /></LazyRoute>
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
                <LazyRoute><Permissoes /></LazyRoute>
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
                <LazyRoute><Turmas /></LazyRoute>
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
                <LazyRoute><Alunos /></LazyRoute>
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
                <LazyRoute><Matriculas /></LazyRoute>
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
                <LazyRoute><Calendario /></LazyRoute>
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
                <LazyRoute><NovoEvento /></LazyRoute>
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
                <LazyRoute><MeusSites /></LazyRoute>
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
                <LazyRoute><CriarSite /></LazyRoute>
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
                <LazyRoute><Documentos /></LazyRoute>
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
