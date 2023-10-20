import { type PluginObj, types as t } from '@babel/core';

export default (): PluginObj => {
  return {
    name: 'encode-domain',
    visitor: {
      ObjectProperty(nodePath) {
        if (t.isStringLiteral(nodePath.node.value)) {
          const propertyValue = nodePath.node.value;
          if (
            propertyValue.value.startsWith('http') ||
            propertyValue.value.startsWith('https')
          ) {
            const originalValue = propertyValue.value;
            nodePath.node.value = t.callExpression(t.identifier('atob'), [
              t.stringLiteral(btoa(originalValue)),
            ]);
          }
        }
      },
      VariableDeclarator(nodePath) {
        if (t.isStringLiteral(nodePath.node.init)) {
          const originalValue = nodePath.node.init.value;
          if (
            originalValue.startsWith('http') ||
            originalValue.startsWith('https')
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
