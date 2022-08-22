export const renderRounderRect = (
  canvas2D: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  colour: string,
) => {
  // Define the boundary coords
  const x1 = x;
  const y1 = y;
  const x2 = x1 + width;
  const y2 = y1 + height;

  // Draw
  canvas2D.beginPath();
  canvas2D.moveTo(x1 + radius, y1);
  canvas2D.lineTo(x2 - radius, y1);
  canvas2D.arcTo(x2, y1, x2, y1 + radius, radius);
  canvas2D.lineTo(x2, y2 - radius);
  canvas2D.arcTo(x2, y2, x2 - radius, y2, radius);
  canvas2D.lineTo(x1 + radius, y2);
  canvas2D.arcTo(x1, y2, x1, y2 - radius, radius);
  canvas2D.lineTo(x1, y1 + radius);
  canvas2D.arcTo(x1, y1, x1 + radius, y1, radius);

  // Fill
  canvas2D.fillStyle = colour;
  canvas2D.fill();
};
