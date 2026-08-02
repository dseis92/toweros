import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'native/index': 'src/native/index.ts',
    'web/index': 'src/web/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-native'],
  treeshake: true,
  splitting: false,
});
