#!/usr/bin/env node
/**
 * compress_models.mjs
 * -------------------
 * Reads all .glb files from assets/models3d/, applies Draco mesh compression
 * and texture compression, then writes optimized .glb files to public/models3d/.
 *
 * Usage:  node scripts/compress_models.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, quantize, prune, draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const INPUT_DIR = join(ROOT, 'assets', 'models3d');
const OUTPUT_DIR = join(ROOT, 'public', 'models3d');

async function main() {
  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Initialize Draco encoder/decoder
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    });

  // Find all .glb files
  const files = readdirSync(INPUT_DIR).filter(f => f.endsWith('.glb'));

  if (files.length === 0) {
    console.log('No .glb files found in', INPUT_DIR);
    return;
  }

  console.log(`Found ${files.length} model(s) to compress:\n`);

  for (const file of files) {
    const inputPath = join(INPUT_DIR, file);
    const outputPath = join(OUTPUT_DIR, file);

    const inputSize = statSync(inputPath).size;
    console.log(`  Processing: ${file} (${(inputSize / 1024 / 1024).toFixed(1)} MB)`);

    // Read the document
    const document = await io.read(inputPath);

    // Apply optimizations
    await document.transform(
      dedup(),                // Remove duplicate meshes/textures
      prune(),                // Remove unused nodes/materials
      quantize(),             // Quantize vertex attributes
      draco(),                // Apply Draco compression
    );

    // Write the optimized file
    await io.write(outputPath, document);

    const outputSize = statSync(outputPath).size;
    const ratio = ((1 - outputSize / inputSize) * 100).toFixed(1);
    console.log(`  ✓ Output:   ${file} (${(outputSize / 1024 / 1024).toFixed(1)} MB) — ${ratio}% smaller\n`);
  }

  console.log('Done! Compressed models saved to public/models3d/');
}

main().catch(err => {
  console.error('Compression failed:', err);
  process.exit(1);
});
