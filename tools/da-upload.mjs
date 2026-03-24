#!/usr/bin/env node
/**
 * DA Content Upload Script
 *
 * Uploads local content files to Document Authoring (DA).
 *
 * Usage:
 *   node tools/da-upload.mjs --token <YOUR_DA_TOKEN>
 *
 * How to get your DA token:
 *   1. Open https://da.live in your browser and log in
 *   2. Open browser DevTools (F12) → Application → Cookies
 *   3. Copy the value of the "auth_token" cookie
 *   OR
 *   1. Open https://da.live in your browser and log in
 *   2. Open DevTools → Network tab
 *   3. Make any action in DA, find a request to admin.da.live
 *   4. Copy the "Authorization: Bearer <token>" header value (just the token part)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const WORKSPACE = resolve(__dirname, '..');

// Parse project config
const projectConfig = JSON.parse(readFileSync(resolve(WORKSPACE, '.migration/project.json'), 'utf8'));
const contentHostUrl = projectConfig.contentHostUrl; // https://content.da.live/vandanavb/re-eds/
const match = contentHostUrl.match(/content\.da\.live\/([^/]+)\/([^/]+)/);
if (!match) {
  console.error('Could not parse org/repo from contentHostUrl:', contentHostUrl);
  process.exit(1);
}
const [, org, repo] = match;
const DA_ADMIN = `https://admin.da.live/source/${org}/${repo}`;

// Parse CLI args
const args = process.argv.slice(2);
const tokenIdx = args.indexOf('--token');
const token = tokenIdx !== -1 ? args[tokenIdx + 1] : process.env.DA_TOKEN;

if (!token) {
  console.error(`
╔══════════════════════════════════════════════════════════════╗
║  DA Upload - Authentication Required                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Usage:                                                      ║
║    node tools/da-upload.mjs --token <YOUR_TOKEN>             ║
║                                                              ║
║  Or set environment variable:                                ║
║    export DA_TOKEN=<YOUR_TOKEN>                              ║
║    node tools/da-upload.mjs                                  ║
║                                                              ║
║  How to get your token:                                      ║
║    1. Log in to https://da.live                              ║
║    2. Open DevTools → Network tab                            ║
║    3. Click any folder/file in DA                            ║
║    4. Find request to admin.da.live                          ║
║    5. Copy the Authorization header token                    ║
║                                                              ║
║  Target: ${org}/${repo}                                      ║
╚══════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

// Files to upload: [localPath, remotePath]
const uploads = [
  ['da-upload/in/en/home.html', 'in/en/home.html'],
  ['nav.html', 'nav.html'],
];

async function uploadFile(localPath, remotePath) {
  const fullLocal = resolve(WORKSPACE, localPath);
  if (!existsSync(fullLocal)) {
    console.error(`  ✗ File not found: ${localPath}`);
    return false;
  }

  const content = readFileSync(fullLocal);
  const url = `${DA_ADMIN}/${remotePath}`;

  try {
    const formData = new FormData();
    formData.append('data', new Blob([content], { type: 'text/html' }), remotePath.split('/').pop());

    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (resp.ok) {
      console.log(`  ✓ Uploaded: ${remotePath} (${resp.status})`);
      return true;
    }
    const text = await resp.text();
    console.error(`  ✗ Failed: ${remotePath} (${resp.status}) ${text}`);
    return false;
  } catch (err) {
    console.error(`  ✗ Error: ${remotePath} - ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`\nDA Content Upload`);
  console.log(`Target: ${org}/${repo}`);
  console.log(`API: ${DA_ADMIN}\n`);

  let success = 0;
  let failed = 0;

  for (const [localPath, remotePath] of uploads) {
    const ok = await uploadFile(localPath, remotePath);
    if (ok) success++;
    else failed++;
  }

  console.log(`\nDone: ${success} uploaded, ${failed} failed\n`);

  if (success > 0) {
    console.log('Preview your content:');
    for (const [, remotePath] of uploads) {
      const pagePath = remotePath.replace('.html', '');
      console.log(`  https://main--${repo}--${org}.aem.page/${pagePath}`);
    }
  }
}

main();
