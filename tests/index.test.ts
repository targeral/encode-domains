import { transformCodeAsync } from '@/sdk';

const exmapleUrl = `https://example.com`;
const encodeExmapleUrl = `atob("aHR0cHM6Ly9leGFtcGxlLmNvbQ==")`;

const demoUrl = `https://demo.com`;
const encodeDemoUrl = `atob("aHR0cHM6Ly9kZW1vLmNvbQ==")`;

describe('Default cases', () => {
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

  test(`const urlObj = {a: '//example.com'} with urls option`, async () => {
    const code = `const urlObj = {a: '//example.com'}`;
    const s = await transformCodeAsync(code, { urls: ['//example.com'] });
    expect(s).toMatchSnapshot();
  });

  // TODO: webpack test
});
