/** apiNode.js — API Call node registration. Delegates all rendering to BaseNode. */
import { BaseNode } from './BaseNode';
import { NODE_CONFIGS } from './nodeConfig';

export const ApiNode = ({ id, data }) => (
  <BaseNode id={id} data={data} {...NODE_CONFIGS.apiCall} />
);
