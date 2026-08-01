/**
 * Nominal branding helper. A `Brand<string, 'Money'>` is still a string at
 * runtime, but the compiler treats it as distinct so a plain string cannot be
 * passed where a `Money` is expected, and the `local/no-money-arithmetic`
 * ESLint rule can recognise it by the `__brand` tag.
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };
