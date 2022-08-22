import { TreeNode } from './getTreeLayout';

export const getTreeAndToggleNodeCollapse = (node: TreeNode, id: string): TreeNode => {
  return {
    ...node,
    nodes: node.nodes.map((_node) => getTreeAndToggleNodeCollapse(_node, id)),
    collapsed: node.id === id && node.nodes.length ? !node.collapsed : node.collapsed,
  };
};
