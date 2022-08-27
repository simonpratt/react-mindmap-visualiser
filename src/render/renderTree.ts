import { ANCHOR_X_OFFSET, HORIZONTAL_SPACE_BETWEEN_BLOCKS } from '../constants/render.constants';
import { TreeNodeWithLayout } from '../helpers/getTreeLayout';
import { renderCurveBetweenNodes } from './renderCurveBetweenNodes';
import { renderNode } from './renderNode';

export const renderTree = (canvas2D: CanvasRenderingContext2D, node: TreeNodeWithLayout, searchTerm: string) => {
  renderNode(canvas2D, node, searchTerm);

  // If this node is collapsed, we don't want to continue rendering
  if (node.display?.collapsed) {
    return;
  }

  // Render child nodes
  node.nodes.map((_node) => renderTree(canvas2D, _node, searchTerm));

  // Render the line between current node and all child nodes
  node.nodes.forEach((_node) => {
    renderCurveBetweenNodes(canvas2D, node, _node);
  });
};
