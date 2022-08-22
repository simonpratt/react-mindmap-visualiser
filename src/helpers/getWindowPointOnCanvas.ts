import { CANVAS_SCALE_FACTOR } from '../constants/render.constants';

export const getWindowPointOnCanvas = (canvas2D: CanvasRenderingContext2D, x: number, y: number) => {
  const transformationMatrix = canvas2D.getTransform();

  // Point on the screen -> where it is now on the canvas -> subtract back to find original point
  const domPoint = new window.DOMPoint(x * CANVAS_SCALE_FACTOR, y * CANVAS_SCALE_FACTOR);
  // const canvasPoint = domPoint.matrixTransform(transformationMatrix);
  const canvasPoint = transformationMatrix.inverse().transformPoint(domPoint);

  return {
    x: canvasPoint.x,
    y: canvasPoint.y,
  };
};
