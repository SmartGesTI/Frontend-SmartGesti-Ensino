import { LandingPageViewerV2 } from '@brunoalz/smartgesti-site-editor'
// Importar CSS da landing page
import '@brunoalz/smartgesti-site-editor/styles/landing-page.css'
import { useSearchParams } from 'react-router-dom'

export default function VerSite() {
  const [searchParams] = useSearchParams()
  const siteId = searchParams.get('id') || ''

  if (!siteId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">
          Site não encontrado
        </p>
      </div>
    )
  }

  return (
    <LandingPageViewerV2
      siteId={siteId}
      apiBaseUrl="/api"
      projectId="ensino"
    />
  )
}
