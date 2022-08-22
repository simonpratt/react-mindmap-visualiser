import { TreeNodeLayout } from './getTreeLayout';
import { isCoordinateInRectangle } from './isCoordinateInRectangle';

const isTreNodeAtCoordinate = (x: number, y: number, node: TreeNodeLayout) => {
  return isCoordinateInRectangle(x, y, node.x, node.y, node.width, node.height);
};

export const findTreeNodeAtCoordinate = (x: number, y: number, tree: TreeNodeLayout): TreeNodeLayout | undefined => {
  // Check current node for match
  if (isTreNodeAtCoordinate(x, y, tree)) {
    return tree;
  }

  // Check all children
  for (let i = 0; i < tree.nodes.length; i++) {
    const match = findTreeNodeAtCoordinate(x, y, tree.nodes[i]);

    if (match) {
      return match;
    }
  }
};
