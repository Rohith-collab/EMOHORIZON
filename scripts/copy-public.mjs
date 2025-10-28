import { mkdir, copyFile, stat, readdir } from 'fs/promises';
import path from 'path';

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  try {
    const src = path.resolve(process.cwd(), 'public');
    const dest = path.resolve(process.cwd(), 'dist/spa');
    // Only attempt copy if source exists
    try {
      const s = await stat(src);
      if (!s.isDirectory()) return;
    } catch (e) {
      // no public folder, nothing to do
      return;
    }

    await copyDir(src, dest);
    console.log('Copied public/ to dist/spa/');
  } catch (err) {
    console.error('Failed to copy public folder:', err);
    process.exitCode = 1;
  }
}

main();
