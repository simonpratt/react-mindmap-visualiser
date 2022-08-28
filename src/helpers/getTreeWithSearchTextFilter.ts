import { TreeNode } from './getTreeLayout';

export const getTreeWithSearchTextFilter = (node: TreeNode, search: string, parentMatches?: boolean): TreeNode => {
  // Check to see we are now entering part of a tree with a match that has already been found
  const nodeMatches = node.text.toLowerCase().includes(search.toLowerCase());
  const treeHasMatch = parentMatches || nodeMatches;

  // Search children first
  const childrenWithSearch = node.nodes.map((_node) => getTreeWithSearchTextFilter(_node, search, treeHasMatch));

  // Prune nodes without match, unless one of the parents already matches
  const withMatch = treeHasMatch
    ? childrenWithSearch
    : childrenWithSearch.filter(
        (_node) => _node.text.toLowerCase().includes(search.toLowerCase()) || _node.nodes.length,
      );

  // Return this node with the pruned children
  return {
    ...node,
    nodes: withMatch,
    display: {
      ...node.display,
      ...(!nodeMatches && { faded: true }),
    },
  };
};
