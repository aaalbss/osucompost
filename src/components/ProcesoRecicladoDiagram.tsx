import React, { useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', data: { label: 'Recolectar basura orgánica' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Clasificar y separar' }, position: { x: 300, y: 100 } },
  { id: '3', data: { label: 'Procesar y convertir en compost' }, position: { x: 500, y: 100 } },
  { id: '4', data: { label: 'Usar el compost en agricultura' }, position: { x: 700, y: 100 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.Arrow } },
  { id: 'e2-3', source: '2', target: '3', animated: true, markerEnd: { type: MarkerType.Arrow } },
  { id: 'e3-4', source: '3', target: '4', animated: true, markerEnd: { type: MarkerType.Arrow } },
];

const ProcessDiagram = () => {
  const [nodes] = useState(initialNodes);
  const [edges] = useState(initialEdges);

  const handleNodeClick = (event, node) => {
    alert(`Proceso: ${node.data.label}`); // Muestra más información sobre el proceso al hacer clic
  };

  return (
    <div style={{ height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={handleNodeClick} // Interacción al hacer clic en un nodo
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default ProcessDiagram;
