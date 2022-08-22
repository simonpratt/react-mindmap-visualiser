import { getWindowPointOnCanvas } from './getWindowPointOnCanvas';

export const getVisibleCanvasBounds = (canvas2D: CanvasRenderingContext2D) => {
  const topLeft = getWindowPointOnCanvas(canvas2D, 0, 0);
  const bottomRight = getWindowPointOnCanvas(canvas2D, window.innerWidth, window.innerHeight);

  return {
    x: topLeft.x,
    y: topLeft.y,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y,
  };
};
