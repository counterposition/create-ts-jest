#!/usr/bin/env node
'use strict';

import { execSync } from 'child_process';
import { mkdir, readdir, realpath, copyFile } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { exit } from 'process';

async function copyFiles(files, dest) {
    const promises = [];
    for (const file of files) {
        const base = basename(file);
        const destfile = join(dest, base);
        const p = copyFile(file, destfile);
        promises.push(p);
    }

    // should probably use allSettled instead
    return Promise.all(promises);
}

async function createDirectories(root) {
    const srcDir = join(root, 'src');
    const distDir = join(root, 'dist');

    await mkdir(srcDir, { recursive: true });
    await mkdir(distDir);
}

async function copyStaticFiles(to_dir) {
    const scriptPath = await realpath(process.argv[1]);
    const dirPath = dirname(scriptPath);
    const staticDir = join(dirPath, 'static');

    const absDest = await realpath(join(process.cwd(), to_dir));

    await readdir(staticDir).then(
        files => {
            const absPaths = files.map(file => join(staticDir, file));
            copyFiles(absPaths, absDest);
        },
        error => { console.log(error) }
    );
}

async function runInitializationScripts(contextDir) {
    execSync('npm init -y', { cwd: contextDir });
    execSync('npm install typescript', { cwd: contextDir });
    execSync('npm install --save-dev jest @types/jest ts-jest', { cwd: contextDir });
}


function preconditions() {
    if (process.argv.length < 3) {
        console.log('Usage: create-ts-jest project_name');
        exit(1);
    }
}

preconditions();

// yes, I know these are too many awaits and need to be made concurrent
const dir = process.argv[2];
await createDirectories(dir);
await copyStaticFiles(dir);
await runInitializationScripts(dir);

/*
TODO: consider regions that require cleanup of resources in case of command
failure (e.g. some file fail to copy, which requires deleting everything and
informing the user).
 */
