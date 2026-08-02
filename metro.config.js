// Metro config: Expo defaults wrapped with NativeWind so Tailwind classes in
// `src/global.css` are compiled into styles.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/global.css' });
