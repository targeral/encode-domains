import { transformCodeAsync } from '@/sdk';

describe('Options cases', () => {
  test(`const urlObj = {a: '//example.com'} with urls option`, async () => {
    const code = `const urlObj = {a: '//example.com'}`;
    const s = await transformCodeAsync(code, { urls: ['//example.com'] });
    expect(s).toMatchSnapshot();
  });

  test(`const urlObj = {a: '//example.com'} with ignore option`, async () => {
    const code = `const urlObj = {a: 'http://example.com', b: 'http://demo.com'}`;
    const s = await transformCodeAsync(code, {
      ignore: value => /demo.com$/.test(value),
    });
    expect(s).toMatchSnapshot();
  });

  test(`const urlObj = {a: '//example.com'} with match option`, async () => {
    const code = `const urlObj = {a: '//example.com'}`;
    const s = await transformCodeAsync(code, {
      match: value => /example.com$/.test(value),
    });
    expect(s).toMatchSnapshot();
  });
});
