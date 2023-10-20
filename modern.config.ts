import { moduleTools, defineConfig } from '@modern-js/module-tools';
import { testingPlugin } from '@modern-js/plugin-testing';

export default defineConfig({
  plugins: [moduleTools(), testingPlugin()],
  buildConfig: {
    buildType: 'bundleless',
    sourceMap: true,
    outDir: './lib',
  },
});
