export const getWordsFromText = (text: string): string[] => {
  const split = text.split(' ');
  return split.map((word) => word.trim()).filter((word) => !!word);
};
