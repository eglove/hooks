import {projectBuilder} from '@ethang/project-builder/project-builder.js';
import { execSync } from 'child_process';

await projectBuilder('hooks', 'main', {
  preVersionBumpScripts: ['UPDATE', 'PRUNE'],
  postVersionBumpScripts: ['DEDUPE', 'LINT'],
  publishDirectory: 'dist',
  tsupOptions: {
    format: ['cjs', 'esm'],
    minify: true,
    outDir: 'dist',
    entry: ['src/*'],
  }
})

execSync('cd dist && npm publish --access public && cd ..')
