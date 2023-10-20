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

  // TODO: implement
  test(`const urlObj = true ? 'https://example.com' : 'b'}`, async () => {
    const code = `const urlObj = {a: '//example.com'}`;
    const s = await transformCodeAsync(code);
    expect(s).toMatchSnapshot();
  });

  test(`const urlObj = {a: '//example.com'}`, async () => {
    const code = `const urlObj = {a: '//example.com'}`;
    const s = await transformCodeAsync(code, { urls: ['//example.com'] });
    expect(s).toMatchSnapshot();
  });

  // TODO: webpack test
});
