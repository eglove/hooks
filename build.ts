import * as fs from 'node:fs';
import * as path from 'node:path';
import {execSync} from 'child_process';
import {build as esbuild} from 'esbuild';
import {globPlugin} from 'esbuild-plugin-glob';
import {rimraf} from "rimraf";

const build = async () => {
    const root = __dirname;

    await rimraf(path.join(root, 'dist')).catch();
    execSync('tsc --project tsconfig.json');

    await esbuild({
        bundle: false,
        entryPoints: ['src/*.ts'],
        loader: {'.ts': 'ts'},
        minify: true,
        outdir: 'dist',
        platform: 'browser',
        plugins: [globPlugin()],
        sourcemap: true,
        target: 'esnext',
    });

    fs.copyFileSync(
        path.join(root, 'package.json'),
        path.join(root, 'dist', 'package.json'),
    );

    execSync('cd dist && npm publish --access public && cd ..');
};

build()
    .then(() => {
        console.info('Complete!');
    })
    .catch(error => {
        console.error(error);
    });
