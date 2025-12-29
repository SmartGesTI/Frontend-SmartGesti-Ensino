import { useParams } from 'react-router-dom'
import { AgentBuilder } from './components/AgentBuilder'

export default function CriarAgenteIA() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="h-[calc(100vh-120px)] -m-4 lg:-m-6">
      <AgentBuilder />
    </div>
  )
}
