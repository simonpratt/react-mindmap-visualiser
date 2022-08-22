import { TreeNode } from './getTreeLayout';

export const getTreeWithSearchTextFilter = (node: TreeNode, search: string): TreeNode => {
  // Filter children first
  const childrenWithSearch = node.nodes.map((_node) => getTreeWithSearchTextFilter(_node, search));

  // Prune nodes without match
  const withMatch = childrenWithSearch.filter(
    (_node) => _node.text.toLowerCase().includes(search.toLowerCase()) || _node.nodes.length,
  );

  // Return this node with the pruned children
  return {
    ...node,
    nodes: withMatch,
  };
};
