## Preview

Storybook preview is available at xxxxx

## Installation

- Install peer dependencies
  `npm i -S styled-components@^5.3.5` (and `npm i -D @types/styled-components` if using typescript)
- Install package
  `npm i -S react-mindmap-visualiser`

## Usage

Define your tree structure to match the exported `TreeNode` type
```ts
const tree: TreeNode = {
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
    }
  ],
}
```

Render the `Mindmap` component and pass in your tree
```jsx
import React from 'react';
import { Mindmap } from 'react-mindmap-visualiser';

import { tree } from './example-structure';

export default function Example() {
  return (
    <Mindmap json={tree} />
  )
}
```
