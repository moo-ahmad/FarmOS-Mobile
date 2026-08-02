// Metro/Babel config. babel-preset-expo also wires up Reanimated/Worklets and
// (via app.json experiments) the React Compiler; NativeWind adds its JSX runtime
// and the className transform.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
