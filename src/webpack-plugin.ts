import webpack from 'webpack';
import { RawSource } from 'webpack-sources';
import { transformCodeSync, Options } from './sdk';

export const EncodeDomainsWebpackPlugin = 'EncodeDomainsWebpackPlugin';

export class EncodeDomains {
  options: Options;

  constructor(options: Options) {
    this.options = options || {};
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(EncodeDomainsWebpackPlugin, compilation => {
      compilation.hooks.optimizeChunkAssets.tap(
        EncodeDomainsWebpackPlugin,
        chunks => {
          chunks.forEach(chunk => {
            chunk.files.forEach(fileName => {
              if (fileName.endsWith('.js')) {
                const asset = compilation.assets[fileName];
                const input = asset.source().toString();
                const output = transformCodeSync(input, this.options);
                const source = new RawSource(output);
                compilation.assets[fileName] = source as any;
              }
            });
          });
        },
      );
    });
  }
}
