import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ['@tower/database', '@tower/shared', '@tower/validators', 'drizzle-orm'],
  treeshake: true,
  splitting: false,
});
