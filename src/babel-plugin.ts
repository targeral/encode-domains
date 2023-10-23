import { type PluginObj, type PluginPass, types as t } from '@babel/core';
import { HTTP_REGEXP, HTTPS_REGEXP } from './regexp';

export interface Options {
  http?: boolean;
  https?: boolean;
  ignore?: (value: string) => boolean;
  match?: (value: string) => boolean;
  urls?: string[];
}

export const encodeUrlExpression = (
  stringLiteral: t.StringLiteral,
  options: Options,
) => {
  const { value: originalValue } = stringLiteral;
  const { urls = [], ignore, match, http = true, https = true } = options;

  if (ignore?.(originalValue)) {
    return stringLiteral;
  }

  if (
    (http && HTTP_REGEXP.test(originalValue)) ||
    (https && HTTPS_REGEXP.test(originalValue)) ||
    urls.includes(originalValue) ||
    match?.(originalValue)
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
      ObjectProperty({ node }, { opts }: PluginPass) {
        if (t.isStringLiteral(node.key)) {
          node.key = encodeUrlExpression(node.key, opts);
          node.computed = true;
        }

        if (t.isStringLiteral(node.value)) {
          node.value = encodeUrlExpression(node.value, opts);
        }
      },
      VariableDeclarator({ node }, { opts }) {
        const { init } = node;
        if (t.isStringLiteral(init)) {
          node.init = encodeUrlExpression(init, opts);
        }
      },
      ConditionalExpression({ node }, { opts }) {
        const { consequent, alternate } = node;
        if (t.isStringLiteral(consequent)) {
          node.consequent = encodeUrlExpression(consequent, opts);
        }

        if (t.isStringLiteral(alternate)) {
          node.alternate = encodeUrlExpression(alternate, opts);
        }
      },
      BinaryExpression({ node }, { opts }) {
        if (t.isStringLiteral(node.left)) {
          node.left = encodeUrlExpression(node.left, opts);
        }

        if (t.isStringLiteral(node.right)) {
          node.right = encodeUrlExpression(node.right, opts);
        }
      },
      AssignmentExpression({ node }, { opts }) {
        const { right } = node;
        if (t.isStringLiteral(right)) {
          node.right = encodeUrlExpression(right, opts);
        }
      },
      ArrowFunctionExpression({ node }, { opts }) {
        const { body } = node;
        // () => '';
        if (t.isStringLiteral(body)) {
          node.body = encodeUrlExpression(body, opts);
        }
      },
      ReturnStatement({ node }, { opts }) {
        const { argument } = node;
        if (t.isStringLiteral(argument)) {
          node.argument = encodeUrlExpression(argument, opts);
        }
      },
      // 'https://xxx'.xxxx
      MemberExpression({ node }, { opts }) {
        const { object } = node;
        if (t.isStringLiteral(object)) {
          node.object = encodeUrlExpression(object, opts);
        }
      },
    },
  };
};
