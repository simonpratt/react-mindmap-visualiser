import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { Mindmap } from '..';
import { blockNodesData } from './data/blockNodesData';
import { collapsedTreeData } from './data/collapsedTreeData';
import { standardTreeData } from './data/standardTreeData';
import { generateTree } from './generateTree';

export const Standard = () => {
  return <Mindmap json={standardTreeData} />;
};

export const BlockNodes = () => {
  return <Mindmap json={blockNodesData} />;
};

export const CollapsedNodes = () => {
  return <Mindmap json={collapsedTreeData} />;
};

export const RandomTree = () => {
  const randomTree = generateTree();
  return <Mindmap json={randomTree} />;
};

export default {
  title: 'Mindmap',
  layout: 'fullscreen',
} as Meta;
