import { projectBuilder } from '@ethang/project-builder/project-builder.js';

await projectBuilder('hooks', 'main', {
  scripts: ['bun x taze latest -I', 'bun lint'],
  publishDirectory: 'dist',
  isLibrary: true,
  tsConfigOverrides: {
    include: ['src'],
    compilerOptions: {
      emitDeclarationOnly: true,
    },
  },
  tsupOptions: {
    format: ['esm'],
    minify: true,
    outDir: 'dist',
    entry: ['src/*'],
  },
});
