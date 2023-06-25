module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
      [
        'module-resolver',
        {
          root: ['src'],
          alias: { '~': './src' },
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.json',
            '.tsx',
            '.ts',
            '.native.js'
          ]
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
