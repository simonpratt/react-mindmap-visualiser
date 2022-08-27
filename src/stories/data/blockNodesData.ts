import { TreeNode } from '../..';

export const blockNodesData: TreeNode = {
  id: 'root',
  text: 'Lorem ipsum',
  display: { block: true },
  nodes: [
    {
      id: '1',
      text: 'An info node',
      display: { block: true, blockStyle: 'info' },
      nodes: [],
    },
    {
      id: '2',
      text: 'A success node',
      display: { block: true, blockStyle: 'success' },
      nodes: [],
    },
    {
      id: '3',
      text: 'A warn node',
      display: { block: true, blockStyle: 'warn' },
      nodes: [],
    },
    {
      id: '4',
      text: 'A danger node',
      display: { block: true, blockStyle: 'danger' },
      nodes: [],
    },
  ],
};
