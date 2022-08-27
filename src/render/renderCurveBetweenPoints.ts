import { HORIZONTAL_SPACE_BETWEEN_BLOCKS } from '../constants/render.constants';

export const renderCurveBetweenPoints = (
  canvas2D: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  // Define the line style
  canvas2D.lineWidth = 4;
  canvas2D.strokeStyle = '#e2e2e2';
  canvas2D.setLineDash([]);

  // Draw the line
  canvas2D.beginPath();
  canvas2D.moveTo(x1, y1);
  canvas2D.bezierCurveTo(
    x1 + HORIZONTAL_SPACE_BETWEEN_BLOCKS / 2,
    y1,
    x2 - HORIZONTAL_SPACE_BETWEEN_BLOCKS / 2,
    y2,
    x2,
    y2,
  );
  canvas2D.stroke();
};
