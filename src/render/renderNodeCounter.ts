import { SMALL_FONT, SMALL_FONT_SIZE } from '../constants/render.constants';
import { TreeNodeLayout } from '../helpers/getTreeLayout';

const HORIZONTAL_PADDING = 6;
const VERTICAL_PADDING = 4;

export const renderNodeCounter = (canvas2D: CanvasRenderingContext2D, node: TreeNodeLayout) => {
  // Use the text size as the basis for the counter size
  canvas2D.font = SMALL_FONT;
  const textMeasure = canvas2D.measureText(`${node.leafCount}`);
  const counterWidth = textMeasure.width + HORIZONTAL_PADDING * 2;
  const counterHeight = SMALL_FONT_SIZE + VERTICAL_PADDING * 2;

  // Define the boundary coords
  const x1 = node.x + node.width + 10;
  const y1 = node.y - 10;
  const x2 = x1 + counterWidth;
  const y2 = y1 + counterHeight;

  // Draw
  canvas2D.beginPath();
  canvas2D.moveTo(x1, y1);
  canvas2D.lineTo(x1, y2);
  canvas2D.lineTo(x2, y2);
  canvas2D.lineTo(x2, y1);
  canvas2D.lineTo(x1, y1);
  canvas2D.fillStyle = '#83bfff';
  canvas2D.fill();
  canvas2D.lineWidth = 1;
  canvas2D.strokeStyle = '#83bfff';
  canvas2D.stroke();

  // Write text
  canvas2D.fillStyle = '#191919';
  canvas2D.fillText(`${node.leafCount}`, x1 + HORIZONTAL_PADDING, y1 + VERTICAL_PADDING - 2);
};
