import { ANCHOR_X_OFFSET } from '../constants/render.constants';
import { TreeNodeWithLayout } from '../helpers/getTreeLayout';
import { renderCurveBetweenPoints } from './renderCurveBetweenPoints';

export const renderCurveBetweenNodes = (
  canvas2D: CanvasRenderingContext2D,
  fromNode: TreeNodeWithLayout,
  toNode: TreeNodeWithLayout,
) => {
  const fromNodeAnchor = {
    x: fromNode.x + fromNode.width + ANCHOR_X_OFFSET,
    y: fromNode.y + fromNode.height / 2 + 4,
  };

  const toNodeAnchor = {
    x: toNode.x - ANCHOR_X_OFFSET,
    y: toNode.y + toNode.height / 2 + 4,
  };

  renderCurveBetweenPoints(canvas2D, fromNodeAnchor.x, fromNodeAnchor.y, toNodeAnchor.x, toNodeAnchor.y);
};
