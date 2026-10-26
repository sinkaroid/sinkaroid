/// <reference types="@types/bun" />
import { resolve } from "path";

const pkgPath = resolve(import.meta.dirname, "../package.json");

// Read current version from package.json
const pkgFile = Bun.file(pkgPath);
const pkgRaw = await pkgFile.text();
const pkg = JSON.parse(pkgRaw);
const currentVersion: string = pkg.version;

// Parse version: e.g. 1.0.1-alpha
const match = currentVersion.match(/^(\d+)\.(\d+)\.(\d+)(-.+)?$/);

if (!match) {
    console.error(`[chore:release] Could not parse version: "${currentVersion}"`);
    process.exit(1);
}

const major = parseInt(match[1]!, 10);
let minor = parseInt(match[2]!, 10);
let patch = parseInt(match[3]!, 10);
const suffix = match[4] ?? "";

// Increment patch
patch += 1;

if (patch > 99) {
    minor += 1;
    patch = 0;
}

const newVersion = `${major}.${minor}.${patch}${suffix}`;

// auto release
const pkgUpdated = pkgRaw.replace(
    `"version": "${currentVersion}"`,
    `"version": "${newVersion}"`
);
await Bun.write(pkgPath, pkgUpdated);

console.log(
    `ci/chore(release): bump manifest to ${newVersion}`
);