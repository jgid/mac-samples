#!/usr/bin/env node
// Bundles the Deskview app (App.tsx + src/**) into a single ESM file for Expo Snack:
//   ../snack/App.js           – the bundle (all native/runtime packages stay external)
//   ../snack/dependencies.json – external packages with versions from package.json
//   ../snack/snack-link.txt   – Snack URL that loads App.js from raw.githubusercontent.com
//
// Usage:  node scripts/build-snack.mjs          (write files, print link)
//         node scripts/build-snack.mjs --check  (exit 1 if committed files are stale)
import { build, transform } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SNACK_DIR = resolve(APP_DIR, '..', 'snack');
const REPO = 'jgid/mac-samples';
const BRANCH = 'claude/desktop-browser-app';
const RAW_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/desktop-browser/snack/App.js`;
const CHECK = process.argv.includes('--check');

const pkg = JSON.parse(readFileSync(join(APP_DIR, 'package.json'), 'utf8'));

// Packages that must never be bundled (native modules / provided by the Snack runtime).
const EXTERNAL_RE =
  /^(react|react-native|react-native-webview|react-native-view-shot|react-native-safe-area-context|@react-native-async-storage\/async-storage|@expo\/vector-icons|expo|expo-[a-z0-9-]+)(\/.*)?$/;
// Provided by Snack itself for the selected SDK -> not listed in the `dependencies` URL param.
const SNACK_PROVIDED = new Set(['react', 'react-native', 'expo']);

const packageName = (spec) => {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
};

const usedExternals = new Set();
const externalsPlugin = {
  name: 'snack-externals',
  setup(b) {
    b.onResolve({ filter: /^[^./]/ }, (args) => {
      if (EXTERNAL_RE.test(args.path)) {
        usedExternals.add(packageName(args.path));
        return { path: args.path, external: true };
      }
      return undefined; // anything else gets bundled (or fails loudly)
    });
  },
};

const HEADER = `// GENERATED – do not edit; source in desktop-browser/app
// Built by desktop-browser/app/scripts/build-snack.mjs (npm run build:snack).
// Deskview – desktop web viewer for iPhone. Load in Expo Snack / Expo Go.
`;

async function bundle() {
  const result = await build({
    absWorkingDir: APP_DIR,
    entryPoints: [join(APP_DIR, 'App.tsx')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    target: 'es2020',
    jsx: 'automatic',
    loader: { '.ts': 'ts', '.tsx': 'tsx' },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    mainFields: ['react-native', 'module', 'main'],
    define: { __DEV__: 'false' },
    legalComments: 'none',
    charset: 'utf8',
    banner: { js: HEADER },
    plugins: [externalsPlugin],
    logLevel: 'warning',
  });
  const code = result.outputFiles[0].text;

  // Sanity checks: only external bare imports, no relative imports, valid JS.
  const importRe = /(?:^|[\s;])(?:import|export)\b[^'"]*?from\s*['"]([^'"]+)['"]|(?:^|[\s;])import\s*['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)|\brequire\(\s*['"]([^'"]+)['"]\s*\)/gm;
  for (const m of code.matchAll(importRe)) {
    const spec = m[1] || m[2] || m[3] || m[4];
    if (!EXTERNAL_RE.test(spec)) throw new Error(`Bundle contains non-external import: ${spec}`);
  }
  await transform(code, { loader: 'js', format: 'esm', target: 'es2020' }); // throws on syntax errors
  return code;
}

// All external runtime packages from package.json (not only the currently imported ones),
// so the Snack link stays stable while the source evolves.
function dependencies() {
  for (const name of usedExternals) {
    if (!pkg.dependencies[name]) {
      throw new Error(`External "${name}" is imported but missing in package.json dependencies`);
    }
  }
  const deps = {};
  for (const name of Object.keys(pkg.dependencies).sort()) {
    // Exact installed versions: Snack resolves ranges less reliably than pinned versions.
    if (EXTERNAL_RE.test(name)) deps[name] = installedVersion(name) ?? pkg.dependencies[name].replace(/^[~^]/, '');
  }
  return deps;
}

function installedVersion(name) {
  try {
    return JSON.parse(readFileSync(join(APP_DIR, "node_modules", name, "package.json"), 'utf8')).version;
  } catch {
    return null;
  }
}

function snackLink(deps) {
  const depList = Object.entries(deps)
    .filter(([name]) => !SNACK_PROVIDED.has(name))
    .map(([name, v]) => `${name}@${v}`)
    .join(',');
  const params = new URLSearchParams({
    platform: 'ios',
    supportedPlatforms: 'ios',
    name: 'Deskview',
    description: 'Websites wie auf einem echten Monitor ansehen und mit Maus-Cursor bedienen',
    dependencies: depList,
    sourceUrl: RAW_URL,
  });
  return `https://snack.expo.dev/?${params.toString()}`;
}

const code = await bundle();
const deps = dependencies();
const link = snackLink(deps);
const outputs = {
  'App.js': code,
  'dependencies.json': JSON.stringify(deps, null, 2) + '\n',
  'snack-link.txt': link + '\n',
};

if (CHECK) {
  const stale = Object.entries(outputs).filter(([file, content]) => {
    const p = join(SNACK_DIR, file);
    return !existsSync(p) || readFileSync(p, 'utf8') !== content;
  });
  if (stale.length) {
    console.error(`snack/ is out of date (${stale.map(([f]) => f).join(', ')}). Run: npm run build:snack`);
    process.exit(1);
  }
  console.log('snack/ is up to date.');
} else {
  mkdirSync(SNACK_DIR, { recursive: true });
  for (const [file, content] of Object.entries(outputs)) writeFileSync(join(SNACK_DIR, file), content);
  console.log(`Wrote snack/App.js (${(code.length / 1024).toFixed(1)} KB), dependencies.json, snack-link.txt`);
  console.log(`Imported externals: ${[...usedExternals].sort().join(', ')}`);
  console.log(`\nSnack link:\n${link}`);
}
