const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
module.exports = ({ config, mode }) => {
  config.resolve.extensions.push('.ts', '.tsx', '.vue', '.css', '.less', '.scss', '.sass', '.html');

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': resolve('src'),
    'pkg': resolve('packages'),
  };

  config.module.rules.push({
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader'],
  });

  config.module.rules.push({
    test: /\.stories\.jsx?$/,
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre',
  });

  return config;
};
