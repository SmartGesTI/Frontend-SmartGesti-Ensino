import { Sparkles, Shield, Lock, Globe, Brain, Zap } from 'lucide-react'
import { EducationIllustration } from './EducationIllustration'

interface SystemInfoSidebarProps {
  variant?: 'system' | 'security'
}

export const SystemInfoSidebar = ({ variant = 'system' }: SystemInfoSidebarProps) => {
  return (
    <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 relative overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-[800px] h-[800px]">
          <EducationIllustration />
        </div>
      </div>
      {/* Conteúdo centralizado verticalmente */}
      <div className="relative z-10 max-w-2xl w-full">
        <div className="flex items-center justify-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="p-3 lg:p-5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Sparkles className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
          </div>
          <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SmartGesti Ensino
          </h1>
        </div>
        
        {variant === 'security' ? (
          <>
            <p className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 mb-3 lg:mb-4 text-center">
              Segurança em Primeiro Lugar
            </p>
            <p className="text-base lg:text-xl xl:text-2xl text-gray-600 mb-8 lg:mb-12 text-center">
              Protegemos seus dados com as melhores práticas de segurança
            </p>
            
            {/* Features de Segurança */}
            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-start gap-3 lg:gap-5">
                <div className="p-3 lg:p-4 rounded-lg bg-green-100 text-green-600 mt-0.5 flex-shrink-0">
                  <Shield className="h-5 w-5 lg:h-7 lg:w-7" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">Criptografia Avançada</h3>
                  <p className="text-sm lg:text-base xl:text-lg text-gray-600">Todos os dados são protegidos com criptografia de ponta a ponta</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 lg:gap-5">
                <div className="p-3 lg:p-4 rounded-lg bg-blue-100 text-blue-600 mt-0.5 flex-shrink-0">
                  <Lock className="h-5 w-5 lg:h-7 lg:w-7" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">Verificação em Duas Etapas</h3>
                  <p className="text-sm lg:text-base xl:text-lg text-gray-600">Confirmação de email obrigatória para garantir a segurança da sua conta</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 lg:gap-5">
                <div className="p-3 lg:p-4 rounded-lg bg-purple-100 text-purple-600 mt-0.5 flex-shrink-0">
                  <Shield className="h-5 w-5 lg:h-7 lg:w-7" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">Conformidade e Privacidade</h3>
                  <p className="text-sm lg:text-base xl:text-lg text-gray-600">Total conformidade com LGPD e proteção de dados pessoais</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-800 mb-3 lg:mb-4 text-center">
              Sistema de Gestão Escolar
            </p>
            <p className="text-base lg:text-xl xl:text-2xl text-gray-600 mb-8 lg:mb-12 text-center">
              AI First - Transformando a educação com inteligência artificial
            </p>
            
            {/* Features do Sistema */}
            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-start gap-3 lg:gap-5">
                <div className="p-3 lg:p-4 rounded-lg bg-blue-100 text-blue-600 mt-0.5 flex-shrink-0">
                  <Brain className="h-5 w-5 lg:h-7 lg:w-7" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">Inteligência Artificial</h3>
                  <p className="text-sm lg:text-base xl:text-lg text-gray-600">Automação inteligente de processos educacionais</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 lg:gap-5">
                <div className="p-3 lg:p-4 rounded-lg bg-purple-100 text-purple-600 mt-0.5 flex-shrink-0">
                  <Zap className="h-5 w-5 lg:h-7 lg:w-7" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">Performance</h3>
                  <p className="text-sm lg:text-base xl:text-lg text-gray-600">Sistema rápido e eficiente para sua instituição</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 lg:gap-5">
                <div className="p-3 lg:p-4 rounded-lg bg-green-100 text-green-600 mt-0.5 flex-shrink-0">
                  <Shield className="h-5 w-5 lg:h-7 lg:w-7" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">Segurança</h3>
                  <p className="text-sm lg:text-base xl:text-lg text-gray-600">Proteção total dos dados da sua escola</p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Footer */}
        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-300/50">
          <div className="text-center space-y-2 lg:space-y-3">
            <p className="text-sm lg:text-base text-gray-700 font-medium">
              Sistema de Gestão Escolar Inteligente
            </p>
            <a 
              href="https://www.smartgesti.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm lg:text-base xl:text-lg text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              <Globe className="h-4 w-4 lg:h-5 lg:w-5" />
              www.smartgesti.com.br
            </a>
            <p className="text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2">
              © 2024 SmartGesti. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
