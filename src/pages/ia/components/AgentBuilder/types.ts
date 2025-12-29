import { Node, Edge } from 'reactflow'

export interface WorkflowNodeData {
  label: string
  icon: React.ElementType
  color: string
  description: string
  config: Record<string, any>
  category: string
}

export type CustomNode = Node<WorkflowNodeData>
export type CustomEdge = Edge

export interface NodeDefinition {
  id: string
  type: 'input' | 'ai' | 'validation' | 'output'
  category: string
  data: {
    label: string
    icon: React.ElementType
    color: string
    description: string
    config: Record<string, any>
  }
}
