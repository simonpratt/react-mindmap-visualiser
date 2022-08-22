import { LINE_SPACING_FACTOR } from '../constants/render.constants';

interface TextBlockMeasurement {
  height: number;
  width: number;
}

export const measureTextBlock = (
  canvas2D: CanvasRenderingContext2D,
  lines: string[],
  fontSize: number,
): TextBlockMeasurement => {
  const width = lines.reduce((max, curr) => {
    const measure = canvas2D.measureText(curr);
    return measure.width > max ? measure.width : max;
  }, 0);

  const height = lines.length * fontSize + (lines.length - 1) * fontSize * LINE_SPACING_FACTOR;

  return {
    width,
    height,
  };
};
