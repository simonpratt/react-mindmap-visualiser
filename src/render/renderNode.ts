import { BLOCK_NODE_PADDING } from '../constants/render.constants';
import { themeColors } from '../constants/theme';
import { TreeNodeDisplay, TreeNodeWithLayout } from '../helpers/getTreeLayout';
import { renderNodeCounter } from './renderNodeCounter';
import { renderRounderRect } from './renderRoundedRect';
import { renderText } from './renderText';

const getTextColor = (display: TreeNodeDisplay) => {
  if (display?.block) {
    return '#191919';
  }

  if (display?.faded) {
    return '#adabab';
  }

  return '#e2e2e2';
};

const getBlockColor = (display: TreeNodeDisplay) => {
  if (!display?.block) {
    return '#e2e2e2';
  }

  switch (display?.blockStyle) {
    case 'info':
      return themeColors.statusInfo.main;
    case 'success':
      return themeColors.statusSuccess.main;
    case 'warn':
      return themeColors.statusWarn.main;
    case 'danger':
      return themeColors.statusDanger.main;
    case 'default':
    default:
      return '#e2e2e2';
  }
};

export const renderNode = (canvas2D: CanvasRenderingContext2D, node: TreeNodeWithLayout, searchTerm: string) => {
  const { display = {} } = node;

  // If we're at a block node, render the block and adjust coords
  const nodeX = display.block ? node.x + BLOCK_NODE_PADDING : node.x;
  const nodeY = display.block ? node.y + BLOCK_NODE_PADDING : node.y;
  if (display.block) {
    renderRounderRect(canvas2D, node.x, node.y + 3, node.width, node.height, 10, getBlockColor(display));
  }

  // Render the main node
  renderText(canvas2D, node.lines, nodeX, nodeY, getTextColor(display), searchTerm);

  // If this node is collapsed, we want to render a counter and no children
  if (display.collapsed) {
    renderNodeCounter(canvas2D, node);
    return;
  }
};
