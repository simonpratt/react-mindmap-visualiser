import { TreeNode } from './getTreeLayout';

export const getTreeAndToggleNodeCollapse = (node: TreeNode, id: string): TreeNode => {
  return {
    ...node,
    nodes: node.nodes.map((_node) => getTreeAndToggleNodeCollapse(_node, id)),
    display: {
      ...node.display,
      collapsed: node.id === id && node.nodes.length ? !node.display?.collapsed : node.display?.collapsed,
    },
  };
};
