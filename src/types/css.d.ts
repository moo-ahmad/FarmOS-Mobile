// Ambient declarations so TypeScript accepts CSS imports used by the web target
// (Expo's Metro web bundler supports global CSS and CSS modules).

declare module '*.css';

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
