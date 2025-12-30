import { Node, Edge } from 'reactflow'

/**
 * Aplica um layout hierárquico automático aos nodes baseado nas conexões (edges).
 * Organiza os nodes em camadas horizontais, similar a ferramentas de diagramação de banco de dados.
 * 
 * @param nodes - Array de nodes do ReactFlow
 * @param edges - Array de edges (conexões) do ReactFlow
 * @returns Array de nodes com novas posições calculadas
 */
export function applyAutoLayout(nodes: Node[], edges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes

  // Constantes de espaçamento (nós têm ~280px de largura)
  const HORIZONTAL_SPACING = 400 // Espaçamento horizontal entre camadas
  const VERTICAL_SPACING = 180 // Espaçamento vertical entre nodes na mesma camada
  const START_X = 100 // Posição X inicial
  const START_Y = 100 // Posição Y inicial

  // Criar mapas para facilitar busca
  const incomingEdges = new Map<string, Edge[]>()
  const outgoingEdges = new Map<string, Edge[]>()

  // Inicializar mapas
  nodes.forEach((node) => {
    incomingEdges.set(node.id, [])
    outgoingEdges.set(node.id, [])
  })

  // Preencher mapas de conexões
  edges.forEach((edge) => {
    const sourceEdges = outgoingEdges.get(edge.source) || []
    sourceEdges.push(edge)
    outgoingEdges.set(edge.source, sourceEdges)

    const targetEdges = incomingEdges.get(edge.target) || []
    targetEdges.push(edge)
    incomingEdges.set(edge.target, targetEdges)
  })

  // Função para determinar a camada de um node
  const getNodeLayer = (nodeId: string, layers: Map<string, number>): number => {
    if (layers.has(nodeId)) {
      return layers.get(nodeId)!
    }

    const incoming = incomingEdges.get(nodeId) || []
    
    // Se não tem entrada, está na camada 0
    if (incoming.length === 0) {
      layers.set(nodeId, 0)
      return 0
    }

    // A camada é a máxima das camadas dos nodes de entrada + 1
    const maxLayer = Math.max(
      ...incoming.map((edge) => {
        const sourceLayer = getNodeLayer(edge.source, layers)
        return sourceLayer
      })
    )

    const layer = maxLayer + 1
    layers.set(nodeId, layer)
    return layer
  }

  // Calcular camadas para todos os nodes
  const layers = new Map<string, number>()
  nodes.forEach((node) => {
    getNodeLayer(node.id, layers)
  })

  // Agrupar nodes por camada
  const nodesByLayer = new Map<number, Node[]>()
  nodes.forEach((node) => {
    const layer = layers.get(node.id) || 0
    const layerNodes = nodesByLayer.get(layer) || []
    layerNodes.push(node)
    nodesByLayer.set(layer, layerNodes)
  })

  // Calcular posições
  const updatedNodes = nodes.map((node) => {
    const layer = layers.get(node.id) || 0
    const layerNodes = nodesByLayer.get(layer) || []
    const indexInLayer = layerNodes.findIndex((n) => n.id === node.id)

    // Posição X baseada na camada
    const x = START_X + layer * HORIZONTAL_SPACING

    // Posição Y baseada na posição dentro da camada
    // Centralizar verticalmente os nodes da camada
    const layerHeight = layerNodes.length * VERTICAL_SPACING
    const startY = START_Y - layerHeight / 2 + VERTICAL_SPACING / 2
    const y = startY + indexInLayer * VERTICAL_SPACING

    return {
      ...node,
      position: { x, y },
    }
  })

  return updatedNodes
}
