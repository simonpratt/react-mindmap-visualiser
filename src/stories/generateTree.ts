import { LoremIpsum } from 'lorem-ipsum';
import { v4 } from 'uuid';
import { TreeNode } from '../helpers/getTreeLayout';

const BRANCH_WIDTH_MIN = 2;
const BRANCH_WIDTH_MAX = 3;
const DEPTH_MAX = 5;
const NODE_TEXT_MAX_LEN = 3;

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

const generateNode = (currentDepth: number): TreeNode => {
  // Check if the tree should go deeper
  if (currentDepth > DEPTH_MAX || currentDepth + getRandomInt(DEPTH_MAX) > DEPTH_MAX) {
    return {
      id: v4(),
      text: lorem.generateSentences(1),
      nodes: [],
    };
  }

  const childCount = BRANCH_WIDTH_MIN + getRandomInt(BRANCH_WIDTH_MAX - BRANCH_WIDTH_MIN);
  const nodes = [];
  for (let i = 0; i < childCount; i++) {
    nodes.push(generateNode(currentDepth + 1));
  }

  // Not a leaf node, keep going
  return {
    id: v4(),
    text: lorem.generateWords(getRandomInt(NODE_TEXT_MAX_LEN)),
    nodes,
  };
};

export const generateTree = () => generateNode(1);
