// @ts-check
'use strict';

const { ESLintUtils } = require('@typescript-eslint/utils');

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/farmos/farmos-mobile/blob/main/eslint-local-rules/${name}.js`,
);

/**
 * The branded nominal types that must never be operated on with JS math.
 * These are defined in the app's precision layer (see Phase 1) as type
 * aliases named exactly `Money` / `Quantity`. The rule keys on that alias name
 * (and on any `__brand` intersection member) so it fires the moment a value of
 * that type flows into an arithmetic position.
 */
const BRANDS = new Set(['Money', 'Quantity']);

const ARITHMETIC_BINARY = new Set(['+', '-', '*', '/', '%', '**']);
const ARITHMETIC_ASSIGN = new Set(['+=', '-=', '*=', '/=', '%=', '**=']);

/**
 * Walk a TS type (through unions, intersections and aliases) looking for a
 * Money/Quantity brand. Returns the brand name if found, else null.
 * @param {import('typescript').Type | undefined} type
 * @param {Set<import('typescript').Type>} seen
 * @returns {string | null}
 */
function collectBrand(type, seen) {
  if (!type || seen.has(type)) return null;
  seen.add(type);

  const aliasName = type.aliasSymbol && type.aliasSymbol.getName();
  if (aliasName && BRANDS.has(aliasName)) return aliasName;

  const symbol =
    typeof type.getSymbol === 'function' ? type.getSymbol() : undefined;
  const symbolName = symbol && symbol.getName();
  if (symbolName && BRANDS.has(symbolName)) return symbolName;

  if (typeof type.isIntersection === 'function' && type.isIntersection()) {
    for (const member of type.types) {
      const brand = collectBrand(member, seen);
      if (brand) return brand;
    }
  }
  if (typeof type.isUnion === 'function' && type.isUnion()) {
    for (const member of type.types) {
      const brand = collectBrand(member, seen);
      if (brand) return brand;
    }
  }
  return null;
}

module.exports = createRule({
  name: 'no-money-arithmetic',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow JavaScript arithmetic operators on Money or Quantity values; use the decimal.js-light helpers instead.',
    },
    schema: [],
    messages: {
      noArithmetic:
        'Arithmetic on a `{{brand}}` value is banned — IEEE-754 math silently corrupts decimal precision. Use the decimal helpers (add/sub/mul/div/cmp) instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    const services = ESLintUtils.getParserServices(context);

    /** @param {import('@typescript-eslint/utils').TSESTree.Node} node */
    function brandOf(node) {
      const type = services.getTypeAtLocation(node);
      return collectBrand(type, new Set());
    }

    /**
     * @param {import('@typescript-eslint/utils').TSESTree.Node} node
     * @param {string} brand
     */
    function report(node, brand) {
      context.report({ node, messageId: 'noArithmetic', data: { brand } });
    }

    return {
      BinaryExpression(node) {
        if (!ARITHMETIC_BINARY.has(node.operator)) return;
        const brand = brandOf(node.left) ?? brandOf(node.right);
        if (brand) report(node, brand);
      },
      AssignmentExpression(node) {
        if (!ARITHMETIC_ASSIGN.has(node.operator)) return;
        const brand = brandOf(node.left) ?? brandOf(node.right);
        if (brand) report(node, brand);
      },
      UnaryExpression(node) {
        if (node.operator !== '-' && node.operator !== '+') return;
        const brand = brandOf(node.argument);
        if (brand) report(node, brand);
      },
      UpdateExpression(node) {
        const brand = brandOf(node.argument);
        if (brand) report(node, brand);
      },
    };
  },
});
