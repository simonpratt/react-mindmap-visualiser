import {
  BLOCK_NODE_PADDING,
  CANVAS_SCALE_FACTOR,
  DEFAULT_FONT,
  HORIZONTAL_SPACE_BETWEEN_BLOCKS,
  TREE_BOUNDARY_PADDING,
  VERTICAL_SPACE_BETWEEN_BLOCKS,
} from '../constants/render.constants';
import { getTextBlock } from './getTextBlock';
import { measureTextBlock } from './measureTextBlock';

export type BlockNodeStyle = 'default' | 'info' | 'success' | 'warn' | 'danger';

export interface TreeNodeDisplay {
  collapsed?: boolean;
  faded?: boolean;
  block?: boolean;
  blockStyle?: BlockNodeStyle;
}

/**
 * Internal interfaces that don't have child nodes
 * This allows for extending without conflicting child node types
 */

interface __TreeNode {
  id: string;
  text: string;
  display?: TreeNodeDisplay;
}

interface __TreeNodeWithNodeSize extends __TreeNode {
  lines: string[];
  width: number;
  height: number;
  leafCount: number;
}

interface __TreeNodeWithTreeSize extends __TreeNodeWithNodeSize {
  treeHeight: number;
  treeWidth: number;
}

interface __TreeNodeWithLayout extends __TreeNodeWithTreeSize {
  x: number;
  y: number;
}

/**
 * Interfaces with child nodes for usage
 */

export interface TreeNode extends __TreeNode {
  nodes: TreeNode[];
}

interface TreeNodeWithNodeSize extends __TreeNodeWithNodeSize {
  nodes: TreeNodeWithNodeSize[];
}

export interface TreeNodeWithLayout extends __TreeNodeWithLayout {
  nodes: TreeNodeWithLayout[];
}

export interface TreeNodeWithTreeSize extends __TreeNodeWithTreeSize {
  nodes: TreeNodeWithTreeSize[];
}

const sum = (numbers: number[]): number => {
  return numbers.reduce((sum, curr) => sum + curr, 0);
};

const getNodesWithNodeSize = (
  canvas2D: CanvasRenderingContext2D,
  node: TreeNode,
  maxWidth: number,
  fontSize: number,
): TreeNodeWithNodeSize => {
  const textBlock = getTextBlock(canvas2D, node.text, maxWidth);
  const expandedNodes = node.nodes.map((node) => getNodesWithNodeSize(canvas2D, node, maxWidth, fontSize));

  const size = measureTextBlock(canvas2D, textBlock, fontSize);
  return {
    ...node,
    id: node.id,
    text: node.text,
    lines: textBlock,
    width: node.display?.block ? size.width + BLOCK_NODE_PADDING * 2 : size.width,
    height: node.display?.block ? size.height + BLOCK_NODE_PADDING * 2 : size.height,
    nodes: expandedNodes,
    leafCount: (expandedNodes.length ? 0 : 1) + sum(expandedNodes.map((_node) => _node.leafCount)),
  };
};

const getFullInvisibleHeight = (canvas2D: CanvasRenderingContext2D, node: TreeNodeWithNodeSize): number => {
  if (!node.nodes.length) {
    return node.height;
  }

  const nodeHeights = node.nodes.map((_node) => getFullInvisibleHeight(canvas2D, _node));
  return sum(nodeHeights) + (node.nodes.length - 1) * VERTICAL_SPACE_BETWEEN_BLOCKS;
};

const getFullInvisibleWidth = (canvas2D: CanvasRenderingContext2D, node: TreeNodeWithNodeSize): number => {
  if (!node.nodes.length) {
    return node.width;
  }

  const treeWidth =
    Math.max(...node.nodes.map((_node) => getFullInvisibleWidth(canvas2D, _node))) +
    node.width +
    HORIZONTAL_SPACE_BETWEEN_BLOCKS;

  return treeWidth;
};

