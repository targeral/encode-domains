import { transformCodeAsync } from '@/sdk';

describe('Default cases', () => {
  test(`const url = 'https://example.com'`, async () => {
    const code = `const url = 'https://example.com';`;
    const s = await transformCodeAsync(code);
    const expectCode = `const url = atob("aHR0cHM6Ly9leGFtcGxlLmNvbQ==")`;
    expect(s).toMatchSnapshot();
    expect(s).toContain(expectCode);
  });

  test(`const urlObj = {a: 'https://example.com'}`, async () => {
    const code = `const urlObj = {a: 'https://example.com'}`;
    const s = await transformCodeAsync(code);
    const expectCode = `a: atob("aHR0cHM6Ly9leGFtcGxlLmNvbQ==")`;
    expect(s).toMatchSnapshot();
    expect(s).toContain(expectCode);
  });

  test(`const urlObj = true ? 'https://example.com' : 'https://demo.com'`, async () => {
    const code = `const urlObj = true ? 'https://example.com' : 'https://demo.com';`;
    const s = await transformCodeAsync(code);
    const expectResult1 = `atob("aHR0cHM6Ly9leGFtcGxlLmNvbQ==")`;
    const expectResult2 = `atob("aHR0cHM6Ly9kZW1vLmNvbQ==")`;
    expect(s).toMatchSnapshot(s);
    expect(s).toContain(expectResult1);
    expect(s).toContain(expectResult2);
  });

  test(`const isSameUrl = 'https://example.com' === 'https://demo.com';`, async () => {
    const code = `const isSameUrl = 'https://example.com' === 'https://demo.com';`;
    const s = await transformCodeAsync(code);
    const expectResult1 = `atob("aHR0cHM6Ly9leGFtcGxlLmNvbQ==")`;
    const expectResult2 = `atob("aHR0cHM6Ly9kZW1vLmNvbQ==")`;
    expect(s).toMatchSnapshot(s);
    expect(s).toContain(expectResult1);
    expect(s).toContain(expectResult2);
  });

  test(`const urlObj = {a: '//example.com'} with urls option`, async () => {
    const code = `const urlObj = {a: '//example.com'}`;
    const s = await transformCodeAsync(code, { urls: ['//example.com'] });
    expect(s).toMatchSnapshot();
  });

  // TODO: webpack test
});
