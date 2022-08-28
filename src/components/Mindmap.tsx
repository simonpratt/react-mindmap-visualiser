import React, { useCallback, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { CANVAS_SCALE_FACTOR, DEFAULT_FONT } from '../constants/render.constants';
import { debugLog } from '../helpers/debugLog';
import { findTreeNodeAtCoordinate } from '../helpers/findTreeNodeAtCoordinate';
import { getTreeAndToggleNodeCollapse } from '../helpers/getTreeAndToggleNodeCollapse';
import { getTreeLayout, TreeNode, TreeNodeWithLayout } from '../helpers/getTreeLayout';
import { getTreeWithSearchTextFilter } from '../helpers/getTreeWithSearchTextFilter';
import { getVisibleCanvasBounds } from '../helpers/getVisibleBounds';
import { getWindowPointOnCanvas } from '../helpers/getWindowPointOnCanvas';
import { useWindowSize } from '../hooks/useLayoutEffect';
import { renderGrid } from '../render/renderGrid';
import { renderTree } from '../render/renderTree';
import Input from './Input';
import UserInput, { ClickModifiers } from './UserInput';

const FilledDiv = styled.div`
  height: 100vh;
  width: 100vw;

  background-color: #424448;
`;

const FillCanvas = styled.canvas`
  height: 100vh;
  width: 100vw;
`;

const InputContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export interface NodeClickActions {
  toggleCollapse: () => void;
}

export interface MindmapProps {
  json: TreeNode;
  onNodeClick?: (node: TreeNode, modifiers: ClickModifiers, actions: NodeClickActions) => void;
}

interface MouseCoords {
  x: number;
  y: number;
}

interface ZoomLevel {
  val: number;
}

interface CanvasInstance {
  canvas: HTMLCanvasElement;
  context2D: CanvasRenderingContext2D;
  width: number;
  height: number;
}

const coordsReducer = (state: MouseCoords, action: MouseCoords) => {
  return {
    x: state.x + action.x,
    y: state.y + action.y,
  };
};

const zoomReducer = (state: ZoomLevel, action: ZoomLevel) => {
  return {
    val: Math.max(0.1, state.val + action.val * 0.001),
  };
};

const Mindmap = ({ json, onNodeClick }: MindmapProps) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [context2D, setContext2D] = useState<CanvasRenderingContext2D>();
  const [tree, setTree] = useState<TreeNode>();
  const [treeLayout, setTreeLayout] = useState<TreeNodeWithLayout>();
  const [searchValue, setSearchValue] = useState('');

  // Instance that is used for drawing to ensure that everything re-renders on window size change
  const [drawingInstance, setDrawingInstance] = useState<CanvasInstance>();

  const [coords, dispatchPan] = useReducer(coordsReducer, { x: 0, y: 0 });
  const [zoom, dispatchZoom] = useReducer(zoomReducer, { val: 1 });

  const [windowWidth, windowHeight] = useWindowSize();

  /**
   * Whenever the JSON changes re-bind to the tree.
   * This state is used so that elsewhere in the app we can change the tree state to trigger re-renderes
   * Probably not the best solution since any json changes will wipe away our changes. Need to use a transform function or something instead
   * TODO: Use a transform function
   */
  useEffect(() => {
    setTree(json);
  }, [json, setTree]);

  /**
   * Search the tree based on the term whenever the term changes
   */
  useEffect(() => {
    debugLog('Searching tree');
    const pruned = getTreeWithSearchTextFilter(json, searchValue);
    setTree(pruned);
  }, [json, searchValue, setTree]);

  /**
   * Hook that is responsible for binding to the canvas element, setting initial size, and persisting to state
   */
  const canvasRef = useCallback(
    (_canvas: HTMLCanvasElement) => {
      if (_canvas !== null) {
        // Set the height of the canvas
        _canvas.width = window.innerWidth * CANVAS_SCALE_FACTOR;
        _canvas.height = window.innerHeight * CANVAS_SCALE_FACTOR;

        // Set to state
        setCanvas(_canvas);
      }
    },
    [setCanvas],
  );

  /**
   * Hook that is responsible for getting and configuring the 2d drawing instance
   */
  useEffect(() => {
    if (!canvas) {
      return;
    }

    // Set the dimensions of the canvas
    canvas.width = windowWidth * CANVAS_SCALE_FACTOR;
    canvas.height = windowHeight * CANVAS_SCALE_FACTOR;

    // Get the context
    const _context2D = canvas?.getContext('2d');

    if (!_context2D) {
      return;
    }

    // Configure the context
    _context2D.font = DEFAULT_FONT;
    _context2D.textBaseline = 'top';

    // Set the context
    setContext2D(_context2D);

    // Set to state
    setDrawingInstance({
      canvas,
      context2D: _context2D,
      width: windowWidth,
      height: windowHeight,
    });
  }, [canvas, setContext2D, setDrawingInstance, windowWidth, windowHeight]);

  /**
   * Re-evaluate the tree layout whenever the tree or 2d canvas changes
   */
  useEffect(() => {
    if (!context2D || !tree) {
      return;
    }

    debugLog('Laying out tree');
    const _treeLayout = getTreeLayout(context2D, tree, 800, 32);
    setTreeLayout(_treeLayout);
  }, [tree, context2D, setTreeLayout]);

  /**
   * Hook to run each time the zoom or pan changes and re-render the tree
   */
  useEffect(() => {
    if (!drawingInstance || !treeLayout) {
      return;
    }

    debugLog('Drawing tree');

    // Set transforms
    drawingInstance.context2D.setTransform(1, 0, 0, 1, 0, 0);
    drawingInstance.context2D.scale(zoom.val, zoom.val);
    drawingInstance.context2D.translate(coords.x, coords.y);

    // Get the visible area and clear
    const visibleBounds = getVisibleCanvasBounds(drawingInstance.context2D);
    drawingInstance.context2D.clearRect(visibleBounds.x, visibleBounds.y, visibleBounds.width, visibleBounds.height);

    // Draw a grid for the visible area
    renderGrid(drawingInstance.context2D, visibleBounds.x, visibleBounds.y, visibleBounds.width, visibleBounds.height);

    // Draw the tree
    renderTree(drawingInstance.context2D, treeLayout, searchValue);
  }, [drawingInstance, coords, zoom, treeLayout, searchValue]);

  ///////////////////////////////////
  // All handlers for input events //

  const handleClick = useCallback(
    (x: number, y: number, modifiers: ClickModifiers) => {
      if (!drawingInstance || !treeLayout || !tree) {
        return;
      }

      const point = getWindowPointOnCanvas(drawingInstance.context2D, x, y);
      const node = findTreeNodeAtCoordinate(point.x, point.y, treeLayout);

      // If no node was clicked, then do nothing
      if (!node) {
        return;
      }

      const toggleCollapseNode = () => {
        const _updatedTree = getTreeAndToggleNodeCollapse(tree, node.id);
        setTree(_updatedTree);
      };

      // If there is no handler just collapse
      if (!onNodeClick) {
        toggleCollapseNode();
        return;
      }

      // Call the click handler
      onNodeClick(node, modifiers, { toggleCollapse: toggleCollapseNode });
    },
    [drawingInstance, onNodeClick, treeLayout, tree],
  );

  const handlePan = useCallback(
    (deltaX: number, deltaY: number) => {
      const xDiff = (deltaX * CANVAS_SCALE_FACTOR) / zoom.val;
      const yDiff = (deltaY * CANVAS_SCALE_FACTOR) / zoom.val;

      dispatchPan({ x: xDiff, y: yDiff });
    },
    [dispatchPan, zoom],
  );

  const handleScroll = useCallback(
    (deltaX: number, deltaY: number) => {
      const diffX = (deltaX * -1.5) / zoom.val;
      const diffY = (deltaY * -1.5) / zoom.val;

      dispatchPan({ x: diffX, y: diffY });
    },
    [zoom, dispatchPan],
  );

  const handleScale = useCallback(
    (deltaScale: number) => {
      dispatchZoom({ val: deltaScale });
    },
    [dispatchZoom],
  );

  return (
    <FilledDiv>
      <UserInput onClick={handleClick} onPan={handlePan} onScroll={handleScroll} onScale={handleScale} />
      <FillCanvas ref={canvasRef} />
      <InputContainer>
        <Input value={searchValue} onChange={setSearchValue} placeholder='Search for nodes' />
      </InputContainer>
    </FilledDiv>
  );
};

export default Mindmap;
