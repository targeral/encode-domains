import { type PluginObj, type PluginPass, types as t } from '@babel/core';

export interface Options {
  filter?: (value: string) => boolean;
  urls?: string[];
}

export const encodeUrlExpression = (
  stringLiteral: t.StringLiteral,
  options: Options,
) => {
  const { value: originalValue } = stringLiteral;
  const { urls = [], filter } = options;
  if (
    originalValue.startsWith('http') ||
    originalValue.startsWith('https') ||
    urls.includes(originalValue) ||
    filter?.(originalValue)
  ) {
    return t.callExpression(t.identifier('atob'), [
      t.stringLiteral(btoa(originalValue)),
    ]);
  }

  return stringLiteral;
};

export default (): PluginObj => {
  return {
    name: 'encode-domain',
    visitor: {
      ObjectProperty(nodePath, { opts }: PluginPass) {
        if (t.isStringLiteral(nodePath.node.value)) {
          nodePath.node.value = encodeUrlExpression(nodePath.node.value, opts);
        }
      },
      VariableDeclarator(nodePath, { opts }) {
        const { node } = nodePath;
        const { init } = node;
        if (t.isStringLiteral(init)) {
          node.init = encodeUrlExpression(init, opts);
        } else if (t.isConditionalExpression(init)) {
          const { consequent, alternate } = init;
          if (t.isStringLiteral(consequent)) {
            init.consequent = encodeUrlExpression(consequent, opts);
          }

          if (t.isStringLiteral(alternate)) {
            init.alternate = encodeUrlExpression(alternate, opts);
          }
        }
      },
      BinaryExpression(nodePath, { opts }) {
        const { node } = nodePath;
        if (t.isStringLiteral(node.left)) {
          node.left = encodeUrlExpression(node.left, opts);
        }

        if (t.isStringLiteral(node.right)) {
          node.right = encodeUrlExpression(node.right, opts);
        }
      },
    },
  };
};
