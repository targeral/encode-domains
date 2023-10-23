import {
  encodeDemoUrl,
  encodeExmapleUrl,
  exmapleUrl,
  demoUrl,
} from './constants';
import { transformCodeAsync } from '@/sdk';

describe('Base cases', () => {
  test(`const url = '${exmapleUrl}'`, async () => {
    const code = `const url = '${exmapleUrl}';`;
    const s = await transformCodeAsync(code);
    const expectCode = `const url = ${encodeExmapleUrl}`;
    expect(s).toMatchSnapshot();
    expect(s).toContain(expectCode);
  });

  test(`const urlObj = {a: '${exmapleUrl}'}`, async () => {
    const code = `const urlObj = {a: '${exmapleUrl}'}`;
    const s = await transformCodeAsync(code);
    const expectCode = `a: ${encodeExmapleUrl}`;
    expect(s).toMatchSnapshot();
    expect(s).toContain(expectCode);
  });

  test(`const urlObj = true ? '${exmapleUrl}' : '${demoUrl}'`, async () => {
    const code = `const urlObj = true ? '${exmapleUrl}' : '${demoUrl}';`;
    const s = await transformCodeAsync(code);
    const expectResult1 = `${encodeExmapleUrl}`;
    const expectResult2 = `${encodeDemoUrl}`;
    expect(s).toMatchSnapshot(s);
    expect(s).toContain(expectResult1);
    expect(s).toContain(expectResult2);
  });

  test(`const isSameUrl = '${exmapleUrl}' === '${demoUrl}';`, async () => {
    const code = `const isSameUrl = '${exmapleUrl}' === '${demoUrl}';`;
    const s = await transformCodeAsync(code);
    const expectResult1 = `${encodeExmapleUrl}`;
    const expectResult2 = `${encodeDemoUrl}`;
    expect(s).toMatchSnapshot(s);
    expect(s).toContain(expectResult1);
    expect(s).toContain(expectResult2);
  });

  test(`n.p="${exmapleUrl}"`, async () => {
    const code = `n.p="${exmapleUrl}"`;
    const s = await transformCodeAsync(code);
    expect(s).toMatchSnapshot(s);
    expect(s).toContain(`${encodeExmapleUrl}`);
  });

  // TODO: webpack test
});
