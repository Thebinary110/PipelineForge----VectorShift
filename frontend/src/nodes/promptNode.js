/** promptNode.js — Prompt Template node registration. Delegates all rendering to BaseNode. */
import { BaseNode } from './BaseNode';
import { NODE_CONFIGS } from './nodeConfig';

export const PromptNode = ({ id, data }) => (
  <BaseNode id={id} data={data} {...NODE_CONFIGS.promptTemplate} />
);
