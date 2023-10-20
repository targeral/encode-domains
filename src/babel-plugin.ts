import { type PluginObj, type PluginPass, types as t } from '@babel/core';

export interface Options {
  filter?: (value: string) => boolean;
  urls?: string[];
}

export default (): PluginObj => {
  return {
    name: 'encode-domain',
    visitor: {
      ObjectProperty(nodePath, { opts }: PluginPass) {
        const { filter, urls = [] } = opts as Options;
        if (t.isStringLiteral(nodePath.node.value)) {
          const propertyValue = nodePath.node.value;

          if (
            propertyValue.value.startsWith('http') ||
            propertyValue.value.startsWith('https') ||
            urls.includes(propertyValue.value) ||
            filter?.(propertyValue.value)
          ) {
            const originalValue = propertyValue.value;
            nodePath.node.value = t.callExpression(t.identifier('atob'), [
              t.stringLiteral(btoa(originalValue)),
            ]);
          }
        }
      },
      VariableDeclarator(nodePath, { opts }) {
        const { filter, urls = [] } = opts as Options;
        if (t.isStringLiteral(nodePath.node.init)) {
          const originalValue = nodePath.node.init.value;
          if (
            originalValue.startsWith('http') ||
            originalValue.startsWith('https') ||
            urls.includes(originalValue) ||
            filter?.(originalValue)
          ) {
            nodePath.node.init = t.callExpression(t.identifier('atob'), [
              t.stringLiteral(btoa(originalValue)),
            ]);
          }
        }
      },
    },
  };
};
