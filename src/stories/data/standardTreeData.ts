import { v4 } from 'uuid';
import { TreeNode } from '../..';

export const standardTreeData: TreeNode = {
  id: 'root',
  text: 'Animals',
  display: { block: true },
  nodes: [
    {
      id: v4(),
      text: 'Dogs',
      nodes: [
        {
          id: v4(),
          text: 'Bulldog',
          nodes: [],
        },
        {
          id: v4(),
          text: 'German Shepard',
          nodes: [],
        },
        {
          id: v4(),
          text: 'Golden Retriever',
          nodes: [],
        },
        {
          id: v4(),
          text: 'Poodle',
          nodes: [],
        },
      ],
    },
    {
      id: v4(),
      text: 'Cats',
      nodes: [
        {
          id: v4(),
          text: 'Persian Cat',
          nodes: [],
        },
        {
          id: v4(),
          text: 'Maine Cat',
          nodes: [],
        },
        {
          id: v4(),
          text: 'British Shorthair',
          nodes: [],
        },
      ],
    },
    {
      id: v4(),
      text: 'Birds',
      nodes: [
        {
          id: v4(),
          text: 'Parrot',
          nodes: [
            {
              id: v4(),
              text: 'African Grey Parrots',
              nodes: [],
            },
            {
              id: v4(),
              text: 'Cockatoos',
              nodes: [],
            },
            {
              id: v4(),
              text: 'Macaws',
              nodes: [],
            },
            {
              id: v4(),
              text: 'Parrotlet',
              nodes: [],
            },
            {
              id: v4(),
              text: 'Cockatiel',
              nodes: [],
            },
            {
              id: v4(),
              text: 'Senegal Parrot',
              nodes: [],
            },
          ],
        },
        {
          id: v4(),
          text: 'Owl',
          nodes: [
            {
              id: v4(),
              text: 'Sooty Owl',
              nodes: [],
            },
            {
              id: v4(),
              text: 'Barn owl',
              nodes: [],
            },
            {
              id: v4(),
              text: 'Barking Owl',
              nodes: [],
            },
          ],
        },
      ],
    },
  ],
};
