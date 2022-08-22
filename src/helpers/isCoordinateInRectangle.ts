export const isCoordinateInRectangle = (
  coordinateX: number,
  coordinateY: number,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  return coordinateX >= x && coordinateX <= x + width && coordinateY >= y && coordinateY <= y + height;
};
