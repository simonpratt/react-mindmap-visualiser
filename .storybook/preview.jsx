export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    showPanel: false,
  },
  layout: 'fullscreen'
};

export const decorators = [(Story) => <Story />];
