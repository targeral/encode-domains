import path from 'path';
import { transformAsync } from '@babel/core';
import { fs } from '@modern-js/utils';

export const transformCodeAsync = async (code: string) => {
  const result = await transformAsync(code, {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require('./babel-plugin')],
  });

  if (result === null || !result.code) {
    throw new Error('Could not transform file');
  }

  return result.code;
};

export const transformFileAsync = async (
  targetFilePath: string,
  outputFilePath?: string,
) => {
  const content = await fs.readFile(targetFilePath, 'utf-8');
  const outputCode = await transformCodeAsync(content);

  const filePath =
    outputFilePath ?? path.join(process.cwd(), './encode-domain');

  fs.ensureFileSync(filePath);
  fs.writeFileSync(filePath, outputCode);
};

export const transformUrl = (str: string) => {
  return `atob(${btoa(str)})`;
};
