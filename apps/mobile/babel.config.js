module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '~assets': './assets',
            '^~(.+)': './src/\\1'
          },
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
      ]
    ]
  };
};
