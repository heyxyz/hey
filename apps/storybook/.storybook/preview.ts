import './style.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    html: {
      root: '#html-addon-root',
      removeEmptyComments: true
    },
    controls: {
      hideNoControlsWarning: true
    }
  }
};

export default preview;
