import { v4 } from 'uuid';
import { TreeNode } from '../..';

export const testCaseDataTree: TreeNode = {
  id: 'root',
  text: 'Test Cases',
  display: { block: true },
  nodes: [
    {
      id: v4(),
      text: 'auth',
      nodes: [
        {
          id: v4(),
          text: 'login',
          nodes: [
            {
              id: v4(),
              text: 'must be able to login with an existing user',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must display an error for an invalid password',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must display an error for missing email address',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must display an error for missing password',
              nodes: [],
            },
          ],
        },
        {
          id: v4(),
          text: 'register',
          nodes: [
            {
              id: v4(),
              text: 'must be able to register a new account and complete setup',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must validate missing password',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must validate missing email',
              nodes: [],
            },
          ],
        },
      ],
    },
    {
      id: v4(),
      text: 'meals',
      nodes: [
        {
          id: v4(),
          text: 'add',
          nodes: [
            {
              id: v4(),
              text: 'must be able to add new meal with name and uploaded image',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must be able to add new meal with name and image search',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must validate that a name has been provided',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must validate that an image has been provided',
              nodes: [],
            },
          ],
        },
        {
          id: v4(),
          text: 'edit',
          nodes: [
            {
              id: v4(),
              text: 'must be able to navigate to the meal edit screen',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must be able to change the name of a meal',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must be able to add ingredients to a meal',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must be able to create ingredient lines using the enter key',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must be able to edit ingredients list',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must be able to delete a meal',
              nodes: [],
            },
          ],
        },
        {
          id: v4(),
          text: 'list',
          nodes: [
            {
              id: v4(),
              text: 'must be able to view existing meals in the list',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must show meals sorted in alphabetical order',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must be able to search for a meal',
              nodes: [],
            },
          ],
        },
      ],
    },
    {
      id: v4(),
      text: 'plan',
      nodes: [
        {
          id: v4(),
          text: 'ingredients',
          nodes: [
            {
              id: v4(),
              text: 'must show all ingredients for all meals you have planned',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must be able to check off ingredients',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must persist which ingredients have been checked off when refreshing the page',
              nodes: [],
            },
            {
              id: v4(),
              text: 'must persist which ingredients have been checked off when navigating back and forward without a refresh',
              nodes: [],
            },
          ],
        },
      ],
    },
  ],
};
