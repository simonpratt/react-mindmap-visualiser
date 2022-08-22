import { getWordsFromText } from './getWordsFromText';

const getWordsForOneLine = (canvas2D: CanvasRenderingContext2D, words: string[], maxWidth: number): string[] => {
  // Check for only one word
  if (words.length === 1) {
    return words;
  }

  // Check to see if they all fit
  const allWordsMeasure = canvas2D.measureText(words.join(' '));
  if (allWordsMeasure.width < maxWidth) {
    return words;
  }

  // Binary search
  let upperBound = words.length;
  let lowerBound = 1;
  let midPoint = upperBound / 2;
  while (midPoint !== upperBound && midPoint !== lowerBound) {
    const midPointWords = words.slice(0, midPoint);
    const midPointPlusOneWords = words.slice(0, midPoint + 1);

    // Check measurement for the midpoint and with one extra word
    const midPointMeasure = canvas2D.measureText(midPointWords.join(' '));
    const midPointPulsOneMeasure = canvas2D.measureText(midPointPlusOneWords.join(' '));

    // If the words are within limit and adding a single word pushes the limit too high, then we've found the spot
    if (midPointMeasure.width <= maxWidth && midPointPulsOneMeasure.width > maxWidth) {
      return midPointWords;
    }

    // If the words are too long, we need to shorten the string
    if (midPointMeasure.width > maxWidth) {
      upperBound = midPoint;
      midPoint = Math.floor(midPoint / 2);
    }

    // If the "plus one" words are too short, we need to lengthen the string
    if (midPointPulsOneMeasure.width < maxWidth) {
      lowerBound = midPoint;
      midPoint = Math.floor(midPoint + (upperBound - midPoint) / 2);
    }

    // Sanity check
    if (midPointMeasure.width <= maxWidth && midPointPulsOneMeasure.width >= maxWidth) {
      throw new Error('Somethings gone wrong....');
    }

    // Nowhere left to search
    if (midPoint === upperBound || midPoint === lowerBound) {
      return midPointWords;
    }
  }

  // Shouldn't get here
  throw new Error('Unexpeted line hit in getWordsForOneLine');
};

export const getTextBlock = (canvas2D: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  let words = getWordsFromText(text);
  const lines = [];
  while (words.length) {
    const wordsForLine = getWordsForOneLine(canvas2D, words, maxWidth);
    lines.push(wordsForLine.join(' '));
    words = words.slice(wordsForLine.length);
  }

  return lines;
};
