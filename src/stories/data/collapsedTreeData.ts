import { TreeNode } from '../..';

export const collapsedTreeData: TreeNode = {
  id: 'root',
  text: 'Lorem ipsum',
  display: { block: true },
  nodes: [
    {
      id: '1',
      text: 'Dolor sit amet',
      display: { collapsed: true },
      nodes: [
        {
          id: '2',
          text: 'Consectetur adipiscing elit, sed do eiusmod',
          nodes: [],
        },
        {
          id: '3',
          text: 'Tempor incididunt ut labore',
          nodes: [],
        },
      ],
    },
    {
      id: '4',
      text: 'Aliquip ex ea',
      nodes: [
        {
          id: '5',
          text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum',
          nodes: [],
        },
        {
          id: '6',
          text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          nodes: [],
        },
      ],
    },
  ],
};
