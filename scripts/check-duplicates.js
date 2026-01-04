#!/usr/bin/env node

/**
 * Duplicate Check Script
 * Checks for duplicate encounters and data sources based on title similarity
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const glob = require('glob');

function loadAllYamlFiles(pattern) {
  const files = glob.sync(pattern);
  const items = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const data = yaml.parse(content);
      items.push({
        file,
        title: data.title,
        type: data.type
      });
    } catch (error) {
      console.warn(`Warning: Could not parse ${file}: ${error.message}`);
    }
  }

  return items;
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findDuplicates(items) {
  const duplicates = [];
  const seen = new Map();

  for (const item of items) {
    const normalized = normalizeTitle(item.title);

    if (seen.has(normalized)) {
      duplicates.push({
        file1: seen.get(normalized),
        file2: item.file,
        title: item.title
      });
    } else {
      seen.set(normalized, item.file);
    }
  }

  return duplicates;
}

function checkSimilarity(title1, title2) {
  const norm1 = normalizeTitle(title1);
  const norm2 = normalizeTitle(title2);

  // Simple Levenshtein-based similarity check
  const words1 = norm1.split(' ');
  const words2 = norm2.split(' ');

  const commonWords = words1.filter(w => words2.includes(w));
  const similarity = commonWords.length / Math.max(words1.length, words2.length);

  return similarity;
}

function findSimilar(items, threshold = 0.7) {
  const similar = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i].type !== items[j].type) continue;

      const similarity = checkSimilarity(items[i].title, items[j].title);
      if (similarity >= threshold) {
        similar.push({
          file1: items[i].file,
          file2: items[j].file,
          title1: items[i].title,
          title2: items[j].title,
          similarity: Math.round(similarity * 100)
        });
      }
    }
  }

  return similar;
}

// Main execution
console.log('Checking for duplicates...\n');

const encounters = loadAllYamlFiles('encounters/**/*.{yaml,yml}');
const datasources = loadAllYamlFiles('datasources/**/*.{yaml,yml}');
const allItems = [...encounters, ...datasources];

console.log(`Found ${encounters.length} encounters and ${datasources.length} data sources\n`);

// Check exact duplicates
const exactDuplicates = findDuplicates(allItems);
if (exactDuplicates.length > 0) {
  console.error('❌ Found exact duplicates:');
  exactDuplicates.forEach(dup => {
    console.error(`\n   Title: "${dup.title}"`);
    console.error(`   File 1: ${dup.file1}`);
    console.error(`   File 2: ${dup.file2}`);
  });
  process.exit(1);
}

// Check similar titles (warning only)
const similarItems = findSimilar(allItems, 0.8);
if (similarItems.length > 0) {
  console.warn('⚠️  Found similar titles (please verify these are not duplicates):');
  similarItems.forEach(sim => {
    console.warn(`\n   "${sim.title1}" (${sim.similarity}% similar)`);
    console.warn(`   File 1: ${sim.file1}`);
    console.warn(`   "${sim.title2}"`);
    console.warn(`   File 2: ${sim.file2}`);
  });
}

console.log('\n✅ No exact duplicates found');
