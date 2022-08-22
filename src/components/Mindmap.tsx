import React, { useCallback, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { CANVAS_SCALE_FACTOR, DEFAULT_FONT } from '../constants/render.constants';
import { findTreeNodeAtCoordinate } from '../helpers/findTreeNodeAtCoordinate';
import { getTreeAndToggleNodeCollapse } from '../helpers/getTreeAndToggleNodeCollapse';
import { getTreeLayout, TreeNode, TreeNodeLayout } from '../helpers/getTreeLayout';
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

interface MindmapProps {
  json: TreeNode;
  onNodeClick?: (node: TreeNode, modifiers: ClickModifiers) => undefined | 'collapse';
}

interface MouseCoords {
  x: number;
  y: number;
}

interface ZoomLevel {
  val: number;
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
  const [context2D, setContext2D] = useState<CanvasRenderingContext2D>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [tree, setTree] = useState<TreeNode>();
  const [treeLayout, setTreeLayout] = useState<TreeNodeLayout>();
  const [searchValue, setSearchValue] = useState('');

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
    const pruned = getTreeWithSearchTextFilter(json, searchValue);
    setTree(pruned);
  }, [searchValue, setTree]);

  /**
   * Hook that is responsible for binding to the canvas element, setting initial size, and persisting to state
   */
  const canvasRef = useCallback(
    (_canvas: HTMLCanvasElement) => {
      if (_canvas !== null) {
        // Set the height of the canvas
        _canvas.width = windowWidth * CANVAS_SCALE_FACTOR;
        _canvas.height = windowHeight * CANVAS_SCALE_FACTOR;

        // Set to state
        setCanvas(_canvas);
      }
    },
    [setCanvas, windowWidth, windowHeight],
  );

  /**
   * Hook that is responsible for getting and configuring the 2d drawing instance
   */
  useEffect(() => {
    // Get the context
    const _context2D = canvas?.getContext('2d');

    if (!_context2D) {
      return;
    }

    // Configure the context
    _context2D.font = DEFAULT_FONT;
    _context2D.textBaseline = 'top';

    // Set to state
    setContext2D(_context2D);
  }, [canvas, setContext2D]);

  /**
   * Re-evaluate the tree layout whenever the tree or 2d canvas changes
   */
  useEffect(() => {
    if (!context2D || !tree) {
      return;
    }

    const _treeLayout = getTreeLayout(context2D, tree, 800, 32);
    setTreeLayout(_treeLayout);
  }, [tree, context2D, setTreeLayout]);

  /**
   * Hook to run each time the zoom or pan changes and re-render the tree
   */
  useEffect(() => {
    if (!canvas || !context2D || !treeLayout) {
      return;
    }

    // Set transforms
    context2D.setTransform(1, 0, 0, 1, 0, 0);
    context2D.scale(zoom.val, zoom.val);
    context2D.translate(coords.x, coords.y);

    // Get the visible area and clear
    const visibleBounds = getVisibleCanvasBounds(context2D);
    context2D.clearRect(visibleBounds.x, visibleBounds.y, visibleBounds.width, visibleBounds.height);

    // Draw a grid for the visible area
    renderGrid(context2D, visibleBounds.x, visibleBounds.y, visibleBounds.width, visibleBounds.height);

    // Draw the tree
    renderTree(context2D, treeLayout, searchValue);
  }, [context2D, coords, zoom, treeLayout, searchValue]);

  ///////////////////////////////////
  // All handlers for input events //

  const handleClick = useCallback(
    (x: number, y: number, modifiers: ClickModifiers) => {
      if (!context2D || !treeLayout || !tree) {
        return;
      }

      const point = getWindowPointOnCanvas(context2D, x, y);
      const node = findTreeNodeAtCoordinate(point.x, point.y, treeLayout);

      // If no node was clicked, then do nothing
      if (!node) {
        return;
      }

      // If there is no handler just collapse
      if (!onNodeClick) {
        const _updatedTree = getTreeAndToggleNodeCollapse(tree, node.id);
        setTree(_updatedTree);
        return;
      }

      // Call the click handler
      const clickResult = onNodeClick(node, modifiers);
      if (clickResult === 'collapse') {
        const _updatedTree = getTreeAndToggleNodeCollapse(tree, node.id);
        setTree(_updatedTree);
        return;
      }
    },
    [context2D, treeLayout, tree],
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
    [zoom, dispatchPan, dispatchZoom],
  );

  const handleScale = useCallback(
    (deltaScale: number) => {
      dispatchZoom({ val: deltaScale });
    },
    [zoom, dispatchPan, dispatchZoom],
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
