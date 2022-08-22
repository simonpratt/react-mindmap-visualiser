import { Meta } from '@storybook/react/types-6-0';
import React, { useContext, useState } from 'react';
import { Mindmap } from '..';
import { generateTree } from './generateTree';

const json = {
  id: 'root',
  text: 'Lorem ipsum',
  blockNode: true,
  nodes: [
    {
      id: '1',
      text: 'Dolor sit amet',
      nodes: [
        {
          id: '2',
          text: 'Consectetur adipiscing elit, sed do eiusmod',
          nodes: [],
        },
        {
          id: '3',
          text: 'Tempor incididunt ut labore',
          nodes: [],
        },
      ],
    },
    {
      id: '4',
      text: 'Aliquip ex ea',
      nodes: [
        {
          id: '5',
          text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum',
          nodes: [],
        },
        {
          id: '6',
          text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          nodes: [],
        },
      ],
    },
  ],
};

export const Standard = () => {
  return <Mindmap json={json} />;
};

export const RandomTree = () => {
  const randomTree = generateTree();
  return <Mindmap json={randomTree} />;
};

export default {
  title: 'Mindmap',
  layout: 'fullscreen',
} as Meta;
