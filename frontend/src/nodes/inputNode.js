/** inputNode.js — Input node registration. Delegates all rendering to BaseNode. */
import { BaseNode } from './BaseNode';
import { NODE_CONFIGS } from './nodeConfig';

export const InputNode = ({ id, data }) => (
  <BaseNode id={id} data={data} {...NODE_CONFIGS.customInput} />
);
