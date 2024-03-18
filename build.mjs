import { projectBuilder } from '@ethang/project-builder/project-builder.js';

await projectBuilder('hooks', 'main', {
  preVersionBumpScripts: ['UPDATE', 'PRUNE'],
  postVersionBumpScripts: ['DEDUPE'],
  publishDirectory: 'dist',
  isLibrary: true,
  tsConfigOverrides: {
    include: ['src'],
    compilerOptions: {
      emitDeclarationOnly: true,
    },
  },
  tsupOptions: {
    format: ['cjs', 'esm'],
    minify: true,
    outDir: 'dist',
    entry: ['src/*'],
  },
});
