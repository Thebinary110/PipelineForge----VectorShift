/** mergeNode.js — Merge node registration. Delegates all rendering to BaseNode. */
import { BaseNode } from './BaseNode';
import { NODE_CONFIGS } from './nodeConfig';

export const MergeNode = ({ id, data }) => (
  <BaseNode id={id} data={data} {...NODE_CONFIGS.merge} />
);
