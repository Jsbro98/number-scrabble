/* eslint-disable no-undef */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
        modules: false,
      },
    ],
    '@babel/preset-typescript',
  ],
};
