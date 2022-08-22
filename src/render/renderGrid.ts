import { GRID_SPACING_X, GRID_SPACING_Y } from '../constants/render.constants';

export const renderGrid = (canvas2D: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  // Calc the top left and bottom right coords
  const _x1 = x;
  const _y1 = y;
  const _x2 = _x1 + width;
  const _y2 = _y1 + height;

  // Round the coords up and down so that we always start the loop at a spot where a line should be
  const x1 = Math.floor(_x1 / GRID_SPACING_X) * GRID_SPACING_X;
  const y1 = Math.floor(_y1 / GRID_SPACING_Y) * GRID_SPACING_Y;
  const x2 = Math.ceil(_x2 / GRID_SPACING_X) * GRID_SPACING_X;
  const y2 = Math.ceil(_y2 / GRID_SPACING_Y) * GRID_SPACING_Y;

  // Set the style
  canvas2D.lineWidth = 1;
  canvas2D.strokeStyle = '#616369';
  canvas2D.setLineDash([20, 10]);

  // Draw all of the vertical lines
  for (let i = x1; i <= x2; i += GRID_SPACING_X) {
    canvas2D.beginPath(); // Start a new path
    canvas2D.moveTo(i, y1); // Move the pen to (30, 50)
    canvas2D.lineTo(i, y2); // Draw a line to (150, 100)
    canvas2D.stroke();
  }

  // Draw all of the horizontal lines
  for (let i = y1; i <= y2; i += GRID_SPACING_Y) {
    canvas2D.beginPath(); // Start a new path
    canvas2D.moveTo(x1, i); // Move the pen to (30, 50)
    canvas2D.lineTo(x2, i); // Draw a line to (150, 100)
    canvas2D.stroke();
  }
};