const getNodesWithTreeSize = (canvas2D: CanvasRenderingContext2D, node: TreeNodeWithNodeSize): TreeNodeWithTreeSize => {
  // If there are no children, then the tree height is the same as our own height
  if (!node.nodes.length) {
    return {
      ...node,
      nodes: [],
      treeWidth: node.width,
      treeHeight: node.height,
    };
  }

  // Process child nodes first so that we know what the current nodes height will be
  const nodesWithHeight = node.nodes.map((_node) => getNodesWithTreeSize(canvas2D, _node));

  // Special condition
  // If the node is collapsed, we want to use just this nodes height
  if (node?.display?.collapsed) {
    return {
      ...node,
      nodes: nodesWithHeight,
      treeWidth: node.width,
      treeHeight: node.height,
    };
  }

  // Use the height of the child nodes to calculate what the current node height will be
  const treeHeight =
    sum(nodesWithHeight.map((_node) => _node.treeHeight)) +
    (nodesWithHeight.length - 1) * VERTICAL_SPACE_BETWEEN_BLOCKS;

  // Grap the width of the child nodes, this node, and the gap between
  const treeWidth =
    Math.max(...nodesWithHeight.map((_node) => _node.treeWidth)) + node.width + HORIZONTAL_SPACE_BETWEEN_BLOCKS;

  // Return the updated node with heights
  return {
    ...node,
    nodes: nodesWithHeight,
    treeWidth,
    treeHeight,
  };
};

const setNodePosition = (
  canvas2D: CanvasRenderingContext2D,
  node: TreeNodeWithTreeSize,
  x: number,
  y: number,
): TreeNodeWithLayout => {
  // Start the child y above the current y to spread nodes out evenly
  // Add half our hight back on to return to the midpoint
  let nextNodeY = y - node.treeHeight / 2 + node.height / 2;

  // Loop through each child node and set their position
  return {
    ...node,
    nodes: node.nodes.map((_node) => {
      // Child should be centered within the height that it's tree occupies
      const childTopY = nextNodeY;
      const childBottomY = nextNodeY + _node.treeHeight;
      const childY = (childTopY + childBottomY) / 2 - _node.height / 2;

      const childX = x + node.width + HORIZONTAL_SPACE_BETWEEN_BLOCKS;

      nextNodeY = nextNodeY + _node.treeHeight + VERTICAL_SPACE_BETWEEN_BLOCKS;
      return setNodePosition(canvas2D, _node, childX, childY);
    }),
    x,
    y,
  };
};

const getNodeLayout = (canvas2D: CanvasRenderingContext2D, node: TreeNodeWithTreeSize): TreeNodeWithLayout => {
  // Add some padding to the node
  const nodeWithPadding = {
    ...node,
    treeWidth: node.treeWidth + TREE_BOUNDARY_PADDING * 2,
    treeHeight: node.treeHeight + TREE_BOUNDARY_PADDING * 2,
  };

  // Get the full height of the tree including invisible nodes
  // Use this full height when calcuating the position of the root node
  // This keeps the tree in the same spot collapsing nodes
  const fullTreeHeight = getFullInvisibleHeight(canvas2D, node);
  const fullTreeWidth = getFullInvisibleWidth(canvas2D, node);

  // Calculate position of the root node
  const x = (window.innerWidth * CANVAS_SCALE_FACTOR) / 2 - fullTreeWidth / 2;
  const y = (window.innerHeight * CANVAS_SCALE_FACTOR) / 2;

  // Set the Root node position and then the rest are set recursively
  return setNodePosition(canvas2D, nodeWithPadding, x, y);
};

/**
  @description
  Take a basic text/node tree, perform word wrapping
  Calculate the layout of the tree with the x/y of each child node being relative to it's parents node x/y
**/
export const getTreeLayout = (
  canvas2D: CanvasRenderingContext2D,
  node: TreeNode,
  maxWidth: number,
  fontSize: number,
): TreeNodeWithLayout => {
  // Set to the default text size
  canvas2D.font = DEFAULT_FONT;

  // Iterate over all nodes in the tree, split into lines, and calculate the width + height of each node
  const withNodesSizes = getNodesWithNodeSize(canvas2D, node, maxWidth, fontSize);

  // First calculate all the tree heights of nodes
  const withTreeSizes = getNodesWithTreeSize(canvas2D, withNodesSizes);

  // Recursively calculate the x/y position of each node
  const withLayout = getNodeLayout(canvas2D, withTreeSizes);

  return withLayout;
};
