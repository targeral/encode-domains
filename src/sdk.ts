import path from 'path';
import { transformAsync, transformSync } from '@babel/core';
import { fs } from '@modern-js/utils';
import type { Options } from './babel-plugin';

export type { Options };

export const transformCodeAsync = async (code: string, options?: Options) => {
  const result = await transformAsync(code, {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [[require('./babel-plugin'), options ?? {}]],
  });

  if (result === null || !result.code) {
    throw new Error('Could not transform file');
  }

  return result.code;
};

export const transformCodeSync = (code: string, options?: Options) => {
  const result = transformSync(code, {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [[require('./babel-plugin'), options ?? {}]],
  });

  if (result === null || !result.code) {
    throw new Error('Could not transform file');
  }

  return result.code;
};

export const transformFileAsync = async (
  options: { targetFilePath: string; outputFilePath?: string } & Options,
) => {
  const { targetFilePath, outputFilePath } = options;
  const content = await fs.readFile(targetFilePath, 'utf-8');
  const outputCode = await transformCodeAsync(content, options);

  const filePath =
    outputFilePath ?? path.join(process.cwd(), './encode-domain');

  fs.ensureFileSync(filePath);
  fs.writeFileSync(filePath, outputCode);
};

export const transformUrl = (str: string) => {
  return `atob(${btoa(str)})`;
};
