import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { Mindmap, TreeNode, ClickModifiers, NodeClickActions } from '..';
import { blockNodesData } from './data/blockNodesData';
import { collapsedTreeData } from './data/collapsedTreeData';
import { largerTreeData } from './data/largerTreeData';
import { standardTreeData } from './data/standardTreeData';
import { testCaseDataTree } from './data/testCaseTreeData';
import { generateTree } from './generateTree';

export const Standard = () => {
  return <Mindmap json={standardTreeData} />;
};

export const LargeTree = () => {
  return <Mindmap json={largerTreeData} />;
};

export const BlockNodes = () => {
  return <Mindmap json={blockNodesData} />;
};

export const CollapsedNodes = () => {
  return <Mindmap json={collapsedTreeData} />;
};

export const ClickableNodes = () => {
  const onClick = (node: TreeNode, modifiers: ClickModifiers, actions: NodeClickActions) => {
    const modifiersString = Object.entries(modifiers)
      .filter(([key, val]) => !!val)
      .map(([key]) => key)
      .join(',');

    alert(
      modifiersString.length
        ? `Node clicked: ${node.text} with modifiers: ${modifiersString}`
        : `Node clicked: ${node.text}`,
    );
    const shouldCollapse = confirm('Collapse node?');

    if (shouldCollapse) {
      actions.toggleCollapse();
    }
  };
  return <Mindmap json={standardTreeData} onNodeClick={onClick} />;
};

export const TestCases = () => {
  return <Mindmap json={testCaseDataTree} />;
};

export const RandomTree = () => {
  const randomTree = generateTree();
  return <Mindmap json={randomTree} />;
};

export default {
  title: 'Mindmap',
  layout: 'fullscreen',
} as Meta;
