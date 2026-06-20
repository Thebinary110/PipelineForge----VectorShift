/**
 * ui.js
 * Pipeline canvas — ReactFlow wrapper with all 9 node types registered and dark-themed components.
 */

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import { InputNode }     from './nodes/inputNode';
import { LLMNode }       from './nodes/llmNode';
import { OutputNode }    from './nodes/outputNode';
import { TextNode }      from './nodes/textNode';
import { FilterNode }    from './nodes/filterNode';
import { PromptNode }    from './nodes/promptNode';
import { ApiNode }       from './nodes/apiNode';
import { MergeNode }     from './nodes/mergeNode';
import { TransformNode } from './nodes/transformNode';
import { NODE_CONFIGS }  from './nodes/nodeConfig';

import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };

// Defined outside the component so ReactFlow doesn't re-register types on every render
const nodeTypes = {
  customInput:    InputNode,
  llm:            LLMNode,
  customOutput:   OutputNode,
  text:           TextNode,
  filter:         FilterNode,
  promptTemplate: PromptNode,
  apiCall:        ApiNode,
  merge:          MergeNode,
  transform:      TransformNode,
};

const storeSelector = (state) => ({
  nodes:          state.nodes,
  edges:          state.edges,
  getNodeID:      state.getNodeID,
  addNode:        state.addNode,
  onNodesChange:  state.onNodesChange,
  onEdgesChange:  state.onEdgesChange,
  onConnect:      state.onConnect,
});

const miniMapNodeColor = (node) =>
  NODE_CONFIGS[node.type]?.accentColor || '#444444';

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(storeSelector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event?.dataTransfer?.getData('application/reactflow');
      if (!raw) return;

      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[20, 20]}
        connectionLineType="smoothstep"
      >
        <Background
          variant="dots"
          gap={16}
          size={1.5}
          color="var(--dot-color)"
        />
        <Controls />
        <MiniMap
          nodeColor={miniMapNodeColor}
          style={{ background: '#141414' }}
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>
    </div>
  );
};
