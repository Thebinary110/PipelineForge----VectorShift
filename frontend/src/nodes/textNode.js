/** textNode.js — Text node registration. Passes dynamicInputs to enable {{variable}} handle detection in BaseNode. */
import { BaseNode } from './BaseNode';
import { NODE_CONFIGS } from './nodeConfig';

export const TextNode = ({ id, data }) => (
  <BaseNode id={id} data={data} {...NODE_CONFIGS.text} dynamicInputs={[]} />
);
