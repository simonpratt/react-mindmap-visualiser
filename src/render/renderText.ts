import { DEFAULT_FONT, DEFAULT_FONT_SIZE, LINE_SPACING_FACTOR } from '../constants/render.constants';

const renderTextHighlightForLine = (
  canvas2D: CanvasRenderingContext2D,
  line: string,
  x: number,
  y: number,
  searchTerm?: string,
) => {
  // If there is no search term, nothing to do
  if (!searchTerm) {
    return;
  }

  // Split based on search term - this will give us lowercase matches
  const lineSplit = line.toLowerCase().split(searchTerm.toLowerCase());

  // If the length is one, then there is no matches
  if (lineSplit.length === 1) {
    return;
  }

  // Take the last item off the split - we don't care about stuff after the last search term match
  lineSplit.pop();

  // Loop over each of the splits and render a highlight at the end of it
  // We want re-extract the sub strings using indexes so that we get the correct case (and consequently spacing)
  let matchStartIndex = 0;
  let matchEndIndex = 0;
  lineSplit.forEach((_substr) => {
    matchStartIndex = matchEndIndex + _substr.length;
    matchEndIndex = matchStartIndex + searchTerm.length;

    // Get the text to the left of this match, and that text including this match
    const textToLeft = line.slice(0, matchStartIndex);
    const textIncludingMatch = line.slice(0, matchEndIndex);

    // Measure both. We want to find the difference between the two and that is our highlight area
    // some text with a MATCH and some
    // |-------------> x
    // |-------------------> x
    // |                xxxxx
    const measuredTextToLeft = canvas2D.measureText(textToLeft);
    const measuredTextToLeftIncludingmatch = canvas2D.measureText(textIncludingMatch);
    const highlightX = x + measuredTextToLeft.width;
    const highlightWidth = measuredTextToLeftIncludingmatch.width - measuredTextToLeft.width;

    // Fill the highlight
    canvas2D.fillStyle = '#4f7fb3';
    canvas2D.fillRect(highlightX, y, highlightWidth, DEFAULT_FONT_SIZE + 6);
  });
};

export const renderText = (
  canvas2D: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  colour: string,
  searchTerm?: string,
) => {
  // Set the font
  canvas2D.font = DEFAULT_FONT;

  lines.forEach((line, index) => {
    // Calc the y position
    const yTotal = y + index * (DEFAULT_FONT_SIZE + DEFAULT_FONT_SIZE * LINE_SPACING_FACTOR);

    // Render any search highlight
    renderTextHighlightForLine(canvas2D, line, x, yTotal, searchTerm);

    // Render the font
    canvas2D.fillStyle = colour;
    canvas2D.fillText(line, x, yTotal);
  });
};
